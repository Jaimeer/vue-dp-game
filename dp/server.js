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

server.start()