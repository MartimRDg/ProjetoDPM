// Referências
const loginContainer = document.querySelector(".login-container");
const registerSection = document.getElementById("registerSection");
const forumSection = document.getElementById("forumSection");
const messagesContainer = document.getElementById("messagesContainer");
const discussionView = document.getElementById("discussionView");

const registerUsername = document.getElementById("registerUsername");
const registerPassword = document.getElementById("registerPassword");
const registerBtn = document.getElementById("registerBtn");
const showLoginBtn = document.getElementById("showLoginBtn");

const showRegisterBtn = document.getElementById("showRegisterBtn");

showRegisterBtn.onclick = () => {
    loginContainer.style.display = "none";
    registerSection.style.display = "block";
};


const logoutBtn = document.getElementById("logoutBtn");
const postBtn = document.getElementById("postBtn");
const titleInput = document.getElementById("titleInput");
const messageInput = document.getElementById("messageInput");

const backToListBtn = document.getElementById("backToListBtn");
const discussionTitle = document.getElementById("discussionTitle");
const discussionMessage = document.getElementById("discussionMessage");
const commentsContainer = document.getElementById("commentsContainer");
const commentInput = document.getElementById("commentInput");
const addCommentBtn = document.getElementById("addCommentBtn");

let discussions = JSON.parse(localStorage.getItem("discussions")) || [];
let currentUser = localStorage.getItem("currentUser") || null;
let currentDiscussionIndex = null;

// Renderizar a lista de discussões
function renderDiscussions() {
    messagesContainer.innerHTML = "";
    discussions.slice().reverse().forEach((d, i) => {
        const box = document.createElement("div");
        box.className = "discussion-box";
        box.innerHTML = `<h3>${d.title}</h3><p>${d.message}</p><p><strong>Autor:</strong> ${d.user}</p>`;
        box.onclick = () => openDiscussion(discussions.length - 1 - i);
        messagesContainer.appendChild(box);
    });
}

// Mostrar discussão
function openDiscussion(index) {
    currentDiscussionIndex = index;
    const d = discussions[index];
    discussionTitle.textContent = d.title;
    discussionMessage.textContent = d.message;
    renderComments(d.comments || []);
    discussionView.style.display = "block";
    messagesContainer.parentElement.style.display = "none";
    commentInput.focus();
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// Voltar à lista
backToListBtn.onclick = () => {
    discussionView.style.display = "none";
    messagesContainer.parentElement.style.display = "block";
    renderDiscussions();
};

// Comentar
addCommentBtn.onclick = () => {
    const text = commentInput.value.trim();
    if (text && currentDiscussionIndex !== null) {
        discussions[currentDiscussionIndex].comments = discussions[currentDiscussionIndex].comments || [];
        discussions[currentDiscussionIndex].comments.push({ user: currentUser, text });
        localStorage.setItem("discussions", JSON.stringify(discussions));
        commentInput.value = "";
        renderComments(discussions[currentDiscussionIndex].comments);
    }
};

// Renderizar comentários
function renderComments(comments) {
    commentsContainer.innerHTML = "";
    comments.forEach(c => {
        const div = document.createElement("div");
        div.className = "comment";
        div.innerHTML = `<strong>${c.user}</strong>: ${c.text}`;
        commentsContainer.appendChild(div);
    });
}

// Criar nova discussão
postBtn.onclick = () => {
    const title = titleInput.value.trim();
    const message = messageInput.value.trim();
    if (title && message) {
        discussions.push({ title, message, user: currentUser, comments: [] });
        localStorage.setItem("discussions", JSON.stringify(discussions));
        titleInput.value = "";
        messageInput.value = "";
        renderDiscussions();
    }
};

// Registro
registerBtn.onclick = () => {
    const username = registerUsername.value.trim();
    const password = registerPassword.value.trim();
    if (username && password) {
        const users = JSON.parse(localStorage.getItem("users") || "{}");
        if (users[username]) {
            alert("Usuário já existe!");
            return;
        }
        users[username] = password;
        localStorage.setItem("users", JSON.stringify(users));
        alert("Conta criada com sucesso! Faça login.");
        registerSection.style.display = "none";
        loginContainer.style.display = "block";
    }
};

// Mostrar login
showLoginBtn.onclick = () => {
    registerSection.style.display = "none";
    loginContainer.style.display = "block";
};

// Login
loginContainer.querySelector("button").onclick = () => {
    const username = loginContainer.querySelector("input[type='text']").value.trim();
    const password = loginContainer.querySelector("input[type='password']").value.trim();
    const users = JSON.parse(localStorage.getItem("users") || "{}");
    if (users[username] && users[username] === password) {
        currentUser = username;
        localStorage.setItem("currentUser", username);
        loginContainer.style.display = "none";
        forumSection.style.display = "block";
        renderDiscussions();
    } else {
        alert("Credenciais inválidas!");
    }
};

// Logout
logoutBtn.onclick = () => {
    localStorage.removeItem("currentUser");
    currentUser = null;
    forumSection.style.display = "none";
    loginContainer.style.display = "block";
};

// Início
if (currentUser) {
    loginContainer.style.display = "none";
    forumSection.style.display = "block";
    renderDiscussions();
}

