// ── Auth (localStorage-based) ────────────────────────
const AUTH_KEY = 'snake_users';
let currentUser = null;
let authMode = 'login';

function getUsers() {
  try { return JSON.parse(localStorage.getItem(AUTH_KEY)) || {}; }
  catch { return {}; }
}
function saveUsers(users) { localStorage.setItem(AUTH_KEY, JSON.stringify(users)); }

// ── UI refs ──────────────────────────────────────────
const authScreen = document.getElementById('auth-screen');
const gameScreen = document.getElementById('game-screen');
const authForm = document.getElementById('auth-form');
const authUser = document.getElementById('auth-user');
const authPass = document.getElementById('auth-pass');
const authSubmit = document.getElementById('auth-submit');
const authMsg = document.getElementById('auth-msg');
const authTabs = document.getElementById('auth-tabs');
const playerNameEl = document.getElementById('player-name');
const scoreEl = document.getElementById('score');
const bestEl = document.getElementById('best');
const gameOverEl = document.getElementById('game-over');
const finalScoreEl = document.getElementById('final-score');
const pauseHint = document.getElementById('pause-hint');
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// ── Auth logic ───────────────────────────────────────
authTabs.addEventListener('click', e => {
  if (!e.target.classList.contains('tab')) return;
  authTabs.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  e.target.classList.add('active');
  authMode = e.target.dataset.tab;
  authSubmit.textContent = authMode === 'login' ? '登录' : '注册';
  authMsg.textContent = '';
});

authForm.addEventListener('submit', e => {
  e.preventDefault();
  const name = authUser.value.trim();
  const pass = authPass.value;
  if (!name || !pass) { authMsg.textContent = '请输入用户名和密码'; return; }
  const users = getUsers();

  if (authMode === 'register') {
    if (users[name]) { authMsg.textContent = '用户名已存在'; return; }
    users[name] = { pass, best: 0 };
    saveUsers(users);
    authMsg.style.color = '#5e5';
    authMsg.textContent = '注册成功，请登录';
    authTabs.querySelector('[data-tab="login"]').click();
    return;
  }
  // login
  if (!users[name]) { authMsg.textContent = '用户不存在'; return; }
  if (users[name].pass !== pass) { authMsg.textContent = '密码错误'; return; }
  currentUser = { name, best: users[name].best || 0 };
  authMsg.textContent = '';
  authForm.reset();
  startGame();
});

document.getElementById('logout-btn').addEventListener('click', () => {
  currentUser = null;
  stopGame();
  gameScreen.classList.remove('active');
  authScreen.classList.add('active');
});

document.getElementById('restart-btn').addEventListener('click', () => {
  gameOverEl.classList.add('hidden');
  initSnake();
});

// ── Snake game ───────────────────────────────────────
const GRID = 20;
const COLS = 22;
const ROWS = 18;
const CELL = 24;
let snake, food, dir, nextDir, score, running, paused, timer;

function initCanvas() {
  canvas.width = COLS * CELL;
  canvas.height = ROWS * CELL;
}
initCanvas();

function initSnake() {
  snake = [
    { x: Math.floor(COLS/2), y: Math.floor(ROWS/2) },
    { x: Math.floor(COLS/2)-1, y: Math.floor(ROWS/2) },
    { x: Math.floor(COLS/2)-2, y: Math.floor(ROWS/2) },
  ];
  dir = { x: 1, y: 0 };
  nextDir = { x: 1, y: 0 };
  score = 0;
  scoreEl.textContent = '0';
  bestEl.textContent = currentUser ? currentUser.best : '0';
  placeFood();
  running = true;
  paused = false;
  gameOverEl.classList.add('hidden');
  pauseHint.classList.add('hidden');
}

function placeFood() {
  const occupied = new Set(snake.map(s => `${s.x},${s.y}`));
  const free = [];
  for (let x = 0; x < COLS; x++)
    for (let y = 0; y < ROWS; y++)
      if (!occupied.has(`${x},${y}`)) free.push({x, y});
  food = free[Math.floor(Math.random() * free.length)];
}

function step() {
  if (!running || paused) return;
  dir = { ...nextDir };
  const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

  // wall collision
  if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
    endGame(); return;
  }
  // self collision
  if (snake.some(s => s.x === head.x && s.y === head.y)) {
    endGame(); return;
  }

  snake.unshift(head);
  if (head.x === food.x && head.y === food.y) {
    score += 10;
    scoreEl.textContent = score;
    placeFood();
    // speed up slightly
    clearInterval(timer);
    timer = setInterval(step, Math.max(60, 150 - snake.length * 2));
  } else {
    snake.pop();
  }
  draw();
}

function endGame() {
  running = false;
  clearInterval(timer);
  finalScoreEl.textContent = score;
  gameOverEl.classList.remove('hidden');
  // save best
  if (currentUser && score > currentUser.best) {
    currentUser.best = score;
    bestEl.textContent = score;
    const users = getUsers();
    if (users[currentUser.name]) users[currentUser.name].best = score;
    saveUsers(users);
  }
}

function stopGame() {
  running = false;
  clearInterval(timer);
}

function draw() {
  ctx.fillStyle = '#0a0a14';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // grid lines
  ctx.strokeStyle = '#1a1a2a';
  ctx.lineWidth = 0.5;
  for (let x = 0; x <= COLS; x++) { ctx.beginPath(); ctx.moveTo(x*CELL,0); ctx.lineTo(x*CELL,canvas.height); ctx.stroke(); }
  for (let y = 0; y <= ROWS; y++) { ctx.beginPath(); ctx.moveTo(0,y*CELL); ctx.lineTo(canvas.width,y*CELL); ctx.stroke(); }

  // food
  ctx.fillStyle = '#e55';
  ctx.beginPath();
  ctx.arc(food.x * CELL + CELL/2, food.y * CELL + CELL/2, CELL/2 - 2, 0, Math.PI*2);
  ctx.fill();

  // snake
  snake.forEach((s, i) => {
    const alpha = 1 - i / (snake.length + 10);
    ctx.fillStyle = i === 0 ? `rgba(100,200,255,1)` : `rgba(80,160,220,${alpha.toFixed(2)})`;
    ctx.fillRect(s.x * CELL + 1, s.y * CELL + 1, CELL - 2, CELL - 2);
    if (i === 0) {
      // eyes
      ctx.fillStyle = '#fff';
      const ex = s.x * CELL + CELL/2 + dir.x * 6;
      const ey = s.y * CELL + CELL/2 + dir.y * 6;
      ctx.beginPath(); ctx.arc(ex-3, ey-3, 3, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(ex+3, ey+3, 3, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#111';
      ctx.beginPath(); ctx.arc(ex-3+dir.x*1.5, ey-3+dir.y*1.5, 1.5, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(ex+3+dir.x*1.5, ey+3+dir.y*1.5, 1.5, 0, Math.PI*2); ctx.fill();
    }
  });
}

function startGame() {
  authScreen.classList.remove('active');
  gameScreen.classList.add('active');
  playerNameEl.textContent = '🐍 ' + currentUser.name;
  initCanvas();
  initSnake();
  draw();
  timer = setInterval(step, 150);
}

// ── Keyboard ─────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (!running) return;
  if (e.key === 'p' || e.key === 'P') {
    paused = !paused;
    pauseHint.classList.toggle('hidden', !paused);
    return;
  }
  if (paused) return;
  const map = {
    ArrowUp: {x:0,y:-1}, ArrowDown: {x:0,y:1},
    ArrowLeft: {x:-1,y:0}, ArrowRight: {x:1,y:0},
  };
  const d = map[e.key];
  if (!d) return;
  // prevent reverse
  if (d.x === -dir.x && d.y === -dir.y) return;
  nextDir = d;
  e.preventDefault();
});
