const cluster = require('cluster');
const os = require('os');

const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running with ${numCPUs} workers`);

    // Fork workers
    for (let i = 0; i < numCPUs; i++) {
        const worker = cluster.fork();

        worker.on('online', () => {
            console.log(`Worker ${worker.process.pid} is online`);
        });
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died (${signal || code}). Restarting...`);
        cluster.fork(); // Automatically restart the worker
    });
}
else {
    require('./index');
};