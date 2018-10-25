#!/usr/bin/env node

var argv = require('minimist')(process.argv.slice(2))

if (argv.help) {
  return console.log([
    '',
    'Usage: elmerglue [--port <port>] [--path <path>] [--ssl] [options]',
    '',
    'A AWS Glue http server, optionally backed by LevelDB',
    '',
    'Options:',
    '--help                 Display this help message and exit',
    '--port <port>          The port to listen on (default: 5678)',
    '--path <path>          The path to use for the LevelDB store (in-memory by default)',
    '--ssl                  Enable SSL for the web server (default: false)',
    '',
    'Report bugs at github.com/mhart/kinesalite/issues',
  ].join('\n'))
}

// If we're PID 1, eg in a docker container, SIGINT won't end the process as usual
if (process.pid == 1) process.on('SIGINT', process.exit)

var server = require('./index.js')(argv).listen(argv.port || 5678, function() {
  var address = server.address(), protocol = argv.ssl ? 'https' : 'http'
  console.log('Listening at %s://%s:%s', protocol, address.address, address.port)
})
