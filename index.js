const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

let riddles = [
  { emoji: "🐝📦", answer: "beatbox" },
  { emoji: "🌧️🐱🐶", answer: "raining cats and dogs" },
  { emoji: "🧊🧠", answer: "cold mind" }
];

let currentIndex = 0;
let leaderboard = {};
let lastWinner = { name: null, timestamp: null };

app.get('/riddle', (req, res) => {
  res.json({ emoji: riddles[currentIndex].emoji });
});

app.get('/winner', (req, res) => {
  res.json(lastWinner);
});

app.post('/guess', (req, res) => {
  const { user, guess } = req.body;
  const answer = riddles[currentIndex].answer.toLowerCase();

  if (guess.toLowerCase() === answer) {
    leaderboard[user] = (leaderboard[user] || 0) + 1;
    lastWinner = { name: user, timestamp: Date.now() };
    currentIndex = (currentIndex + 1) % riddles.length;
    return res.json({ correct: true });
  }

  res.json({ correct: false });
});

app.get('/leaderboard', (req, res) => {
  const sorted = Object.entries(leaderboard)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);
  res.json({ top: sorted });
});

app.listen(3000, () => console.log('Emoji Riddle Rush backend running'));
