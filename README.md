[![Build Status](https://travis-ci.com/alexeyvakarchuk/SmmKeeper.svg?branch=master)](https://travis-ci.com/alexeyvakarchuk/SmmKeeper)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

You need to have the Redis server and MongoDB installed. We're using redis for web sockets management with socket.io

Development(server+client):

```sh
mongod
yarn run redis
yarn run dev
```

Storybook for components documentation:

```sh
yarn run storybook
```

Tests:

```sh
yarn run test
```

Production build(Next.js):

```sh
yarn run build
```

Production server commands(server):

```sh
yarn run serverStart
```

```sh
yarn run serverReload
```

```sh
yarn run stop
```

```sh
yarn run monit
```

```sh
yarn run logs
```
