const socket = io();
const addBtn = document.getElementById("addBtn");
const dropBtn = document.getElementById("friendRequestsDropdown");
const reqsNumber = document.getElementById("requestsNumber");
let myId = document.getElementById("userId").value;
let username = document.getElementById("username").value;

socket.on("connect", () => {
  socket.emit("notificationsRoom", myId);
  socket.emit("goOnline", myId);
});

socket.on("newFriendRequest", (data) => {
  reqsNumber.classList.remove("d-none");
  reqsNumber.textContent = parseInt(reqsNumber.textContent) + 1;
  const friendRequests = document.getElementById("friendRequests");
  const span = friendRequests.querySelector("span");
  if (span) {
    span.remove();
  }
  friendRequests.innerHTML += `
  <a class="dropdown-item" href="/profile/${data.id}">${data.name}</a>`;
  addBtn.remove();
  document.getElementById(
    "friends-form"
  ).innerHTML += `<div class="buttons text-center"><input type="submit" value="Accept Request" class="btn btn-success" formaction="/friend/accept">
<input type="submit" value="Reject" class="btn btn-danger" formaction="/friend/reject"></div>`;
});
