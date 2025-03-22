let names = []; // Mảng chứa danh sách tên
let luumau= [];
const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");
let spinning = false; // Trạng thái quay
let angle = 0; // Góc quay hiện tại
let spinSpeed = 0; // Tốc độ quay
let listgoc = []; // Lưu góc bắt đầu và kết thúc

// Tăng độ phân giải canvas để không bị vỡ
function fixCanvas() {
    let dpr = window.devicePixelRatio || 1; 
    let size = Math.min(window.innerWidth * 0.9, 600); 
    canvas.width = size * dpr; 
    canvas.height = size * dpr;
    canvas.style.width = size + "px";
    canvas.style.height = size + "px";
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr); 
    drawWheel();
}

window.addEventListener("resize", fixCanvas);
fixCanvas();

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
        luumau.push(getRandomColor());
        updateAngles(); // Cập nhật góc khi thêm tên
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
    luumau.splice(index, 1);
    updateAngles(); // Cập nhật lại danh sách góc
    updateNameList();
    drawWheel();
}

// Cập nhật danh sách góc theo số phần tử hiện có
function updateAngles() {
    listgoc = [];
    let total = names.length;
    for (let i = 0; i < total; i++) {
        let startAngle = (i / total) * 2 * Math.PI;
        let endAngle = ((i + 1) / total) * 2 * Math.PI;
        listgoc.push([startAngle, endAngle]);
    }
}

// Vẽ vòng quay (Màu random)
function drawWheel() {
    if (names.length === 0) return;
    let total = names.length;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(angle); // Xoay vòng quay
    ctx.translate(-canvas.width / 2, -canvas.height / 2);

    names.forEach((name, index) => {
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, canvas.height / 2);
        ctx.arc(canvas.width / 2, canvas.height / 2, canvas.height / 2, listgoc[index][0], listgoc[index][1]);
        ctx.fillStyle = luumau[index];
        ctx.fill();
        ctx.stroke();

        // Hiển thị tên
        ctx.fillStyle = "white";
        let fontSize = Math.max(12, canvas.height / 10); // Cỡ chữ tỉ lệ với vòng tròn
        ctx.font = `${fontSize}px Arial`;
        let textAngle = (listgoc[index][0] + listgoc[index][1]) / 2;
        let x = canvas.width / 2 + Math.cos(textAngle) * (canvas.height / 3);
        let y = canvas.height / 2 + Math.sin(textAngle) * (canvas.height / 3);
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(textAngle + Math.PI / 2);
        ctx.fillText(name, 0, 0);
        ctx.restore();
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
        spinSpeed *= 0.98;
        drawWheel();
        requestAnimationFrame(animateSpin);
    } else {
        spinning = false;

        let winnerIndex = -1;  // Đặt mặc định là -1 để kiểm tra
        for (let i = 0; i < listgoc.length; i++) {
            let adjustedAngle = (angle % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI); // Chuyển angle về khoảng 0 → 2π
            if (listgoc[i][0] <= adjustedAngle && adjustedAngle <= listgoc[i][1]) {
                winnerIndex = i;
                break; // Thoát ngay khi tìm được
            }
        }

        if (winnerIndex !== -1) {
            document.getElementById("result").textContent = `🎉 Chúc mừng ${names[winnerIndex]} đã trúng thưởng! 🎊`;
        } else {
            document.getElementById("result").textContent = `❌ Không tìm thấy người thắng, thử lại nhé!`;
        }
    }
}

    animateSpin();
}

// Khi load trang, vẽ vòng quay
window.onload = function () {
    updateAngles(); // Đảm bảo góc đúng ngay từ đầu
    drawWheel();
};
