const express = require('express');
const app = express();
const server = require('http').createServer(app);
const cors = require('cors');
const io = require('socket.io')(server, {
    cors : {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

app.use(cors());

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send(`server running`);
})

io.on('connection', (socket) => {
    console.log('conected',socket.id);
    socket.emit('me', socket.id);

    socket.on('disconnect', () => {
        socket.broadcast.emit('callended')
    })

    socket.on('callUser', ({userToCall, signalData, from, name}) => {
        io.to(userToCall).emit('callUser', {signal: signalData, from, name});
    })

    socket.on('answerCall', (data) => {
        io.to(data.to).emit('callAccepted', data.signal)
    })

    socket.on('broadcast-message', (message) => {
        io.to().broadcast.emit('new-broadcast-messsage', {...message, userData})
    })
})

server.listen(PORT, () => {
    console.log(`server running in port ${PORT}`)
})