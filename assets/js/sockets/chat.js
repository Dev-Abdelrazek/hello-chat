const chatId = document.getElementById("chat-id").value;
const message = document.getElementById("message");
const sendBtn = document.getElementById("sendBtn");
const msgContainer = document.getElementById("message-container");

socket.emit("joinChat", chatId);

sendBtn.onclick = () => {
  let content = message.value;

  socket.emit(
    "sendMsg",
    { chat: chatId, content: content, sender: myId },
    () => {
      message.value = "";
    }
  );
};

socket.on("newMsg", (msg) => {
  msgContainer.innerHTML += `<div class="d-flex ${
    msg.sender === myId ? "justify-content-end" : " justify-content-start"
  } mb-4">
  <div class="${msg.sender === myId ? "msg_cotainer_send" : "msg_cotainer"}">
      ${msg.content}
      <span class="${
        msg.sender === myId ? "msg_time_send" : "msg_time"
      }">Now</span>
  </div>
</div>`;
});
