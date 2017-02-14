var deepstream = require('deepstream.io-client-js')
const client = deepstream('localhost:6020').login()


exports.init = () => {
    client.rpc.provide('setPlayerPosition', (data, response) => {
        console.log('setPlayerPosition', 'data', data)
        let gameListRecord = client.record.getList('game-player-item/' + data.player).whenReady(() => {
            let player = gameListRecord.get()

            let oldPos = {
                posX: player.posX || 0,
                posY: player.posY || 0,
                fireX: player.fireX || 0,
                fireY: player.fireY || 0
            }

            gameListRecord.set({
                posX: player.posX + data.posMove.x,
                posY: player.posY + data.posMove.y,
                shootX: player.fireX + data.posShoot.x,
                shootY: player.fireY + data.posShoot.y
            })
        })
    })
    /*
    client.rpc.provide('addChat', function (data, response) {
        console.log('addChat', data)
        data.id = client.getUid()
        const chatRecord = client.record.getRecord('chat-item/' + data.id)
        chatRecord.set(data)
        chatListData.addEntry(data.id)
        client.event.emit("chat-msg", 'Added chat[' + data + ']');
        response.send('OK');
    });
    client.rpc.provide('removeChat', function (data, response) {
        console.log('removeChat', data)
        const chatRecord = client.record.getRecord('chat-item/' + data)
        chatRecord.whenReady(() => {
            console.log('removeChat', 'READY')
            chatRecord.delete()
            client.event.emit("chat-msg", 'Removed chat[' + data + ']');
            response.send('OK')
        })
    });
    client.rpc.provide('removeEmit', function (data, response) {
        console.log('removeEmit', data)
        client.event.emit("chat-msg", 'Remote Emit');
        response.send('OK')
    });
    */
}