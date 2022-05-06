const socket = io();
let name;
let textarea = document.getElementById("textarea");
let messageArea = document.querySelector(".message-area");
do {
  name = prompt("please enter your name");
} while (!name);
socket.emit('new-user', name);
textarea.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    sendMessage(e.target.value);
  }
});

function sendMessage(message) {
  let msg = {
    user: name,
    message: message.trim(),
  };
  //append
  appendMessage(msg, "outgoing");
  scrollToBottam();
  //to server
  socket.emit('message', msg)
  textarea.value = ""
}

function appendMessage(msg, type) {
  let mainDiv = document.createElement("div");
  let classname = type;

  mainDiv.classList.add(classname, "message");

  let markup = `
    <h4>${msg.user}</h4>
    <p>${msg.message}</p>
`;
  mainDiv.innerHTML = markup;
  messageArea.appendChild(mainDiv)
}
function appendMessageForLeftJion(user, type, message) {
  let mainDiv = document.createElement("div");
  let classname = type;

  mainDiv.classList.add(classname, "join-left-message");

  let markup = `
    <p><span>${user}</span> ${message}</p>
`;
  mainDiv.innerHTML = markup;
  messageArea.appendChild(mainDiv)
}


//recive 

socket.on('message', (msg)=>{
    appendMessage(msg, "incoming");
    scrollToBottam();
})
socket.on('user-joined', (user)=>{
  appendMessageForLeftJion(user, "joined", "has joined the chat");
  scrollToBottam();
})
socket.on('left', (user)=>{
  appendMessageForLeftJion(user, "left", "has left the chat");
  scrollToBottam();
})


//auto scroll

function scrollToBottam(){
    messageArea.scrollTop = messageArea.scrollHeight;
}
