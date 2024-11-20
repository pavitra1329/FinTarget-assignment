const cluster = require('cluster');
const http = require('http');
const os = require('os');
const app = require('./app');

if (cluster.isMaster) {
  const numCPUs = os.cpus().length;

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
  });
} else {
  http.createServer(app).listen(3000, () => {
    console.log(`Server running on worker ${process.pid}`);
  });
}
