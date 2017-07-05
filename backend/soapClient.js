const soap = require('soap');
const url = 'http://localhost:5656/wsdl?wsdl';

const soapClient = () => soap.createClient(url, (err, client) => {
  const args = {
    projId: 5,
    title: 'A brand new title from soapClient'
  };

  client.UpdateProject(args, (err, result, raw) => {
    console.log('SOAP Client: ', result);
  });
});

module.exports = soapClient;