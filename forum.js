// forum.js completo

function registerUser(username, password) {
  let users = JSON.parse(localStorage.getItem('users')) || {};
  if (users[username]) return false;
  users[username] = { password };
  localStorage.setItem('users', JSON.stringify(users));
  return true;
}

function authenticateUser(username, password) {
  let users = JSON.parse(localStorage.getItem('users')) || {};
  if (users[username] && users[username].password === password) {
    localStorage.setItem('loggedUser', username);
    return true;
  }
  return false;
}

function getLoggedUser() {
  return localStorage.getItem('loggedUser');
}

function logout() {
  localStorage.removeItem('loggedUser');
  location.reload();
}

function postDiscussion(title, message) {
  let user = getLoggedUser();
  if (!user) return false;

  let posts = JSON.parse(localStorage.getItem('posts')) || [];
  posts.unshift({
    id: Date.now(),
    user,
    title,
    message,
    date: new Date().toLocaleString(),
    comments: []
  });
  localStorage.setItem('posts', JSON.stringify(posts));
  return true;
}

function postComment(postId, commentText) {
  let user = getLoggedUser();
  if (!user) return false;

  let posts = JSON.parse(localStorage.getItem('posts')) || [];
  let post = posts.find(p => p.id === postId);
  if (!post) return false;

  post.comments.push({
    user,
    text: commentText,
    date: new Date().toLocaleString()
  });
  localStorage.setItem('posts', JSON.stringify(posts));
  return true;
}

function loadMessages() {
  let posts = JSON.parse(localStorage.getItem('posts')) || [];
  let container = document.getElementById('messagesContainer');
  container.innerHTML = '';

  posts.forEach(post => {
    if (!Array.isArray(post.comments)) {
      post.comments = [];
    }

    let postDiv = document.createElement('div');
    postDiv.className = 'forum-item';
    postDiv.style.border = '1px solid #ccc';
    postDiv.style.padding = '10px';
    postDiv.style.marginBottom = '15px';

    postDiv.innerHTML = `
      <h3>${post.title}</h3>
      <p><strong>${post.user}</strong> - ${post.date}</p>
      <p>${post.message}</p>

      <div class="comments-section" style="margin-top:10px;">
        <h4>Comentários (${post.comments.length})</h4>
        <div class="comments-list" id="comments-for-${post.id}">
          ${post.comments.map(c => `<p><strong>${c.user}:</strong> ${c.text} <em style="font-size:0.8em;color:#777;">(${c.date})</em></p>`).join('')}
        </div>

        <textarea id="commentInput-${post.id}" placeholder="Escreva um comentário..." style="width:100%; height:50px; margin-top:5px;"></textarea>
        <button data-postid="${post.id}" class="commentBtn" style="margin-top:5px;">Comentar</button>
      </div>
    `;

    container.appendChild(postDiv);
  });

  // Botões comentar
  document.querySelectorAll('.commentBtn').forEach(btn => {
    btn.onclick = () => {
      let postId = Number(btn.getAttribute('data-postid'));
      let textarea = document.getElementById(`commentInput-${postId}`);
      let commentText = textarea.value.trim();
      if (!commentText) {
        alert('Escreva um comentário antes de enviar.');
        return;
      }

      if (postComment(postId, commentText)) {
        textarea.value = '';
        loadMessages();
      }
    };
  });
}


  // Eventos dos botões comentar
  document.querySelectorAll('.commentBtn').forEach(btn => {
    btn.onclick = () => {
      let postId = Number(btn.getAttribute('data-postid'));
      let textarea = document.getElementById(`commentInput-${postId}`);
      let commentText = textarea.value.trim();
      if (!commentText) {
        alert('Escreva um comentário antes de enviar.');
        return;
      }

      if (postComment(postId, commentText)) {
        textarea.value = '';
        loadMessages();
      }
    };
  });
}

window.onload = function() {
  const registerBtn = document.getElementById('registerBtn');
  const loginBtn = document.getElementById('loginBtn');
  const postBtn = document.getElementById('postBtn');
  const logoutBtn = document.getElementById('logoutBtn');

  const registerMsg = document.getElementById('registerMessage');
  const loginMsg = document.getElementById('loginMessage');

  const registerSection = document.getElementById('registerSection');
  const loginSection = document.getElementById('loginSection');
  const forumSection = document.getElementById('forumSection');

  const userGreeting = document.getElementById('userGreeting');

  let loggedUser = getLoggedUser();

  if (loggedUser) {
    registerSection.style.display = 'none';
    loginSection.style.display = 'none';
    forumSection.style.display = 'block';
    userGreeting.textContent = loggedUser;
    loadMessages();
  }

  registerBtn.onclick = () => {
    let username = document.getElementById('regUsername').value.trim();
    let password = document.getElementById('regPassword').value;

    if (!username || !password) {
      registerMsg.style.color = 'red';
      registerMsg.textContent = 'Por favor, preencha todos os campos.';
      return;
    }
    if (registerUser(username, password)) {
      registerMsg.style.color = 'green';
      registerMsg.textContent = 'Registro feito com sucesso! Faça login.';
    } else {
      registerMsg.style.color = 'red';
      registerMsg.textContent = 'Usuário já existe.';
    }
  };

  loginBtn.onclick = () => {
    let username = document.getElementById('loginUsername').value.trim();
    let password = document.getElementById('loginPassword').value;

    if (!username || !password) {
      loginMsg.style.color = 'red';
      loginMsg.textContent = 'Por favor, preencha todos os campos.';
      return;
    }
    if (authenticateUser(username, password)) {
      registerSection.style.display = 'none';
      loginSection.style.display = 'none';
      forumSection.style.display = 'block';
      loginMsg.textContent = '';
      userGreeting.textContent = username;
      loadMessages();
    } else {
      loginMsg.style.color = 'red';
      loginMsg.textContent = 'Usuário ou senha incorretos.';
    }
  };

  postBtn.onclick = () => {
    let title = document.getElementById('titleInput').value.trim();
    let message = document.getElementById('messageInput').value.trim();

    if (!title || !message) {
      alert('Preencha título e mensagem antes de postar.');
      return;
    }

    if (postDiscussion(title, message)) {
      document.getElementById('titleInput').value = '';
      document.getElementById('messageInput').value = '';
      loadMessages();
    }
  };

  logoutBtn.onclick = () => {
    logout();
  };
};
