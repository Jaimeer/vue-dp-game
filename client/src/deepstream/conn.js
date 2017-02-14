import deepstream from 'deepstream.io-client-js'

export const client = deepstream('localhost:6020')

let userId = client.getUid()

export function getUserId(){
    return userId
}

export function init() {

  client.on('connectionStateChanged', (state) => {
    console.log('getConnectionState', state)
  })
  client.login({
    username: userId
  }, (success) => {
    console.log('User logged', success)
    if (success) {

    }
  })
}
