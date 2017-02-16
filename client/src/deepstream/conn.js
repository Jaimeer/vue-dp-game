import deepstream from 'deepstream.io-client-js'

const domain = 'localhost'
// const domainName = '192.168.10.211'
const port = '6020'
export const client = deepstream(domainName + ':' + port)

let userId = client.getUid()

export function getUserId() {
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
