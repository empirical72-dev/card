let participants = [];
let items = [];
let matches = [];

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
  matches = [];
  document.getElementById("participants-container").innerHTML = "";
  document.getElementById("items-container").innerHTML = "";
  document.getElementById("cards-container").innerHTML = "";
  document.querySelector("#result-table tbody").innerHTML = "";
}

function shuffleAndMatch() {
  if (participants.length === 0 || items.length === 0) return;

  // 항목 섞기
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // 참가자와 항목 매칭
  matches = participants.map((p, i) => ({
    participant: p,
    item: shuffled[i % shuffled.length]
  }));

  const cardsContainer = document.getElementById("cards-container");
  cardsContainer.innerHTML = "";
  document.querySelector("#result-table tbody").innerHTML = "";

  matches.forEach((match) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="card-inner">
        <!-- 뒷면: 트럼프 무늬 + 참가자 이름 -->
        <div class="card-back">
          <div style="background:rgba(0,0,0,0.5); padding:5px; border-radius:6px;">
            ${match.participant}
          </div>
        </div>
        <!-- 앞면: 참가자 이름 + 항목 -->
        <div class="card-front">
          ${match.participant} → ${match.item}
        </div>
      </div>
    `;
    card.addEventListener("click", () => {
      if (!card.classList.contains("flipped")) {
        card.classList.add("flipped");
        addResultRow(match.participant, match.item);
      }
    });
    cardsContainer.appendChild(card);
  });
}

function addResultRow(participant, item) {
  const resultBody = document.querySelector("#result-table tbody");
  const row = document.createElement("tr");
  row.innerHTML = `<td>${participant}</td><td>${item}</td>`;
  resultBody.appendChild(row);
}
