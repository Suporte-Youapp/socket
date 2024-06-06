const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const socketIo = require('socket.io');

// Criação da fila com limitador

const app = express();
app.use(bodyParser.json());
const server = http.createServer(app);
const io = socketIo(server,{
    cors:{
        origin:'*',
        methods:['GET','POST']
    }
});

io.on('connection', (socket) => {
    console.log('Usuário conectado');

    socket.on('disconnect', () => {
        console.log('Usuário desconectado');
    });
});

app.post('/webhook', (req, res) => {
    // Adiciona a mensagem à fila
    res.status(200).send();
    console.log(req.body)
    io.emit('message', req.body);
});

server.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
