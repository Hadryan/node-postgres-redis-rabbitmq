const app = require('./app');
const initSoapService = require('./soap/soapService');
const callSoapClient = require('./soap/soapClient');

app.listen(app.get('port'), function() {
  console.log(`\n:: Express server listening on ${app.get('port')}\n`);
  
  initSoapService(app);
  // callSoapClient();
});
