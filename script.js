let names = []; // Mảng chứa danh sách tên
const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");
let spinning = false; // Trạng thái quay
let angle = 0; // Góc quay hiện tại
let spinSpeed = 0; // Tốc độ quay

// Xử lý khi bấm Enter
document.getElementById("nameInput").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Ngăn form submit mặc định
        addName(); // Gọi hàm thêm tên
    }
});

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

// Cập nhật danh sách tên hiển thị (có nút chỉnh sửa & xóa)
function updateNameList() {
    let nameList = document.getElementById("nameList");
    nameList.innerHTML = "";
    names.forEach((name, index) => {
        let li = document.createElement("li");

        let nameSpan = document.createElement("span");
        nameSpan.textContent = name;
        nameSpan.contentEditable = true;
        nameSpan.onblur = function () { editName(index, this.textContent.trim()); }; // Sửa tên

        let deleteBtn = document.createElement("button");
        deleteBtn.classList.add("delete-button");
        deleteBtn.textContent = "X";
        deleteBtn.onclick = function () { deleteName(index); };

        li.appendChild(nameSpan);
        li.appendChild(deleteBtn);
        nameList.appendChild(li);
    });
}

// Sửa tên trong danh sách
function editName(index, newName) {
    if (newName) {
        names[index] = newName;
        drawWheel();
    }
}
// Xóa tên
function deleteName(index) {
    names.splice(index, 1);
    updateNameList();
    drawWheel();
}
luumau= [];
function mau() {
    for (int i = names.size(); i++) {
        luumau.add(getRandomColor());
    }
// Vẽ vòng quay (Màu random)
function drawWheel() {
    if (names.length === 0) return;
    let total = names.length;
    let sliceAngle = 2 * Math.PI / total;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(angle); // Xoay vòng quay
    ctx.translate(-canvas.width / 2, -canvas.height / 2);

    names.forEach((name, index) => {
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, canvas.height / 2);
        ctx.arc(canvas.width / 2, canvas.height / 2, canvas.height / 2, index * sliceAngle, (index + 1) * sliceAngle);
        ctx.fillStyle = luumau.get(index) ;
        ctx.fill();
        ctx.stroke();

        // Hiển thị tên
        ctx.fillStyle = "white";
        ctx.font = "14px Arial";
        let textAngle = (index + 0.5) * sliceAngle;
        let x = canvas.width / 2 + Math.cos(textAngle) * 100;
        let y = canvas.width / 2 + Math.sin(textAngle) * 100;
        ctx.fillText(name, x - ctx.measureText(name).width / 2, y);
    });

    ctx.resetTransform(); // Reset để không bị xoay chồng lên nhau
}

// Random màu sáng
function getRandomColor() {
    return `hsl(${Math.random() * 360}, 100%, 70%)`;
}

// Quay vòng với hiệu ứng
function spinWheel() {
    if (names.length === 0 || spinning) return;
    spinning = true;
    spinSpeed = Math.random() * 10 + 20; // Tốc độ ngẫu nhiên

    function animateSpin() {
        if (spinSpeed > 0.2) {
            angle += spinSpeed * Math.PI / 180;
            spinSpeed *= 0.98; // Giảm tốc từ từ
            drawWheel();
            requestAnimationFrame(animateSpin);
        } else {
            spinning = false;
            let winnerIndex = Math.floor((angle % (2 * Math.PI)) / (2 * Math.PI / names.length));
            document.getElementById("result").textContent = `🎉 Chúc mừng ${names[winnerIndex]} đã trúng thưởng! 🎊`;
        }
    }
    animateSpin();
}

// Khi load trang, vẽ vòng quay
window.onload = drawWheel;
