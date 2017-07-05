const connectPg = require('./helpers/pg');
const connectMQ = require('./helpers/amqp');
const actions = require('./actions');

connectPg((client) => {
  connectMQ((mq) => {
    actions.consume(mq);

    client.on('notification', (msg) => {
      actions.feed(mq, msg);
    });
       
    client.query('LISTEN projects');
  });
});
