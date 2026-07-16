// Firebase 초기화 (자신의 Firebase 설정으로 교체)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "card-game-cec92.firebaseapp.com",
  databaseURL: "https://card-game-cec92-default-rtdb.firebaseio.com",
  projectId: "card-game-cec92",
  storageBucket: "card-game-cec92.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
firebase.initializeApp(firebaseConfig);

const database = firebase.database();

/* ---------------- 참가자 입력 ---------------- */
function addParticipant(name) {
  if (name.trim() !== "") {
    database.ref("participants").push(name);
  }
}

function displayParticipants() {
  database.ref("participants").on("value", snapshot => {
    const data = snapshot.val();
    const list = document.getElementById("participantList");
    list.innerHTML = "";

    if (data) {
      Object.values(data).forEach(participant => {
        const li = document.createElement("li");
        li.textContent = participant;
        list.appendChild(li);
      });
    }
  });
}

/* ---------------- 항목 입력 ---------------- */
function addItem(itemName) {
  if (itemName.trim() !== "") {
    database.ref("items").push(itemName);
  }
}

function displayItems() {
  database.ref("items").on("value", snapshot => {
    const data = snapshot.val();
    const list = document.getElementById("itemList");
    list.innerHTML = "";

    if (data) {
      Object.values(data).forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        list.appendChild(li);
      });
    }
  });
}

/* ---------------- 게임 실행 ---------------- */
function runGame() {
  database.ref("participants").once("value", participantSnap => {
    const participants = participantSnap.val() ? Object.values(participantSnap.val()) : [];

    database.ref("items").once("value", itemSnap => {
      const items = itemSnap.val() ? Object.values(itemSnap.val()) : [];

      const resultTable = document.querySelector("#resultTable tbody");
      resultTable.innerHTML = "";

      // 참가자와 항목 매칭
      participants.forEach((participant, index) => {
        const item = items[index % items.length]; // 항목 순환 매칭
        const row = document.createElement("tr");

        const tdName = document.createElement("td");
        tdName.textContent = participant;

        const tdItem = document.createElement("td");
        tdItem.textContent = item;

        row.appendChild(tdName);
        row.appendChild(tdItem);
        resultTable.appendChild(row);
      });
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
