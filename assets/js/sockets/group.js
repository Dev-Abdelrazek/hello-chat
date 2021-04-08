const chatId = document.getElementById("chatId").value;
const msg = document.getElementById("message");
const sendBtn = document.getElementById("sendBtn");
const msgContainer = document.getElementById("message-container");

socket.emit("joinChat", chatId);

sendBtn.onclick = () => {
  let content = msg.value;
  socket.emit(
    "sendGroupMessage",
    {
      group: chatId,
      content: content,
      sender: myId,
      senderName: username,
    },
    () => {
      msg.value = "";
    }
  );
};

socket.on("newGroupMessage", (msg) => {
  msgContainer.innerHTML += `<div class="d-flex ${
    msg.sender === myId ? "justify-content-end" : " justify-content-start"
  } mb-4">
    <div class="${msg.sender === myId ? "msg_cotainer_send" : "msg_cotainer"}">
    <a href="/profile/${msg.sender}" class="pro-link d-block">${
    msg.sender === myId ? "Me" : msg.senderName
  }</a>
        ${msg.content}
        <span class="${
          msg.sender === myId ? "msg_time_send" : "msg_time"
        }">Now</span>
    </div>
  </div>`;
  msgContainer.scrollTop = msgContainer.scrollHeight;
});
