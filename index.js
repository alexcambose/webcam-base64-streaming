const path = require('path')
const express = require('express')
const http = require('http')
const WebSocket = require('ws')

const app = express()
const httpServer = http.createServer(app)

const PORT = process.env.PORT || 3000

const wsServer = new WebSocket.Server({ server: httpServer })

// array of connected websocket clients
let connectedClients = []

wsServer.on('connection', ws => {
    console.log('Connected') // add new connected client

    connectedClients.push(ws) // listen for messages from the streamer, the clients will not send anything so we don't need to filter

    ws.on('message', data => {
        connectedClients.forEach((ws, i) => {
            if (ws.readyState === ws.OPEN) { // check if it is still connected
                ws.send(data) // send
            } else { // if it's not connected remove from the array of connected ws
                connectedClients.splice(i, 1)
            }
        })
    })
})

// HTTP stuff
app.get('/client', (req, res) => res.sendFile(path.resolve(__dirname, './client.html')))
app.get('/streamer', (req, res) => res.sendFile(path.resolve(__dirname, './streamer.html')))

httpServer.listen(PORT, () => console.log(`
    hi,
    1. Open streamer http://localhost:${PORT}/streamer
    2. Open client http://localhost:${PORT}/client
`))
