const chatBox = document.getElementById("chat-box");
const input = document.getElementById("user-input");
const button = document.getElementById("send-button");

function addMessage(text, sender) {
    const message = document.createElement("div");
    message.className = `message ${sender}`;

    const bubble = document.createElement("div");
    bubble.className = "bubble";
    bubble.textContent = text;

    message.appendChild(bubble);
    chatBox.appendChild(message);

    chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {

    const message = input.value.trim();

    console.log("Message:", message);

    if (message === "") return;

    addMessage(message, "user");
    input.value = "";

    try {

        const response = await fetch("http://127.0.0.1:5000/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: message
            })
        });

        console.log("HTTP Status:", response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Server Error:");
            console.error(errorText);

            addMessage("Server returned an error.", "ai");
            return;
        }

        const text = await response.text();

        console.log("Raw Response:");
        console.log(text);

        const data = JSON.parse(text);

        console.log("Parsed JSON:");
        console.log(data);

        addMessage(data.reply, "ai");

    } catch (error) {

        console.error("Fetch Error:");
        console.error(error);

        addMessage("Cannot connect to Delta AI.", "ai");
    }
}

button.addEventListener("click", sendMessage);

input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});