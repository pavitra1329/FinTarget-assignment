const express = require('express');
const { checkRateLimits } = require('./rateLimit');
const { taskQueue } = require('./taskQueue');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.post('/task', async (req, res) => {
  const { user_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  const isRateLimited = await checkRateLimits(user_id);
  if (!isRateLimited) {
    await taskQueue.add({ user_id });
    return res.status(429).json({ message: 'Rate limit exceeded. Task queued.' });
  }

  taskQueue.add({ user_id });
  return res.status(200).json({ message: 'Task is being processed' });
});

module.exports = app;
