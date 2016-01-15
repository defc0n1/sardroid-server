#!/usr/bin/env node
var http = require('http');
var exec = require('child_process').exec;
var createHandler = require('github-webhook-handler');
var handler = createHandler({secret: process.env.WEBHOOK_SECRET || '', path: "/"});

http.createServer(function (req, res) {
    handler(req, res, function(err) {
        res.statusCode = 404;
        res.end('error')
    })
}).listen(31337);

handler.on('push', function (event) {
    if (event.payload.ref === 'refs/heads/master') {
        exec('sh webhook.sh', function(error, stdout, stderr) {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if (error !== null) {
                console.log('exec error: ' + error);
            }
        });
    }
});