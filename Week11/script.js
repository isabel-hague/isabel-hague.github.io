// Switches screens after pressing enter
document.getElementById("enter-btn").addEventListener("click", () => {
    document.getElementById("intro-screen").classList.add("hidden");
    document.getElementById("chat-screen").classList.remove("hidden");
    startAnonymousFeed();
});

// Random messages
const randomMessages = [
    "lol who even ARE you",
    "i can say anything here.",
    "no consequences…",
    "this place is wild.",
    "we’re all just usernames.",
    "does anyone even exist?",
    "no rules. no identity.",
    "anonymous forever.",
    "you can't stop me.",
    "antisocial network."
];

// Start feeding messages
https://developer.mozilla.org/en-US/docs/Web/API/setInterval
function startAnonymousFeed() {
    setInterval(() => {
        const msg = randomMessages[Math.floor(Math.random() * randomMessages.length)];
        addMessage(msg);
    }, 1200);
}

// Add a message to the screen
function addMessage(text) {
    const msgBox = document.getElementById("messages");
    const msg = document.createElement("div");
//https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent//
https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild  
    msg.classList.add("message");
    msg.textContent = "anon_" + Math.floor(Math.random() * 9999) + ": " + text;

    msgBox.appendChild(msg);

    // keep only last 10 messages to avoid overflow 
    https://developer.mozilla.org/en-US/docs/Web/API/Node/removeChild//
    if (msgBox.children.length > 10) {
        msgBox.removeChild(msgBox.children[0]);
    }
}
