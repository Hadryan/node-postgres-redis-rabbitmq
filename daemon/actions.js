const q = 'projects';

const feed = (mq, msg) =>
  mq.createChannel((err, ch) => {
    ch.assertQueue(q, { durable: false });
    ch.sendToQueue(q, new Buffer(msg.payload));
    console.log(`---> Postgres to MQ: ${msg.payload}`);
  });

const consume = (mq) =>
  mq.createChannel((err, ch) => {
    ch.assertQueue(q, { durable: false });
    console.log('[*] Consumer waiting for messages...');

    ch.consume(q, (msg) => {
      console.log(`<--- MQ to consumer: ${msg.content.toString()}`);
    }, { noAck: true });
  });

module.exports = {
  feed,
  consume
};