module.exports = {
  jwtsecret: 'mysecret',
  postgres: {
    host: 'localhost',
    database: 'mydb',
    password: null,
    port: 5432
  },
  redis: {
    host: 'localhost',
    port: 6379
  },
  server: {
    port: 5656
  },
  client: {
    url: 'localhost:3000',
    client_host: 'localhost',
    client_port: 3000
  }
};
