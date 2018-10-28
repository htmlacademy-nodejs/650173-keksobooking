'use strict';

const {MongoClient} = require(`mongodb`);
const {ExitStatuses} = require(`./constants`);

const MONGO_URL = `mongodb://localhost:27017`;

module.exports = MongoClient.
  connect(MONGO_URL, {useNewUrlParser: true}).
  then((client) => client.db(`offers`)).
  catch((error) => {
    console.error(`Failed to connect to MongoDB`, error);
    process.exit(ExitStatuses.ERROR);
  });
