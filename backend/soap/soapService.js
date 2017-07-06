const soap = require('soap');
const fs = require('fs');
const path = require('path');
const Projects = require('../models/projects');

const wsdl = fs.readFileSync(path.resolve(__dirname, '..', 'wsdl', 'service.wsdl'), 'utf8');

const soapService = {
  UpdateService: {
    UpdatePort: {
      UpdateProject: (args, cb, headers) => {
        const projId = args.projId || null;
        const title = args.title || null;

        if (!projId || !title) {
          throw {
            Fault: {
              Code: {
                Value: 'soap:Sender',
                Subcode: { value: 'rpc:BadArguments' }
              },
              Reason: { Text: 'Project id or title missing' },
              statusCode: 400
            }
          };
        }

        Projects.update({ projId, title }, (err, data, result) => {
          if (err) {
            if (err.constraint && err.constraint === 'projects_title_key') {
              throw {
                Fault: {
                  Code: {
                    Value: 'soap:Sender',
                    Subcode: { value: 'rpc:BadArguments' }
                  },
                  Reason: { Text: 'Project title already taken' },
                  statusCode: 409
                }
              };
            }

            throw {
              Fault: {
                Code: {
                  Value: 'soap:Sender',
                  Subcode: { value: 'rpc:BadArguments' }
                },
                Reason: { Text: 'Database unavailable' },
                statusCode: 500
              }
            };
          }

          if (result.rowCount === 0) {
            throw {
              Fault: {
                Code: {
                  Value: 'soap:Sender',
                  Subcode: { value: 'rpc:BadArguments' }
                },
                Reason: { Text: 'Project id does not exist' },
                statusCode: 409
              }
            };
          }

          return cb({
            message: 'Project updated',
            success: true
          });
        });
      }
    }
  }
};

const soapServer = (app) => {
  const server = soap.listen(app, '/wsdl', soapService, wsdl);
  server.log = (type, data) => console.log('SOAP Server: ' + type);
};

module.exports = soapServer;
