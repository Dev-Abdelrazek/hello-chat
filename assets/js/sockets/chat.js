const message = document.getElementById("message");
const sendBtn = document.getElementById("sendBtn");
const callBtn = document.getElementById("callBtn");
const videoDiv = document.getElementById("videoDiv");
const onlineIcon = document.getElementById("onlineIcon");
const alertDanger = document.getElementById("alertDanger");
const chatId = document.getElementById("chat-id").value;
const friendId = document.getElementById("friendId").value;
const msgContainer = document.getElementById("message-container");
const videoContainer = document.getElementById("videoContainer");

// Join users to chat room
socket.emit("joinChat", chatId);

// Check friend is online or not
socket.emit("checkOnline");
socket.on("onlineFriends", (data) => {
  // Convert object to array
  const onlineFriends = Object.entries(data.onlineFriends);
  const onlineFriend = onlineFriends.filter(([key, value]) => {
    return key === friendId && value === true;
  });

  if (onlineFriend.length !== 0) onlineIcon.classList.add("bg-green");
});

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
  socket.emit("checkOnline");
  socket.on("onlineFriends", (data) => {
    // Convert object to array
    const onlineFriends = Object.entries(data.onlineFriends);
    const onlineFriend = onlineFriends.filter(([key, value]) => {
      return key === friendId && value === true;
    });

    // Check if friend online or not
    if (onlineFriend.length === 0) alertDanger.classList.remove("d-none");
    else {
      onlineIcon.classList.add("bg-green");
      alertDanger.classList.add("d-none");
      socket.emit("requestPeerId", chatId);
    }
  });
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
