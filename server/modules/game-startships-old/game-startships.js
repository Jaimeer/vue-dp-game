var deepstream = require('deepstream.io-client-js')
var config = require('../../config/config.json')
var collections = require('../../config/collections.json')

const client = deepstream(config.domain + ':' + config.port).login()


exports.init = () => {
    client.rpc.provide('setPlayerPosition', (data, response) => {
        console.log('setPlayerPosition', 'data', data)
        let gamePlayerRecord = client.record.getRecord(collections.startships.players + '/' + data.player)
        gamePlayerRecord.whenReady(() => {
            let player = gamePlayerRecord.get()

            console.log('player', player)

            if (!player.pos) {
                console.log('ENTRO')
                player = {
                    pos: {
                        x: 0,
                        y: 0
                    },
                    shoot: {
                        x: 0,
                        y: 0
                    }
                }
            }

            let oldPos = {
                pos: {
                    x: player.pos.x || 0,
                    y: player.pos.y || 0
                },
                shoot: {
                    x: player.shoot.x || 0,
                    y: player.shoot.y || 0
                }
            }

            let newPos = {
                pos: {
                    x: player.pos.x + data.move.x,
                    y: player.pos.y + data.move.y
                },
                shoot: {
                    x: player.shoot.x + data.shoot.x,
                    y: player.shoot.y + data.shoot.y
                }
            }

            const screen = {
                width: 800,
                height: 600
            }

            if (newPos.pos.x > screen.width) newPos.pos.x = screen.width
            if (newPos.pos.y > screen.height) newPos.pos.y = screen.height
            if (newPos.pos.x < 0) newPos.pos.x = 0
            if (newPos.pos.y < 0) newPos.pos.y = 0
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
                let gamePlayerRecord = client.record.getRecord(collections.startships.players + '/' + username)
                gamePlayerRecord.whenReady(() => {
                    gamePlayerRecord.delete()

                    // Delete from list
                    let gamePlayerListRecord = client.record.getList(collections.startships.games + '/game1')
                    gamePlayerListRecord.whenReady(() => {
                        gamePlayerListRecord.removeEntry(username)
                    })
                })
            })
        }
    })
}