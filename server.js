
const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

const PORT = process.env.PORT || 3000;
const ADMIN_PIN = process.env.ADMIN_PIN || '2468';
const QUESTION_TIME = 20;

app.use(express.static(path.join(__dirname, 'public')));

// Coloque aqui suas 60 perguntas originais.
const questions = [
  {
    question: 'Qual recurso ajuda uma pessoa cega a usar o celular?',
    options: [
      'Leitor de tela',
      'Aumentar o brilho',
      'Desligar a internet',
      'Diminuir o volume'
    ],
    answer: 0,
    difficulty: 'Fácil'
  },
  {
    question: 'O que significa acessibilidade?',
    options: [
      'Impedir a participação',
      'Garantir acesso e participação para todos',
      'Separar as pessoas',
      'Limitar a comunicação'
    ],
    answer: 1,
    difficulty: 'Fácil'
  },
  {
    question: 'Qual atitude é correta ao ajudar uma pessoa com deficiência?',
    options: [
      'Decidir por ela',
      'Ignorar a pessoa',
      'Perguntar se ela precisa de ajuda',
      'Falar somente com o acompanhante'
    ],
    answer: 2,
    difficulty: 'Fácil'
  }
];

const rooms = new Map();

function createCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code;

  do {
    code = Array.from(
      { length: 5 },
      () => chars[Math.floor(Math.random() * chars.length)]
    ).join('');
  } while (rooms.has(code));

  return code;
}

function createRoom() {
  const code = createCode();

  const room = {
    code,
    current: -1,
    open: false,
    finished: false,
    secondsLeft: QUESTION_TIME,
    players: new Map(),
    answers: new Map(),
    timer: null
  };

  rooms.set(code, room);
  return room;
}

function getRoom(code) {
  return rooms.get(String(code || '').trim().toUpperCase());
}

function getLeaderboard(room) {
  return [...room.players.values()]
    .filter(p => !p.admin)
    .map(p => ({
      name: p.name,
      score: p.score,
      connected: p.connected
    }))
    .sort((a, b) => b.score - a.score);
}

function getState(room) {
  return {
    roomCode: room.code,
    current: room.current,
    total: questions.length,
    open: room.open,
    finished: room.finished,
    secondsLeft: room.secondsLeft,
    answeredCount: room.answers.size,
    leaderboard: getLeaderboard(room)
  };
}

function sendState(room) {
  io.to(room.code).emit('state', getState(room));
}

function stopTimer(room) {
  if (room.timer) {
    clearInterval(room.timer);
    room.timer = null;
  }
}

function sendQuestion(room) {
  const q = questions[room.current];
  if (!q) return;

  io.to(room.code).emit('question', {
    index: room.current,
    total: questions.length,
    question: q.question,
    options: q.options,
    difficulty: q.difficulty || '',
    secondsLeft: room.secondsLeft,
    open: room.open
  });
}

function closeQuestion(room) {
  room.open = false;
  stopTimer(room);

  io.to(room.code).emit('questionClosed', {
    current: room.current
  });

  sendState(room);
}

function startTimer(room) {
  stopTimer(room);
  room.secondsLeft = QUESTION_TIME;

  room.timer = setInterval(() => {
    if (!room.open) {
      stopTimer(room);
      return;
    }

    room.secondsLeft--;

    io.to(room.code).emit('timer', {
      secondsLeft: room.secondsLeft
    });

    if (room.secondsLeft <= 0) {
      closeQuestion(room);
    }
  }, 1000);
}

io.on('connection', socket => {
  socket.on('createRoom', (data = {}, callback) => {
    if (typeof callback !== 'function') return;

    if (String(data.pin || '') !== ADMIN_PIN) {
      callback({
        ok: false,
        message: 'PIN do apresentador incorreto.'
      });
      return;
    }

    const room = createRoom();
    const name = String(data.name || 'Apresentador').trim();

    socket.join(room.code);
    socket.data.roomCode = room.code;
    socket.data.isAdmin = true;

    room.players.set(socket.id, {
      name,
      score: 0,
      admin: true,
      connected: true
    });

    callback({
      ok: true,
      roomCode: room.code,
      state: getState(room)
    });

    sendState(room);
  });

  socket.on('joinRoom', (data = {}, callback) => {
    if (typeof callback !== 'function') return;

    const room = getRoom(data.roomCode);

    if (!room) {
      callback({
        ok: false,
        message: 'Sala não encontrada. Confira o código.'
      });
      return;
    }

    const name = String(data.name || '').trim();
    const isAdmin = String(data.role || '').toLowerCase() === 'admin';

    if (!name) {
      callback({ ok: false, message: 'Digite seu nome.' });
      return;
    }

    if (isAdmin && String(data.pin || '') !== ADMIN_PIN) {
      callback({
        ok: false,
        message: 'PIN do apresentador incorreto.'
      });
      return;
    }

    if (!isAdmin) {
      const exists = [...room.players.values()].some(
        p => !p.admin && p.connected &&
          p.name.toLowerCase() === name.toLowerCase()
      );

      if (exists) {
        callback({
          ok: false,
          message: 'Esse nome já está sendo usado na sala.'
        });
        return;
      }
    }

    socket.join(room.code);
    socket.data.roomCode = room.code;
    socket.data.isAdmin = isAdmin;

    room.players.set(socket.id, {
      name,
      score: 0,
      admin: isAdmin,
      connected: true
    });

    callback({
      ok: true,
      roomCode: room.code,
      state: getState(room)
    });

    if (room.current >= 0 && !room.finished) {
      sendQuestion(room);
    }

    sendState(room);
  });

  socket.on('answer', choice => {
    const room = getRoom(socket.data.roomCode);

    if (!room || socket.data.isAdmin || !room.open) return;
    if (!Number.isInteger(choice) || choice < 0 || choice > 3) return;
    if (room.answers.has(socket.id)) return;

    const player = room.players.get(socket.id);
    const q = questions[room.current];

    if (!player || !q) return;

    const correct = choice === q.answer;
    const elapsed = QUESTION_TIME - room.secondsLeft;
    const points = correct
      ? Math.max(100, 1000 - elapsed * 30)
      : 0;

    if (correct) player.score += points;

    room.answers.set(socket.id, { choice, correct, points });

    socket.emit('answerResult', {
      correct,
      points,
      score: player.score
    });

    sendState(room);
  });

  socket.on('adminAction', action => {
    const room = getRoom(socket.data.roomCode);

    if (!room || !socket.data.isAdmin) return;

    if (action === 'start') {
      if (room.current !== -1 || room.finished) return;

      room.current = 0;
      room.open = true;
      room.answers.clear();

      sendQuestion(room);
      startTimer(room);
      sendState(room);
    }

    if (action === 'close') {
      if (room.open) closeQuestion(room);
    }

    if (action === 'next') {
      if (room.open) closeQuestion(room);

      if (room.current + 1 >= questions.length) {
        room.finished = true;
        room.open = false;
        stopTimer(room);

        io.to(room.code).emit('finished', {
          leaderboard: getLeaderboard(room)
        });

        sendState(room);
        return;
      }

      room.current++;
      room.answers.clear();
      room.open = true;

      sendQuestion(room);
      startTimer(room);
      sendState(room);
    }

    if (action === 'reveal') {
      const q = questions[room.current];
      if (!q) return;

      io.to(room.code).emit('answerRevealed', {
        answer: q.answer,
        correctOption: q.options[q.answer]
      });
    }

    if (action === 'restart') {
      stopTimer(room);

      room.current = -1;
      room.open = false;
      room.finished = false;
      room.secondsLeft = QUESTION_TIME;
      room.answers.clear();

      for (const player of room.players.values()) {
        if (!player.admin) player.score = 0;
      }

      io.to(room.code).emit('restarted');
      sendState(room);
    }
  });

  socket.on('disconnect', () => {
    const room = getRoom(socket.data.roomCode);
    if (!room) return;

    const player = room.players.get(socket.id);

    if (player) {
      if (player.admin) {
        room.players.delete(socket.id);
      } else {
        player.connected = false;
      }
    }

    sendState(room);
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Quiz iniciado na porta ${PORT}`);
});
