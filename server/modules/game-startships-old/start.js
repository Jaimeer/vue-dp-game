var deepstream = require('deepstream.io-client-js');
var config = require('../../config/config.json')

var Startships = require('./elements/Startships');
var Bullets = require('./elements/Bullets');
var startships, bullets;

function start() {
    var ds = deepstream(config.domain + ':' + config.port);
    ds.login({
        username: 'server'
    }, function () {
        startships = new Startships(ds);
        bullets = new Bullets(ds, startships);
        updateState();
    });

    ds.on('error', function () {
        console.log('error', arguments)
    });
}

function updateState() {
    startships.updateState();
    bullets.updateState();
    setTimeout(updateState, 15);
};

start();