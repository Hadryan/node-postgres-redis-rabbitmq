const soap = require('soap');
const url = 'http://localhost:5656/service.wsdl?wsdl';

const soapClient = () => soap.createClient(url, (err, client) => {
  if (err) {
    throw new Error(err);
  }

  const args = {
    projId: 5,
    title: 'A brand new title from soapClient'
  };

  client.UpdateProject(args, (err, result, raw) => {
    console.log(':: SOAP Client: ', raw);
  });
});

module.exports = soapClient;