import { ref, push, onValue, remove, set } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";

const db = window.database;

/* 참가자 입력 */
function addParticipant(name) {
  if (name.trim() !== "") {
    push(ref(db, "participants"), name);
  }
}

function displayParticipants() {
  onValue(ref(db, "participants"), snapshot => {
    const data = snapshot.val();
    const list = document.getElementById("participantList");
    list.innerHTML = "";

    if (data) {
      Object.entries(data).forEach(([key, participant]) => {
        const span = document.createElement("span");
        span.textContent = participant;

        const delBtn = document.createElement("button");
        delBtn.textContent = "X";
        delBtn.className = "delete-btn";
        delBtn.addEventListener("click", () => remove(ref(db, "participants/" + key)));

        span.appendChild(delBtn);
        list.appendChild(span);
      });
    }
  });
}

/* 항목 입력 */
function addItem(itemName, count) {
  if (itemName.trim() !== "" && count > 0) {
    for (let i = 0; i < count; i++) {
      push(ref(db, "items"), itemName);
    }
  }
}

function displayItems() {
  onValue(ref(db, "items"), snapshot => {
    const data = snapshot.val();
    const list = document.getElementById("itemList");
    list.innerHTML = "";

    if (data) {
      Object.entries(data).forEach(([key, item]) => {
        const span = document.createElement("span");
        span.textContent = item;

        const delBtn = document.createElement("button");
        delBtn.textContent = "X";
        delBtn.className = "delete-btn";
        delBtn.addEventListener("click", () => remove(ref(db, "items/" + key)));

        span.appendChild(delBtn);
        list.appendChild(span);
      });
    }
  });
}

/* 랜덤 셔플 */
function shuffle(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

/* 게임 실행 */
function runGame() {
  Promise.all([
    new Promise(resolve => onValue(ref(db, "participants"), snap => resolve(snap.val()), { onlyOnce: true })),
    new Promise(resolve => onValue(ref(db, "items"), snap => resolve(snap.val()), { onlyOnce: true }))
  ]).then(([participantsData, itemsData]) => {
    const participants = participantsData ? Object.values(participantsData) : [];
    let items = itemsData ? Object.values(itemsData) : [];

    const cardArea = document.getElementById("cardArea");
    cardArea.innerHTML = "";

    if (participants.length === 0 || items.length === 0) {
      cardArea.textContent = "참가자와 항목을 먼저 등록하세요!";
      return;
    }

    // 항목 랜덤 셔플
    items = shuffle(items);

    participants.forEach((participant, index) => {
      const item = items[index % items.length] || "항목 없음";

      const card = document.createElement("div");
      card.className = "card";

      const inner = document.createElement("div");
      inner.className = "card-inner";

      const back = document.createElement("div");
      back.className = "card-back";
      back.textContent = participant;

      const front = document.createElement("div");
      front.className = "card-front";
      front.textContent = `${participant} → ${item}`;

      inner.appendChild(back);
      inner.appendChild(front);
      card.appendChild(inner);

      card.addEventListener("click", () => inner.classList.toggle("flipped"));
      cardArea.appendChild(card);
    });
  });
}

/* 전체 리셋 */
function resetAll() {
  set(ref(db, "participants"), null);
  set(ref(db, "items"), null);
  document.getElementById("cardArea").innerHTML = "";
}

/* 이벤트 연결 */
document.getElementById("participantButton").addEventListener("click", () => {
  const input = document.getElementById("participantInput").value;
  addParticipant(input);
  document.getElementById("participantInput").value = "";
});

document.getElementById("addButton").addEventListener("click", () => {
  const input = document.getElementById("itemInput").value;
  const count = parseInt(document.getElementById("itemCount").value) || 1;
  addItem(input, count);
  document.getElementById("itemInput").value = "";
  document.getElementById("itemCount").value = "";
});

document.getElementById("runButton").addEventListener("click", runGame);
document.getElementById("resetButton").addEventListener("click", resetAll);

/* 초기화 */
displayParticipants();
displayItems();
