const ws = require('ws')

const wss = new ws.Server({
   port: 5000
}, () => console.log('Server started'))


wss.on('connection', function connection(ws) {
   ws.on('message', function (message) {
      message = JSON.parse(message)
      switch (message.event) {
         case 'message':
            broadcastMessage(message)
            break;
         case 'connection':
            broadcastMessage(message)
            break;
      }
   })
})

function broadcastMessage(message) {
   wss.clients.forEach(client => {
      client.send(JSON.stringify(message))
   })
}


const message = {
   event: 'message/connection',
   id: 123,
   date: '05.07.2022',
   username: 'winnerok',
   message: 'like a video'
}