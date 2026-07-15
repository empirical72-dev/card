let participants = [];
let items = [];

function addParticipant() {
  const input = document.getElementById("participant-input");
  const name = input.value.trim();
  if (!name) return;
  participants.push(name);
  input.value = "";
  renderParticipants();
}

function renderParticipants() {
  const container = document.getElementById("participants-container");
  container.innerHTML = "";
  participants.forEach((p, i) => {
    const div = document.createElement("div");
    div.className = "list-item";
    div.innerHTML = `${p} <button class="delete-btn" onclick="removeParticipant(${i})">X</button>`;
    container.appendChild(div);
  });
}

function removeParticipant(index) {
  participants.splice(index, 1);
  renderParticipants();
}

function addItem() {
  const input = document.getElementById("item-input");
  const countInput = document.getElementById("item-count");
  const name = input.value.trim();
  const count = parseInt(countInput.value);
  if (!name || count < 1) return;
  for (let i = 0; i < count; i++) {
    items.push(name);
  }
  input.value = "";
  countInput.value = 1;
  renderItems();
}

function renderItems() {
  const container = document.getElementById("items-container");
  container.innerHTML = "";
  items.forEach((item, i) => {
    const div = document.createElement("div");
    div.className = "list-item";
    div.innerHTML = `${item} <button class="delete-btn" onclick="removeItem(${i})">X</button>`;
    container.appendChild(div);
  });
}

function removeItem(index) {
  items.splice(index, 1);
  renderItems();
}

function resetAll() {
  participants = [];
  items = [];
  document.getElementById("participants-container").innerHTML = "";
  document.getElementById("items-container").innerHTML = "";
  document.getElementById("cards-container").innerHTML = "";
  document.querySelector("#result-table tbody").innerHTML = "";
}

function shuffleAndMatch() {
  if (participants.length === 0 || items.length === 0) return;

  // shuffle items
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // match participants with items
  const cardsContainer = document.getElementById("cards-container");
  cardsContainer.innerHTML = "";
  const resultBody = document.querySelector("#result-table tbody");
  resultBody.innerHTML = "";

  participants.forEach((p, i) => {
    const item = shuffled[i % shuffled.length];

    // 카드 생성
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front">${p}</div>
        <div class="card-back">${item}</div>
      </div>
    `;
    card.addEventListener("click", () => {
      card.classList.toggle("flipped");
    });
    cardsContainer.appendChild(card);

    // 결과 표 추가
    const row = document.createElement("tr");
    row.innerHTML = `<td>${p}</td><td>${item}</td>`;
    resultBody.appendChild(row);
  });
}
