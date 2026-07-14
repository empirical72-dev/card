const participants = ["A. 철수", "B. 영희", "C. 민수"];
const items = ["점심", "커피", "면제"];

function renderCards() {
  const container = document.getElementById("card-container");
  container.innerHTML = "";
  participants.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerText = p;
    container.appendChild(card);
  });
}

function shuffleAndMatch() {
  // Fisher-Yates shuffle
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // 매칭 결과 출력
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = "";
  participants.forEach((p, i) => {
    const line = document.createElement("p");
    line.textContent = `${p} → ${shuffled[i]}`;
    resultDiv.appendChild(line);
  });
}

// 초기 카드 렌더링
renderCards();
