require('dotenv').config();
const main = require('../index')
const databaseHelper = require('../models');
var queue = require('../queue/queue')

// set global app variable
global.spacepackApiApp = main.app;
global.spacepackApiServer = main.server;
// global.rsmqServer = main.rsmq;

beforeAll(function() {
  queue.clean(0, 'delayed');
  queue.clean(0, 'wait');
  queue.clean(0, 'active');
  queue.clean(0, 'completed');
  queue.clean(0, 'failed');

  let multi = queue.multi();
  multi.del(queue.toKey('repeat'));
  multi.exec();

  return databaseHelper.truncate()
});

// beforeEach(() => {
//   return databaseHelper.truncate();
// });

afterAll(async function(done){
  queue.clean(0, 'delayed');
  queue.clean(0, 'wait');
  queue.clean(0, 'active');
  queue.clean(0, 'completed');
  queue.clean(0, 'failed');

  let multi = queue.multi();
  multi.del(queue.toKey('repeat'));
  multi.exec();

  await databaseHelper.disconnect();
  spacepackApiServer.close(done)
  await done()
});