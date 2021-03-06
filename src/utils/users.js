const rooms = require('./rooms')

const users = []

const addUser = ({id, username, room}) => {
    // clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    if(!room || !username) {
        return {
            error: 'Username and room are required.'
        }
    }

    // check for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })


    // Validate user
    if(existingUser) {
        return {
            error: 'Username is already in use.'
        }
    }

    // Store user
    const user = {id, username, room}
    users.push(user)
    rooms.addRoom(room)
    return {user}
}

const removeUser = (id) => {
    const index = users.findIndex((user) => {
        return user.id === id
    })
    if(index !== -1) {
        const removedUser = users.splice(index, 1)[0]
        console.log(getUsersInRoom(removedUser.room))
        if(!getUsersInRoom(removedUser.room)[0]) {
            rooms.removeRoom(removedUser.room)
            console.log("Removing Room " + removedUser.room)
        }
        return removedUser
    }
}
const getUser = (id) => {
    return users.find((user) => user.id === id)

}

const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase()
    return users.filter((user) => user.room === room)
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}