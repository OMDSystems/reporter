var http = require('http');
var os = require('os');

var server = http.createClient(3000, 'localhost');
var app = http.createClient(9000, 'localhost');

function startReporter() {
  setTimeout(function() {
    reportStatus();
    startReporter();
  }, 2000);
}

function sendStatus(cb) {
  try {
    var req = app.request('GET', '/check', {host: 'localhost'});
    req.addListener('response', function(res) {
      cb(getStatus(res.statusCode == 200));
    });
    req.end();
  } catch(e) {
    console.log(e);
    cb(getStatus(false));
  }
}

function getStatus(online) {
  return {
    host: os.hostname(),
    online: online,
    data: {
      freemem: os.freemem(),
      totalmem: os.totalmem(),
      loadavg: os.loadavg(),
      cpucount: os.cpus().length
    }
  };
}

function reportStatus() {
  sendStatus(function(status) {
    console.log(status);
    var req = server.request('POST', '/report', {'content-type': 'application/json', host: 'localhost'})
    req.write(JSON.stringify(status));
    req.end();
  });
}

startReporter();
