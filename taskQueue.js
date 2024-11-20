const Queue = require('bull');
const taskQueue = new Queue('taskQueue', {
  redis: { host: 'localhost', port: 6379 },
});

taskQueue.process(async (job) => {
  const { user_id } = job.data;
  console.log(`${user_id} - Task completed at ${Date.now()}`);
  const fs = require('fs');
  const logMessage = `${user_id} - Task completed at ${Date.now()}\n`;
  fs.appendFileSync('task_logs.txt', logMessage);
});

module.exports = { taskQueue };
