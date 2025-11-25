document.addEventListener('DOMContentLoaded', () => {
  const nextButton = document.getElementById('go-to-results');
  const sendBtn = document.getElementById("send-button");
  const userInput = document.getElementById("user-input");
  const chatLog = document.getElementById("chat-log");

  const questions = [
    "What kind of papers are you looking for? (e.g., survey, technical, application-based)",
    "What domain are you interested in? (e.g., HCI, NLP, CV)",
    "Do you prefer newer or more established papers?"
  ];
  let questionIndex = 0;

  const appendMessage = (sender, message) => {
    if (!chatLog) return;
    const msg = document.createElement("div");
    msg.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatLog.appendChild(msg);
    chatLog.scrollTop = chatLog.scrollHeight;
  };

  const askNextQuestion = () => {
    if (questionIndex < questions.length) {
      appendMessage("AI", questions[questionIndex]);
      questionIndex++;
    } else {
      appendMessage("AI", "Great! Based on your answers, we’re preparing your paper recommendations...");
      setTimeout(() => {
        window.location.href = "../papers/papers.html";
      }, 1500); // simulate delay
    }
  };

  if (sendBtn && userInput) {
    sendBtn.addEventListener("click", () => {
      const message = userInput.value.trim();
      if (!message) return;
      appendMessage("You", message);
      userInput.value = "";
      setTimeout(() => {
        askNextQuestion();
      }, 500);
    });

    userInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") sendBtn.click();
    });
  }

  if (nextButton) {
    nextButton.addEventListener("click", () => {
      window.location.href = "../papers/papers.html";
    });
  }

  // Initial message
  appendMessage("AI", "Hi! Let me ask you a few quick questions to better match your research needs.");
  askNextQuestion();
});
