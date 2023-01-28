const client = require("./client");
const { rebuildDB, populateInitialData } = require("./seedData");

rebuildDB()
  .then(populateInitialData)
  .catch(console.error)
  .finally(() => client.end());
