const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io').listen(server)
const users=[]

// 静态站点
app.use('/', express.static(__dirname + '/www'))
server.listen(80)

// socket部分
io.on('connection', socket => {
    // 昵称设置
    socket.on('login', nickname => {
        if (users.indexOf(nickname) > -1) {
            socket.emit('nickExisted')
        } else {
            socket.userIndex = users.length
            socket.nickname = nickname
            users.push(nickname)
            socket.emit('loginSuccess')
            io.sockets.emit('system', nickname, users.length, 'login')
        }
    })

    // 接收新消息
    socket.on('postMsg', msg => {
        // 将消息发送到除自己外的所有用户
        socket.broadcast.emit('newMsg', socket.nickname, msg)
    })

    // 断开连接的事件
    socket.on('disconnect', () => {
        // 将断开连接的用户从users中删除
        users.splice(socket.userIndex, 1)
        // 通知除自己以外的所有人
        socket.broadcast.emit('system', socket.nickname, users.length, 'logout')
    })
});