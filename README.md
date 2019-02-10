[![Build Status](https://travis-ci.com/alexeyvakarchuk/SmmKeeper.svg?branch=master)](https://travis-ci.com/alexeyvakarchuk/SmmKeeper)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

# Smmkeeper

Production link: https://www.smmkeeper.co

### Development instructions

You need to have the Redis server and MongoDB installed. We're using redis for web sockets management with socket.io

Development(server+client) on http://localhost:3004:

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

### Production instructions

At first you need to connect to live server via SSH.

Then go the project folder.

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
