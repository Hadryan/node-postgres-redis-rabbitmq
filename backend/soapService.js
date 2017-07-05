const soap = require('soap');
const fs = require('fs');
const wsdl = fs.readFileSync('./wsdl/service.wsdl', 'utf8');
const verifyToken = require('./helpers/jwt').verifyToken;
const Projects = require('./models/projects');
const Sessions = require('./models/sessions');

const checkSession = (token, cb) => {
  verifyToken(token, (err, decoded) => {
    if (err) {
      throw {
        Fault: {
          Code: {
            Value: 'soap:Sender',
            Subcode: { value: 'rpc:Unauthorized' }
          },
          Reason: { Text: 'Token no longer valid. Please login again' },
          statusCode: 403
        }
      };
    }

    Sessions.find(decoded.username, (err, result) => {
      if (err || !result) {
        throw {
          Fault: {
            Code: {
              Value: 'soap:Sender',
              Subcode: { value: 'rpc:Unauthorized' }
            },
            Reason: { Text: 'Token no longer valid. Please login again' },
            statusCode: 403
          }
        };
      }

      cb();
    });
  })
}

const soapService = {
  UpdateService: {
    UpdatePort: {
      UpdateProject: (args, cb, headers) => {
        const projId = args.projId || null;
        const title = args.title || null;
        let token = headers.authorization || null;

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

        if (token && ~token.indexOf('Bearer')) {
          token = token.replace('Bearer ', '');
        }

        checkSession(token, () => {
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
        })
      }
    }
  }
};

const soapServer = (app) => {
  const server = soap.listen(app, '/wsdl', soapService, wsdl);
  server.log = (type, data) => console.log('SOAP Server: ' + type);
};

module.exports = soapServer;