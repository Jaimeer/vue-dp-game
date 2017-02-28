var deepstream = require('deepstream.io-client-js')
var config = require('../config/config.json')
const client = deepstream(config.domain + ':' + config.port).login()

let userConnectedData = client.record.getRecord('user-connections');

exports.init = () => {
    client.presence.subscribe((username, isLoggedIn) => {
        console.log('presence:subscribe', username, isLoggedIn)
        client.presence.getAll((clients) => {
            console.log('presence:getAll', clients, clients.length)
            userConnectedData.set('value', clients.length)
        })
    })
}