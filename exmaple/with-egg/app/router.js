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
  const { router } = app;

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

  console.log(`For the UI of instance1, open http://localhost:7001/ui`);
  console.log('Make sure Redis is running on port 6379 by default');
  console.log('To populate the queue, run:');
  console.log(`  curl http://localhost:7001/add?title=Example`);
  console.log('To populate the queue with custom options (opts), run:');
  console.log(`  curl http://localhost:7001/add?title=Test&opts[delay]=9`);
};
