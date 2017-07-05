CREATE TABLE users (
  id serial NOT NULL,
  username varchar(10) NOT NULL,
  password varchar(20) NOT NULL,
  CONSTRAINT check_usr_lng CHECK (length(username) >= 5),
  CONSTRAINT check_pwd_lng CHECK (length(password) >= 8),
  PRIMARY KEY(id)
);

CREATE TABLE projects (
  id serial NOT NULL,
  title varchar(100) NOT NULL UNIQUE,
  PRIMARY KEY(id)
);