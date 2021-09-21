const myName = document.getElementById("myName").value;
const myImg = document.getElementById("myImg").value;
const friendId = document.getElementById("friendId").value;
const friendName = document.getElementById("friendName").value;
const friendImg = document.getElementById("friendImg").value;

addBtn.onclick = (e) => {
  // e >> event object
  e.preventDefault();
  socket.emit("sendFriendRequest", {
    myId, // myId === myId:myId "Es6"
    myName,
    myImg,
    friendId,
    friendName,
    friendImg,
  });
};

socket.on("requestSent", () => {
  // Replace add button with cancel request button
  addBtn.remove();
  document.getElementById(
    "friends-form"
  ).innerHTML += `<div class="buttons text-center"><input type="submit" value="Cancel Request" class="btn btn-danger"
  formaction="/friend/cancel"></div>`;
});
