let names = []; // Mảng chứa danh sách tên
const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");

// Thêm tên vào danh sách
function addName() {
    let nameInput = document.getElementById("nameInput");
    let name = nameInput.value.trim();
    if (name) {
        names.push(name);
        updateNameList();
        nameInput.value = "";
        drawWheel();
    }
}

// Cập nhật danh sách tên hiển thị
function updateNameList() {
    let nameList = document.getElementById("nameList");
    nameList.innerHTML = "";
    names.forEach(name => {
        let li = document.createElement("li");
        li.textContent = name;
        nameList.appendChild(li);
    });
}

// Vẽ vòng quay
function drawWheel() {
    if (names.length === 0) return;
    let total = names.length;
    let angle = 2 * Math.PI / total;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    names.forEach((name, index) => {
        ctx.beginPath();
        ctx.moveTo(150, 150);
        ctx.arc(150, 150, 150, index * angle, (index + 1) * angle);
        ctx.fillStyle = index % 2 === 0 ? "#ff5733" : "#33c3ff";
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "white";
        ctx.font = "14px Arial";
        ctx.fillText(name, 150 + Math.cos(angle * index) * 100, 150 + Math.sin(angle * index) * 100);
    });
}

// Quay vòng
function spinWheel() {
    if (names.length === 0) return;
    let winnerIndex = Math.floor(Math.random() * names.length);
    let result = document.getElementById("result");
    result.textContent = `🎉 Chúc mừng ${names[winnerIndex]} đã trúng thưởng! 🎊`;
}

// Khi load trang, vẽ vòng quay
window.onload = drawWheel;

