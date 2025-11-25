function sendMessage() {
  const input = document.getElementById("search-box");
  const query = input.value.trim();
  if (query === "") return;

  // Redirect to clarify page (up one level, then into clarify/)
  const encoded = encodeURIComponent(query);
  window.location.href = `../clarify/clarify.html?query=${encoded}`;
}

document.addEventListener("DOMContentLoaded", function () {
  const input = document.getElementById("search-box");
  const searchBtn = document.getElementById("search-button");

  if (input) {
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        sendMessage();
      }
    });
  }

  if (searchBtn) {
    searchBtn.addEventListener("click", function (e) {
      e.preventDefault();
      sendMessage();
    });
  }

  const form = document.getElementById("search-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      sendMessage();
    });
  }

  const helpBtn = document.getElementById("help-btn");
  if (helpBtn) {
    helpBtn.addEventListener("click", function (e) {
      e.preventDefault();
      alert("Function not available yet");
    });
  }
});
