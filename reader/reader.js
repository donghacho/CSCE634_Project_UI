let preloadSummary = "";
let hasInjectedSummary = false;

// A promise we resolve once summary is ready
let summaryResolve;
let summaryReady = new Promise(res => summaryResolve = res);

async function sendMessage() {
  // Wait until summary is actually loaded
  await summaryReady;

  const input = document.getElementById("chat-input");
  const chatBox = document.getElementById("chat-box");
  const message = input.value.trim();
  if (message === "") return;

  // Show user message
  const userMsg = document.createElement("div");
  userMsg.textContent = "You: " + message;
  chatBox.appendChild(userMsg);

  // Placeholder for AI message
  const aiMsg = document.createElement("div");
  aiMsg.style.marginTop = "10px";
  aiMsg.style.color = "#007BFF";
  aiMsg.textContent = "AI: [Waiting for response...]";
  chatBox.appendChild(aiMsg);

  chatBox.scrollTop = chatBox.scrollHeight;
  input.value = "";

  // Inject the summary ONLY on the first message
  let finalMessage = message;

  if (!hasInjectedSummary && preloadSummary.trim().length > 0) {
    finalMessage =
      `Here is the content the user is reading:\n\n"""${preloadSummary}"""\n\n` +
      `Now answer the user's question:\n${message}`;

    hasInjectedSummary = true;
  }

  console.log("FINAL MESSAGE SENT TO BACKEND:\n", finalMessage);

  try {
    const response = await fetch("http://localhost:3000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: finalMessage })
    });

    const data = await response.json();
    aiMsg.textContent = "AI: " + data.reply;
    chatBox.scrollTop = chatBox.scrollHeight;

  } catch (err) {
    aiMsg.textContent = "AI: [Error getting response from backend]";
    console.error("Frontend error:", err);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const toggleBtn = document.getElementById("toggle-chat");
  const chatPanel = document.getElementById("chat-panel");
  const resizer = document.getElementById("resizer");

  loader();

  toggleBtn.addEventListener("click", function () {
    chatPanel.classList.toggle("hidden");
    resizer.classList.toggle("hidden");
  });

  // Enable horizontal resizing
  let isResizing = false;

  resizer.addEventListener("mousedown", function () {
    isResizing = true;
    document.body.style.cursor = "col-resize";
  });

  window.addEventListener("mousemove", function (e) {
    if (!isResizing) return;

    const container = document.querySelector(".container");
    const paperView = document.getElementById("paper-view");

    const offsetRight = container.clientWidth - e.clientX;
    chatPanel.style.width = `${offsetRight}px`;
    paperView.style.width = `${container.clientWidth - offsetRight - 10}px`;
  });

  window.addEventListener("mouseup", function () {
    isResizing = false;
    document.body.style.cursor = "default";
  });

  // Enter key to send message
  const chatInput = document.getElementById("chat-input");
  if (chatInput) {
    chatInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        sendMessage();
      }
    });
  }

  // Button send
  const sendBtn = document.getElementById("send-btn");
  if (sendBtn) {
    sendBtn.addEventListener("click", function () {
      sendMessage();
    });
  }

  // Auto read + summarize
  const paperView = document.getElementById("paper-view");
  if (paperView) {
    const paperText = paperView.innerText.trim();
    console.log("Auto-read content:", paperText.slice(0, 50) + "...");
    preloadPaperSummary(paperText);
  }
});

async function preloadPaperSummary(paperText) {
  try {
    const prompt =
      `Summarize the following document so I can use the summary as context later:\n\n"""${paperText}"""`;

    const response = await fetch("http://localhost:3000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: prompt })
    });

    const data = await response.json();
    preloadSummary = data.reply;

    console.log("Preload summary:", preloadSummary);

    // Mark summary as ready
    summaryResolve();

  } catch (err) {
    console.error("Error summarizing paper:", err);
    summaryResolve();
  }
}

async function loader() {
   let pdf = document.getElementById('pdf');
   pdf.src = sessionStorage.getItem('activePdfUrl');
}
