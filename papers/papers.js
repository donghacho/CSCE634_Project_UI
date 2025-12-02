const totalPapers = 360;
const container = document.getElementById("papers-container");
const pagination = document.getElementById("pagination");
const pageSizeSelect = document.getElementById("pageSizeSelect");

let currentPage = 1;
let pageSize = parseInt(pageSizeSelect.value);

// Generate dummy paper data
const papers = Array.from({ length: totalPapers }, (_, i) => `Paper #${i + 1}`);

function renderPapers() {
  container.innerHTML = "";

  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const currentPapers = papers.slice(start, end);

  currentPapers.forEach(title => {
    const card = document.createElement("div");
    card.className = "paper-card";
    card.textContent = title;

    card.addEventListener('click', () => {
      sessionStorage.setItem('title', title);
      // sessionStorage.setItem('activePdfUrl', 'https://arxiv.org/pdf/2506.17894') we will populate the DOI/PDF links to view the paper here
      window.location.href = '/reader/reader.html';
    });
    container.appendChild(card);
  });

  renderPagination();
}

function renderPagination() {
  pagination.innerHTML = "";
  const totalPages = Math.ceil(papers.length / pageSize);

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    if (i === currentPage) {
      btn.classList.add("active");
    }
    btn.addEventListener("click", () => {
      currentPage = i;
      renderPapers();
    });
    pagination.appendChild(btn);
  }
}

pageSizeSelect.addEventListener("change", () => {
  pageSize = parseInt(pageSizeSelect.value);
  currentPage = 1;
  renderPapers();
});

// Initial render
renderPapers();
