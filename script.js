// Firebase v9 모듈 방식 import
import { ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";

// HTML에서 window.database로 노출한 DB 객체 가져오기
const db = window.database;

/* ---------------- 참가자 입력 ---------------- */
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

/* ---------------- 항목 입력 ---------------- */
function addItem(itemName) {
  if (itemName.trim() !== "") {
    push(ref(db, "items"), itemName);
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

/* ---------------- 게임 실행 ---------------- */
function runGame() {
  Promise.all([
    new Promise(resolve => onValue(ref(db, "participants"), snap => resolve(snap.val()), { onlyOnce: true })),
    new Promise(resolve => onValue(ref(db, "items"), snap => resolve(snap.val()), { onlyOnce: true }))
  ]).then(([participantsData, itemsData]) => {
    const participants = participantsData ? Object.values(participantsData) : [];
    const items = itemsData ? Object.values(itemsData) : [];

    const cardArea = document.getElementById("cardArea");
    cardArea.innerHTML = "";

    participants.forEach((participant, index) => {
      const item = items[index % items.length] || "항목 없음";

      const card = document.createElement("div");
      card.className = "card";

      const inner = document.createElement("div");
      inner.className = "card-inner";

      const back = document.createElement("div");
      back.className = "card-back";
      back.textContent = participant; // 뒷면: 참가자 이름

      const front = document.createElement("div");
      front.className = "card-front";
      front.textContent = `${participant} → ${item}`; // 앞면: 참가자 + 항목

      inner.appendChild(back);
      inner.appendChild(front);
      card.appendChild(inner);

      // 카드 클릭 시 flip
      card.addEventListener("click", () => inner.classList.toggle("flipped"));
      cardArea.appendChild(card);
    });
  });
}

/* ---------------- 이벤트 연결 ---------------- */
document.getElementById("participantButton").addEventListener("click", () => {
  const input = document.getElementById("participantInput").value;
  addParticipant(input);
  document.getElementById("participantInput").value = "";
});

document.getElementById("addButton").addEventListener("click", () => {
  const input = document.getElementById("itemInput").value;
  addItem(input);
  document.getElementById("itemInput").value = "";
});

document.getElementById("runButton").addEventListener("click", runGame);

/* ---------------- 초기화 ---------------- */
displayParticipants();
displayItems();
