const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const {generateMessage, generateLocationMessage} = require('./utils/messages')
const {addUser, removeUser, getUser, getUsersInRoom} = require('./utils/users')
const app = express()
const server = http.createServer(app)
const io = socketio(server)
const rooms = require('./utils/rooms')


const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')


app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    socket.on('open_index', ({}, callback) => {
        console.log("Listening.")
        console.log(rooms.getRooms());
        
        callback(undefined, rooms.getRooms())
    })
    
    socket.on('join', ({username, room, existingroom}, callback) => {
        if(existingroom && !room) {
            room = existingroom
        }
        const {error, user} = addUser({id:socket.id, username, room})
        
        if(error) {
            return callback(error)
        }
        
        socket.join(user.room)
        
        socket.emit('message',generateMessage("Welcome!", ""))
        socket.broadcast.to(user.room).emit('message', generateMessage(`${user.username} has joined.`, ""))
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })


        callback()
    })

    socket.on('sendMessage', (text, callback) => {
        const filter = new Filter()
        
        if(filter.isProfane(text)) {
            text = filter.clean(text)
        }
        const user = getUser(socket.id)
        io.to(user.room).emit('message', generateMessage(text,user.username))
        callback('Delivered')
    })    

    socket.on('sendLocation', (coords, callback) => {      
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMessage', generateLocationMessage(
            `https://google.com/maps?q=${coords.latitude},${coords.longitude}`, 
            user.username))
        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if(user) {
            io.to(user.room).emit('message',generateMessage(`${user.username} has left.`, ""))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })
})

server.listen(port, () => {
    console.log("Server is up on port " + port)
})