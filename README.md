# clement
## a little tool for Git mirroring

### Setup
- In the `repos` folder, run `git clone --mirror {source}`
- In the cloned repo, run `git remote add target {target}`
- Add a secret string to `allowed_keys.txt`
- Add a webhook on the source, POST to {clement}/{repo}/update?key={secret}
