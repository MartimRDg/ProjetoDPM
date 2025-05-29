// forum.js

// Estado do usuário logado
let currentUser = null;

// Carregar dados do localStorage
function loadData(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}

// Salvar dados no localStorage
function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Usuários: { username: { username, password } }
let users = loadData('users') || {};

// Discussões: [{ id, author, title, message, comments: [{author, message}] }]
let discussions = loadData('discussions') || [];

// Elementos DOM
const loginSection = document.getElementById('loginSection');
const registerSection = document.getElementById('registerSection');
const forumSection = document.getElementById('forumSection');

const loginUsername = document.getElementById('loginUsername');
const loginPassword = document.getElementById('loginPassword');
const loginBtn = document.getElementById('loginBtn');

const registerUsername = document.getElementById('registerUsername');
const registerPassword = document.getElementById('registerPassword');
const registerBtn = document.getElementById('registerBtn');

const showRegisterBtn = document.getElementById('showRegisterBtn');
const showLoginBtn = document.getElementById('showLoginBtn');

const logoutBtn = document.getElementById('logoutBtn');

const titleInput = document.getElementById('titleInput');
const messageInput = document.getElementById('messageInput');
const postBtn = document.getElementById('postBtn');

const messagesContainer = document.getElementById('messagesContainer');

const discussionView = document.getElementById('discussionView');
const discussionTitle = document.getElementById('discussionTitle');
const discussionMessage = document.getElementById('discussionMessage');
const commentsContainer = document.getElementById('commentsContainer');

const commentInput = document.getElementById('commentInput');
const addCommentBtn = document.getElementById('addCommentBtn');

const backToListBtn = document.getElementById('backToListBtn');

// Função para escapar HTML (para evitar XSS)
function escapeHtml(text) {
  if (typeof text !== 'string') {
    text = '';
  }
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}


// Alternar telas login/register
showRegisterBtn.onclick = () => {
  loginSection.style.display = 'none';
  registerSection.style.display = 'block';
};
showLoginBtn.onclick = () => {
  registerSection.style.display = 'none';
  loginSection.style.display = 'block';
};

// Registrar novo usuário
registerBtn.onclick = () => {
  const username = registerUsername.value.trim();
  const password = registerPassword.value.trim();

  if (!username || !password) {
    alert('Por favor, preencha nome de usuário e senha.');
    return;
  }

  if (users[username]) {
    alert('Usuário já existe!');
    return;
  }

  users[username] = { username, password };
  saveData('users', users);

  alert('Usuário registrado com sucesso! Agora faça login.');

  registerUsername.value = '';
  registerPassword.value = '';

  registerSection.style.display = 'none';
  loginSection.style.display = 'block';
};

// Login
loginBtn.onclick = () => {
  const username = loginUsername.value.trim();
  const password = loginPassword.value.trim();

  if (!username || !password) {
    alert('Por favor, preencha nome de usuário e senha.');
    return;
  }

  const user = users[username];
  if (!user || user.password !== password) {
    alert('Usuário ou senha incorretos.');
    return;
  }

  currentUser = user;
  loginUsername.value = '';
  loginPassword.value = '';

  showForum();
};

// Mostrar a área do fórum
function showForum() {
  loginSection.style.display = 'none';
  registerSection.style.display = 'none';
  forumSection.style.display = 'block';
  discussionView.style.display = 'none';

  renderDiscussions();
}

// Logout
logoutBtn.onclick = () => {
  currentUser = null;
  forumSection.style.display = 'none';
  loginSection.style.display = 'block';
};

// Criar nova discussão
postBtn.onclick = () => {
  const title = titleInput.value.trim();
  const message = messageInput.value.trim();

  if (!title || !message) {
    alert('Por favor, preencha título e mensagem.');
    return;
  }

  const newDiscussion = {
    id: Date.now(),
    author: currentUser.username,
    title,
    message,
    comments: []
  };

  discussions.push(newDiscussion);
  saveData('discussions', discussions);

  titleInput.value = '';
  messageInput.value = '';

  renderDiscussions();
};

// Renderizar lista de discussões
function renderDiscussions() {
  messagesContainer.innerHTML = '';

  if (discussions.length === 0) {
    messagesContainer.innerHTML = '<p>Nenhuma discussão criada ainda.</p>';
    return;
  }

  discussions.forEach(discussion => {
    const div = document.createElement('div');
    div.className = 'forum-item';
    div.innerHTML = `
      <h3>${escapeHtml(discussion.title)}</h3>
      <p>Por: <strong>${escapeHtml(discussion.author)}</strong></p>
      <button data-id="${discussion.id}">Ver Discussão</button>
    `;

    const btn = div.querySelector('button');
    btn.onclick = () => showDiscussion(discussion.id);

    messagesContainer.appendChild(div);
  });
}

// Mostrar visualização detalhada de uma discussão
function showDiscussion(id) {
  const discussion = discussions.find(d => d.id === id);
  if (!discussion) return;

  discussionTitle.textContent = discussion.title;
  discussionMessage.textContent = discussion.message;

  renderComments(discussion.comments);

  loginSection.style.display = 'none';
  registerSection.style.display = 'none';
  forumSection.style.display = 'block';
  discussionView.style.display = 'block';

  // Salvar o id da discussão atual para adicionar comentários
  discussionView.dataset.currentDiscussionId = id;
}

// Renderizar comentários
function renderComments(comments) {
  commentsContainer.innerHTML = '';

  if (!comments || comments.length === 0) {
    commentsContainer.innerHTML = '<p>Sem comentários ainda.</p>';
    return;
  }

  comments.forEach(c => {
    const div = document.createElement('div');
    div.className = 'forum-item';
    div.innerHTML = `
      <p><strong>${escapeHtml(c.author)}</strong>: ${escapeHtml(c.message)}</p>
    `;
    commentsContainer.appendChild(div);
  });
}

// Adicionar comentário
addCommentBtn.onclick = () => {
  const commentText = commentInput.value.trim();
  if (!commentText) {
    alert('Por favor, escreva um comentário.');
    return;
  }

  const discussionId = Number(discussionView.dataset.currentDiscussionId);
  const discussion = discussions.find(d => d.id === discussionId);
  if (!discussion) return;

  discussion.comments.push({
    author: currentUser.username,
    message: commentText
  });

  saveData('discussions', discussions);

  commentInput.value = '';
  renderComments(discussion.comments);
};

// Voltar para a lista de discussões
backToListBtn.onclick = () => {
  discussionView.style.display = 'none';
  renderDiscussions();
};

// Se já estiver logado, mostrar fórum
window.onload = () => {
  if (currentUser) {
    showForum();
  } else {
    loginSection.style.display = 'block';
  }
};
