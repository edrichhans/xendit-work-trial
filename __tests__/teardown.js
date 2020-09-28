const MemoryDatabaseServer = require('./memoryDatabaseServer');

module.exports = async () => {
  await MemoryDatabaseServer.stop();
};