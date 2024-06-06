const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const socketIo = require('socket.io');
const bcryptjs = require('bcryptjs');
require('dotenv').config()

// Criação da fila com limitador
const salt = 10
const criptografado = bcryptjs.hashSync(process.env.PASSWORD_CRYPT, salt)
console.log(criptografado)
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
    bcryptjs.compare(process.env.PASSWORD_CRYPT, req.headers.authentication).then((resultado)=>{
        console.log('OK')
        io.emit('message', req.body);
    }).catch((error)=>{
        console.log('Inválido!')
    })
    
    
});

server.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
