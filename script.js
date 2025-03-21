let names = []; // Mảng chứa danh sách tên
let luumau= [];
const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");
let spinning = false; // Trạng thái quay
let angle = 0; // Góc quay hiện tại
let spinSpeed = 0; // Tốc độ quay
// Tăng độ phân giải canvas để không bị vỡ
function fixCanvas() {
    let dpr = window.devicePixelRatio || 1; 
    let size = Math.min(window.innerWidth * 0.9, 600); 
    canvas.width = size * dpr; 
    canvas.height = size * dpr;
    canvas.style.width = size + "px";
    canvas.style.height = size + "px";
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
        luumau[index]= getRandomColor();
        drawWheel();
    }
}
// Xóa tên
function deleteName(index) {
    names.splice(index, 1);
    luumau.splice(index, 1);
    updateNameList();
    drawWheel();
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
        ctx.fillStyle = luumau[index] ;
        ctx.fill();
        ctx.stroke();

        // Hiển thị tên
        ctx.fillStyle = "white";
        let radius = canvas.height / 2;
        let fontSize = Math.max(12, radius / 10); // Cỡ chữ tỉ lệ với vòng tròn
        ctx.font = `${fontSize}px Arial`;
        let textAngle = (index + 0.5) * sliceAngle;
        let x = canvas.width / 2 + Math.cos(textAngle) * (canvas.height / 3);
        let y = canvas.height / 2 + Math.sin(textAngle) * (canvas.height / 3);
        ctx.fillText(name, x - ctx.measureText(name).width / 2, y);
        ctx.save(); // Lưu trạng thái canvas
        ctx.translate(x, y); // Dịch chuyển vị trí chữ về tọa độ mới
        ctx.rotate(textAngle + Math.PI / 2); // Xoay chữ theo hình quạt
        ctx.fillText(name, 0, 0); // Vẽ chữ tại vị trí mới
        ctx.restore(); // Khôi phục trạng thái ban đầu
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
            let winnerIndex = Math.floor(((angle % (2 * Math.PI)) / (2 * Math.PI)) * names.length);
            document.getElementById("result").textContent = `🎉 Chúc mừng ${names[winnerIndex]} đã trúng thưởng! 🎊`;
        }
    }
    animateSpin();
}

// Khi load trang, vẽ vòng quay
window.onload = drawWheel;
