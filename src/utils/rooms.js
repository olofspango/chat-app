
const rooms = []

const addRoom = (room) => {
    if(!rooms.find((element) => element.room === room)) {
        rooms.push({room})
        console.log("Adding room " + room)
    }    
}
const removeRoom = (room) => {
    const index = rooms.findIndex( (element) => {
        return element.room === room
    })

    if(index !== -1) {
        return rooms.splice(index, 1)[0]
    }

}

const getRooms = () => {
    return rooms
}

module.exports = {addRoom, getRooms, removeRoom}