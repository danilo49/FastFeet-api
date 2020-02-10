import Bee from 'bee-queue';
// import CancellationMail from '../app/jobs/CancellationMail';
import OrderAvailableMail from '../app/jobs/OrderAvailableMail';
import redisConfig from '../config/redis';

const jobs = [OrderAvailableMail];

class Queue {
  constructor() {
    this.queues = {};

    this.init();
  }

  init() {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          redis: redisConfig,
        }),
        handle,
      };
    });
  }

  add(queue, job) {
    return this.queues[queue].bee.createJob(job).save();
  }

  processQueue() {
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key];

      bee.process(handle);
      // bee.on('failed', this.handleFailure).process(handle); // monitoring queue failures
    });
  }

  /* handleFailure(job, err) {
    console.log(`Queue ${job.queue.name}: FAILED`, err);
  } */
}

export default new Queue();