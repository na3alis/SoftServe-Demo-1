const { userInfo } = require("os")

const io = require("socket.io")(8000, {
    cors: {
        origin: "*",
        method: ["GET", "POST"]
    }
})

let users = []

const addUser = (userId,socketId,userInfo) => {
    const checkUser = users.some(u => u.userId === userId)
    if(!checkUser) {
        users.push({userId,socketId,userInfo})
    }
}

const userRemove = (socketId) => {
    users = users.filter(u => u.socketId !== socketId)
}

io.on("connection", (socket) => {
    console.log("user is connected......")
    socket.on("addUser", (userId, userInfo) => {
        addUser(userId, socket.id, userInfo)
        io.emit("getUser", users)
    })
    socket.on("disconnect", () => {
        console.log("user disconnect......")
        userRemove(socket.id)
        io.emit("getUser", users)
    })
})