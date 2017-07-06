#!/bin/bash

echo "Intializing pionix demo..."

SERVICE='postgres'

if pgrep -xq -- "${SERVICE}"; then
  echo "Found Posgres instance. Installing dependencies..."
else
  echo "Postgres is currently not running. Please start the database and try again."
  exit 1
fi

# install backend dependencies
cd backend
npm install

# install daemon dependencies
cd ../daemon
npm install

# create tables and add trigger
# to postgres
cd ../db

echo "Creating tables and procedures..."

createdb mydb

for f in *.sql;
do
  psql -f "${f}" mydb
done

echo "Finished initializing pionix demo"

exit 0
