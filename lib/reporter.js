var http = require('http');
var os = require('os');

var server = http.createClient(3000, 'localhost');
var app = http.createClient(9000, 'localhost');

function startReporter() {
  setTimeout(function() {
    console.log("ping");
    reportStatus();
    startReporter();
  }, 2000);
}

function sendStatus(cb) {
  try {
    console.log("requesting...");
    var req = app.request('GET', '/check');
    console.log(req.prototype);
    req.addListener('response', function(res) {
      console.log('response');
      var data = '';
      res.on('data', function(chunk) {
        //console.log('chunk');
        data += chunk;
      });

      //res.addListener('end', function() {
      //  console.log(data);
      //  cb(getStatus(JSON.parse(data).online));
      //});
    });


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
  console.log("reporting...")
  sendStatus(function(status) {
    console.log("got data");
    console.log(status);
    var req = server.request('POST', '/report', {'content-type': 'application/json'})
    req.write(JSON.stringify(status));
    req.end();
  });
}

startReporter();
