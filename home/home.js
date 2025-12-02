function sendMessage() {
  const input = document.getElementById("search-box");
  const query = input.value.trim();
  if (query === "") return;

  // Store the user query for later use
  localStorage.setItem("userQuery", query);

  // Redirect to clarify page
  window.location.href = "../clarify/clarify.html";
}

document.addEventListener("DOMContentLoaded", function () {
  const input = document.getElementById("search-box");
  const searchBtn = document.getElementById("search-button");
  const form = document.getElementById("search-form");
  const helpBtn = document.getElementById("help-btn");

  // Submit on Enter key
  if (input) {
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        sendMessage();
      }
    });
  }

  // Submit on button click
  if (searchBtn) {
    searchBtn.addEventListener("click", function (e) {
      e.preventDefault();
      sendMessage();
    });
  }

  // Submit on form submit
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      sendMessage();
    });
  }

  // Optional Help Button
  if (helpBtn) {
    helpBtn.addEventListener("click", function (e) {
      e.preventDefault();
      alert("Function not available yet");
    });
  }
});
