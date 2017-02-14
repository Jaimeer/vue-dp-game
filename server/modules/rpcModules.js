var deepstream = require('deepstream.io-client-js')
const client = deepstream('localhost:6020').login()


exports.init = () => {
    client.rpc.provide('setPlayerPosition', (data, response) => {
        console.log('setPlayerPosition', 'data', data)
        let gamePlayerRecord = client.record.getRecord('game-player-item/' + data.player)
        gamePlayerRecord.whenReady(() => {
            let player = gamePlayerRecord.get()

            let oldPos = {
                posX: player.posX || 0,
                posY: player.posY || 0,
                shootX: player.shootX || 0,
                shootY: player.shootY || 0
            }

            let newPos = {
                posX: player.posX + data.posMove.x,
                posY: player.posY + data.posMove.y,
                shootX: player.shootX + data.posShoot.x,
                shootY: player.shootY + data.posShoot.y
            }

            if (newPos.posX > 100) newPos.posX = 100
            if (newPos.posY > 100) newPos.posY = 100
            if (newPos.posX < 0) newPos.posX = 0
            if (newPos.posY < 0) newPos.posY = 0
            // console.log('setPlayerPosition', 'oldPos', oldPos, 'newPos', newPos)

            gamePlayerRecord.set(newPos)
            response.send('OK')
        })
    })

    // Remove User if logout
    client.presence.subscribe((username, isLoggedIn) => {
        console.log('presence:subscribe', username, isLoggedIn)
        if (!isLoggedIn) {
            client.record.has('game-player-item/' + username, () => {
                let gamePlayerRecord = client.record.getRecord('game-player-item/' + username)
                gamePlayerRecord.whenReady(() => {
                    gamePlayerRecord.delete()

                    // Delete from list
                    let gamePlayerListRecord = client.record.getList('game-players/game1')
                    gamePlayerListRecord.whenReady(() => {
                        gamePlayerListRecord.removeEntry(username)
                    })
                })
            })
        }
    })
}