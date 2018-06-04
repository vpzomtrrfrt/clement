FROM node:carbon-alpine
RUN apk update && apk add git && rm -rf /var/cache/apk/*
WORKDIR /usr/src/app
COPY --chown=node index.js .
USER node
EXPOSE 2500
CMD [ "node", "index.js" ]
