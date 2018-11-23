[![Build Status](https://travis-ci.com/alexeyvakarchuk/TimeKeeper.svg?token=hEJ3ZFzxz6hQFxCcRXxD&branch=master)](https://travis-ci.com/alexeyvakarchuk/TimeKeeper)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

You need to have the Redis server and MongoDB installed. We're using redis for web sockets management with socket.io

Development(server+client):

```sh
mongod
yarn run redis
yarn run dev
```

Production build(client):

```sh
yarn run prod-frontend
```

Production(server):

```sh
yarn run prod-backend
```
