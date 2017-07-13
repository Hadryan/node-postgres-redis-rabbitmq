const app = require('./app');
const initSoapService = require('./soap/soapService');

app.listen(app.get('port'), function() {
  console.log(`\n:: Express server listening on ${app.get('port')}\n`);
  
  initSoapService(app);
});
