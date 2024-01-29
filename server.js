const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Lista de jogadores conectados
let players = [];
// Índice do jogador atual
let currentPlayerIndex = 0;
// Índice do impostor
let impostorIndex = -1;

// Servir arquivos estáticos
app.use(express.static(__dirname + '/public'));

// Socket.IO
io.on('connection', (socket) => {
    console.log('Novo usuário conectado');

    // Adicionar jogador
    socket.on('addPlayer', (playerName) => {
        console.log('Novo usuário adicionado:', playerName);
        players.push({ id: socket.id, name: playerName });
        io.emit('updatePlayerList', players);
    });

    // Iniciar o jogo
    socket.on('startGame', () => {
        if (players.length < 3) {
            socket.emit('alert', 'Mínimo de 3 jogadores necessários para iniciar o jogo.');
            return;
        }
        impostorIndex = Math.floor(Math.random() * players.length);
        io.emit('gameStarted');
        io.emit('showPlayerTurn', players[currentPlayerIndex].name);
    });

    // Avançar para o próximo jogador
    socket.on('nextPlayer', () => {
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
        if (currentPlayerIndex === 0) {
            io.emit('showEliminationScreen', players);
        } else {
            io.emit('showPlayerTurn', players[currentPlayerIndex].name);
        }
    });

    // Eliminar jogador
    socket.on('eliminatePlayer', (eliminatedPlayerIndex) => {
        players.splice(eliminatedPlayerIndex, 1);
        io.emit('updatePlayerList', players);
        io.emit('playerEliminated');
    });

    // Desconectar jogador
    socket.on('disconnect', () => {
        console.log('Usuário desconectado');
        players = players.filter(player => player.id !== socket.id);
        io.emit('updatePlayerList', players);
    });
});

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
