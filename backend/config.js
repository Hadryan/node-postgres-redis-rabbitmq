module.exports = {
  postgres: {
    host: 'localhost',
    database: 'mydb',
    password: null,
    port: 5432
  },
  redis: {
  },
  rabbitmq: {
  },
  server: {
    port: 5656,
    salt_length: 10,
    password_length: 8
  },
  client: {
    url: 'localhost:3000',
    client_host: 'localhost',
    client_port: 3000
  }
};
