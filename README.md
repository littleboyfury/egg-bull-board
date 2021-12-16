# egg bull board

<p align="center">
  <a href="https://github.com/vcapretz/bull-board/blob/master/LICENSE">
    <img alt="licence" src="https://img.shields.io/github/license/littleboyfury/egg-bull-board">
  </a>
  <img alt="open issues" src="https://img.shields.io/github/issues/littleboyfury/egg-bull-board"/>
  <a href="https://www.typescriptlang.org/">
    <img src="https://img.shields.io/badge/Typescript-4.3.5-green.svg" alt="typescript">
  </a>
  <a href="https://nodejs.org/en/">
    <img src="https://img.shields.io/badge/node->_v12-green.svg" alt="node">
  </a>
  <a href="https://www.ecma-international.org/publications-and-standards/standards/ecma-262/">
    <img src="https://img.shields.io/badge/Ecmascript-2019+-green.svg" alt="Ecmascript">
  </a>
<p>

## Install

```bash
npm install @skyfury/egg-bull-board -S
```

## bull-board

[bull-board](https://github.com/felixmosh/bull-board)

## Use

[with-egg](exmaple/with-egg/app/router.js)

```javascript
'use strict';

const Bull = require('bull')
const { EggAdapter } = require('@skyfury/egg-bull-board')
const { createBullBoard } = require('@bull-board/api');
const { BullAdapter } = require('@bull-board/api/bullAdapter');

const redisOptions = {
  port: 6379,
  host: 'localhost',
  password: '',
  tls: false,
};

const createQueue = (name) => new Bull(name, { connection: redisOptions });

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;

  const bullQueue = createQueue('bull');
  
  const serverAdapter = new EggAdapter();
  createBullBoard({
    queues: [new BullAdapter(bullQueue)],
    serverAdapter,
  });
  serverAdapter.setBasePath('/ui');
  app.use(serverAdapter.registerPlugin());
  
  router.get('/add', async (ctx) => {
    const opts = ctx.query.opts || {};

    if (opts.delay) {
      opts.delay = +opts.delay * 1000; // delay must be a number
    }

    await bullQueue.add('Add', { title: ctx.query.title }, opts);

    ctx.body = {
      ok: true,
    };
  });

  console.log(`For the UI of instance1, open http://localhost:${app.config.cluster.listen.port}/ui`);
  console.log('Make sure Redis is running on port 6379 by default');
  console.log('To populate the queue, run:');
  console.log(`  curl http://localhost:${app.config.cluster.listen.port}/add?title=Example`);
  console.log('To populate the queue with custom options (opts), run:');
  console.log(`  curl http://localhost:${app.config.cluster.listen.port}/add?title=Test&opts[delay]=9`);
};
```
