# node-postgres-redis-rabbitmq

This is a demo project I created to experiment with Node, Postgres, Redis and RabbitMQ.

The backend server exposes a REST API with authentication options and very simple CRUD methods for a projects table in SQL. After login, sessions are stored in Redis as JWT tokens and expire after 5 minutes.

The daemon connects to RabbitMQ and Postgres, waits for changes on the projects table (through triggers) and feeds these as messages to the message queue. A simple consumer deletes these messages once they enter the queue.

### Table of Contents

0. [Prerequisites](#prerequisites)
1. [Install](#install)
2. [Run](#run)
3. [API Routes](#api-routes)
4. [SOAP](#soap)
5. [Notes](#notes)

### Prerequisites

This project uses following services and databases:

Node v7.10.0  
PostgreSQL v9.6.3  
Redis v3.2.9  
RabbitMQ v3.6.9  

Please make sure that all databases are running before installing and running the project.

### Install

Clone project using `git clone https://github.com/timoncp/node-postgres-redis-rabbitmq`

Change active directory to `node-postgres-redis-rabbitmq` and make bash script executable by running `chmod -x ./init.sh`

Run bash script using `./init.sh`. This will install all depencies and initialize Postgres.

### Run

The project contains two separate node applications. One is our backend server, the other is the daemon for RabbitMQ.

To start the backend server, change directory to backend and run `npm start`. The default port is set to `:5656`;

For the daemon there are two options (change to daemon directory first):

* `npm start` to see messages sent and received (and potential errors).

* `npm run daemon` to start a forever process that runs in the background (a daemon). The process can be stopped by calling `npm run kill`.

### API Routes

The API is split into protected routes (everything concerning projects) and public auth routes (create a user, login).

To use the protected routes, you need to login and put the token received in the response as an `HTTP Authorization Header`, or `Authorization` in short.

All routes also respond with a `success` and `message` key on the response body, indicating how the request went. These are not mentioned explicitly again below, in the `Response Body` sections.

#### Auth routes

##### Create user
  `POST localhost:5656/users`

  ```
    Request Body: {
      username: String,
      password: String
    }

    Response Body: {
      data: Array[Object]
    }
  ```

##### Login
  `POST localhost:5656/login`
  
  ```
    Request Body: {
      username: String,
      password: String
    }

    Response Body: {
      data: Array[Object]
      token: String
    }
  ```

##### Get all current projects
  `GET localhost:5656/projects`
  
  ```
    Request Header: {
      Authorization: Session Token
    }

    Response Body: {
      data: Array[Object]
      token: String
    }
  ```

##### Create a new project
  `POST localhost:5656/projects`
  
  ```
    Request Header: {
      Authorization: Session Token
    }

    Request Body: {
      title: String
    }

    Response Body: {
      data: Array[Object]
      token: String
    }
  ```

##### Delete a project
  `DELETE localhost:5656/projects/:id`
  
  ```
    Request Header: {
      Authorization: Session Token
    }

    Request Params: {
      id: Project Id
    }

    Response Body: {
    }
  ```

##### Update a project
  `POST localhost:5656/projects/:id`
  
  ```javascript
    Request Headers: {
      Authorization: Session Token
    }

    Request Params: {
      id: Project Id
    }

    Request Body: {
      title: String
    }

    Respone Body: {
      data: Array[Object]
    }
  ```

### SOAP

When starting the backend server, the `SOAP server` will start as well. The only service exposed is UpdateService, with the method UpdateProject.

##### Update project (SOAP alternative)

`POST localhost:5656/wsdl`

  <small>*This is the only route that uses SOAP. It still requires the HTTP Authorization Header, however the rest of the request must be sent through text/xml like in the example below.*</small>
  
  ```javascript
    Request Headers: {
      Authorization: Session Token,
      Content-Type: text/xml
    }

    SOAP Method: UpdateProject
    SOAP Params: projId, title

    Request Body:

    <soapenv:Envelope
      xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
      xmlns:us="http://localhost:5656/wsdl/UpdateService/">
     <soapenv:Header></soapenv:Header>
     <soapenv:Body>
      <us:UpdateProject>
        <projId>6</projId>
        <title>A brand new SOAP title</title>
      </us:UpdateProject>
     </soapenv:Body>
    </soapenv:Envelope>
  ```

### Notes

Since this is demo purposes, there are no passwords or users setup for any of the databases. In a production environment I would set up special users and access rules, and communication over TLS with the databases if required.

Secondly, I would never save passwords in plain text in the database. My normal procedure is to generate a random, 10 character long (or more) salt for each new user, hash the password with `HMAC` using the salt as a secret and save it that way to the database. When logging in, I would get the user's salt from the database and hash the entered password again with the same algorithm. Then I would it with the hash saved in the database.

Lastly, all of the code in `backend` and `daemon` is written using callbacks. I could have written most of the code using promises as well (which I sometimes prefer), but I chose not to, since the callback pattern seems to reemerge in the Node scene and most people prefer to use it. I could have also used waterfall (or a similar library), but the amount of callbacks used here is still readable enough to not reach callback hell - yet.