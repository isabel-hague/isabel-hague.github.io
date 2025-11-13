//https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById//
const startButton = document.getElementById("startButton");
const nameInput = document.getElementById("nameInput");
const overlay = document.getElementById("overlay");
const main = document.getElementById("main");
const posts = document.querySelectorAll(".post");

let userName = "";
//https://developer.mozilla.org/en-US/docs/Web/API/Element/classList//
startButton.addEventListener("click", () => {
  userName = nameInput.value.trim() || "User";
  overlay.classList.add("hidden");
  main.classList.remove("hidden");
  posts.forEach(post => {
    post.textContent = `${userName} might like this🔥❤️`;
  });
});
//https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll//
posts.forEach(post => {
  post.addEventListener("click", () => {
    const target = document.getElementById(post.dataset.target);
    target.classList.toggle("hidden");
  });
});
