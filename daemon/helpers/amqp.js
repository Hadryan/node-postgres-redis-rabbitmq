const amqp = require('amqplib/callback_api');;
const rabbitmq = require('../config').rabbitmq;

const url = `amqp://${rabbitmq.host}:${rabbitmq.port}`;

const connection = (cb) =>
  amqp.connect(url, (err, conn) => {
    if (err) return handleError(err);

    console.log('\\_/ Daemon connected to RabbitMQ');

    cb(conn);
  });

const handleError = (err) => {
  console.log("RabbitMQ / AMQP Error: ", err);
  process.exit(1);
};

module.exports = connection;