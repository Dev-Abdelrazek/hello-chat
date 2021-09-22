const chatId = document.getElementById("chat-id").value;
const message = document.getElementById("message");
const sendBtn = document.getElementById("sendBtn");
const callBtn = document.getElementById("callBtn");
const videoDiv = document.getElementById("videoDiv");
const msgContainer = document.getElementById("message-container");
const videoContainer = document.getElementById("videoContainer");

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

// Video call
let peer = new Peer();
let peerId = null;
peer.on("open", (id) => {
  peerId = id;
});

callBtn.onclick = () => {
  socket.emit("requestPeerId", chatId);
};

socket.on("getPeerId", () => {
  socket.emit("sendPeerId", {
    chatId: chatId,
    peerId: peerId,
  });
});

socket.on("recievePeerId", (id) => {
  navigator.mediaDevices
    .getUserMedia({ audio: true, video: true })
    .then((stream) => {
      let call = peer.call(id, stream);
      call.on("stream", showVideoCall);
    })
    .catch((err) => console.log(err));
});

peer.on("call", (call) => {
  navigator.mediaDevices
    .getUserMedia({ audio: true, video: true })
    .then((stream) => {
      call.answer(stream);
      call.on("stream", showVideoCall);
    })
    .catch((err) => console.log(err));
});

const showVideoCall = (stream) => {
  videoDiv.classList.remove("d-none");
  videoDiv.classList.add("d-flex");
  videoContainer.srcObject = stream;
  videoContainer.play();
};
