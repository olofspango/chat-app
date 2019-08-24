const socket = io()

// Templates
const roomSelectorTemplate =  document.querySelector('#room-selector').innerHTML




socket.emit('open_index', {}, (error, rooms) => {
    if(!rooms[0]) {
        return
    }
    console.log("Emmitting open_index - got: " + error + " and "  + rooms)
    if(error) {
        alert(error)
        return
    }
    const html = Mustache.render(roomSelectorTemplate, {
        rooms
    })

    document.querySelector('#room-dropdown').innerHTML = html


})