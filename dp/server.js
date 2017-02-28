var Deepstream = require('deepstream.io'),
    MongoDBStorageConnector = require('deepstream.io-storage-mongodb'),
    RedisCacheConnector = require('deepstream.io-cache-redis'),
    RedisMessageConnector = require('deepstream.io-msg-redis'),
    server = new Deepstream();

const allowStorage = false
const allowCache = false
const allowMessages = false

if (allowStorage) {
    server.set('storage', new MongoDBStorageConnector({
        connectionString: 'mongodb://localhost:32772/testdb',
        splitChar: '/'
    }))
}

if (allowCache) {
    server.set('cache', new RedisCacheConnector({
        port: 32771,
        host: 'localhost'
    }))
}

if (allowMessages) {
    server.set('messageConnector', new RedisMessageConnector({
        port: 32771,
        host: 'localhost'
    }))
}

server.set('host', '0.0.0.0');
server.set('port', 6020);

// server.set( 'tcpHost', '0.0.0.0' );
// server.set( 'tcpPort', 6021 );

var users = {};
server.set('permissionHandler', {
    isReady: true,
    isValidUser: function (handshakeData, authData, callback) {
        console.log('isValidUser', handshakeData, authData)
        if (!users[authData.username]) {
            users[authData.username] = true;
            callback(null, authData.username);
        } else {
            callback('User already logged in');
        }
    },
    canPerformAction: function (username, message, callback) {
        console.log('canPerformAction', username, message)
        callback(null, true);
    },
    onClientDisconnect: function (username) {
        console.log('onClientDisconnect')
        console.log(username)
        delete users[username];
    }
});

/*
server.set( 'dataTransforms', [ {
    topic: 'E',
    action: 'EVT',
    transform: function( data, metaData ) {
        return metaData.sender;
    }
}]);
*/

server.start()