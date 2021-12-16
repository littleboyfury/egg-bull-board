# egg bull board

## Install

```bash
npm install @skyfury/egg-bull-board -S
```

## bull-board

[bull-board](https://github.com/felixmosh/bull-board)

## Use

```javascript
const { createBullBoard } = require('@bull-board/api');
const { BullMQAdapter } = require('@bull-board/api/bullMQAdapter');
const { EggAdapter } = require('@skyfury/egg-bull-board')

const serverAdapter = new EggAdapter();

createBullBoard({
  queues: [new BullAdapter(someQueue)],
  serverAdapter,
});

serverAdapter.setBasePath('/ui');
await app.use(serverAdapter.registerPlugin());
```
