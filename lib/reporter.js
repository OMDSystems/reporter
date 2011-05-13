var http = require('http');
var os = require('os');

var server = http.createClient(3000, 'localhost')

function startReporter() {
  setTimeout(function() {
    reportStatus();
    startReporter();
  }, 2000);
}

function reportStatus() {
  var status = {
    host: os.hostname(),
    data: {
      freemem: os.freemem(),
      totalmem: os.totalmem(),
      loadavg: os.loadavg()
    }
  }
  console.log(status);
  var req = server.request('POST', '/report', {'content-type': 'application/json'})
  req.write(JSON.stringify(status));
  req.end();
}

startReporter();