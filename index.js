const http = require('http');
const qs = require('querystring');
const fs = require('fs');
const path = require('path');
const util = require('util');
const childProcess = require('child_process');

const execAsync = util.promisify(childProcess.exec);

const keys = fs.readFileSync("./allowed_keys.txt").toString().split("\n");

function updateMirror(repo) {
	const wd = path.join(__dirname, "repos", repo + ".git");
	console.log("wd:", wd);
	execAsync("git fetch origin", {cwd: wd})
		.then(() => execAsync("git push --mirror target", {cwd: wd}))
		.then(() => console.log("updated", repo),
			console.error);
}

http.createServer(function(req, res) {
	try {
		let url = req.url;
		const qidx = url.indexOf("?");
		let params = {};
		if(qidx >= 0) {
			const query = url.substring(qidx + 1);
			url = url.substring(0, qidx);
			params = qs.parse(query);
		}

		if(!params.key || keys.indexOf(params.key) < 0) {
			res.writeHead(403, {"Content-type": "text/plain"});
			res.end("Missing or disallowed key");
			return;
		}

		const aidx = url.lastIndexOf("/");
		const action = url.substring(aidx + 1);
		if(action === "update") {
			if(req.method !== "POST") {
				res.writeHead(400, {"Content-type": "text/plain"});
				res.end("update requests must be POST");
				return;
			}
			res.writeHead(200, {"Content-type": "text/plain"});
			res.end("OK");
			updateMirror(url.substring(1, aidx));
		}
		else {
			res.writeHead(404, {"Content-type": "text/plain"});
			res.end("No such action");
		}
	} catch(e) {
		console.error(e);
		try {
			res.writeHead(500, {"Content-type": "text/plain"});
			res.end("Internal Server Error");
		} catch(e) {
			console.error(e);
		}
	}
}).listen(process.env.PORT || 2500);
