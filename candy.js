// Definisi variabel permainan
var candies = ["Blue", "Orange", "Green", "Yellow", "Red", "Purple"]; // Warna-warna candy
var board = []; // Papan permainan (array 2D)
var rows = 9;
var columns = 9;
var score = 0; // Skor pemain
var timer = 60; // Timer (dalam detik)
var timerInterval; // Interval untuk timer
var highScores = []; // Array untuk menyimpan skor tertinggi

var currTile; // Tile saat ini yang sedang di-drag
var otherTile; // Tile lain yang dijadikan tujuan drag

// Inisialisasi event listener saat halaman dimuat
window.onload = function () {
    document.getElementById("startButton").addEventListener("click", startMainGame); // Memulai game
    document.getElementById("backButton").addEventListener("click", backToMenu); // Kembali ke menu
};

// Fungsi untuk memulai permainan utama
function startMainGame() {
    const username = document.getElementById("username").value; // Ambil nama pengguna
    if (!username) {
        alert("Please enter your name!"); // Cek jika nama tidak diisi
        return;
    }

    // Sembunyikan menu dan tampilkan papan permainan
    document.getElementById("menu").style.display = "none";
    document.getElementById("game").style.display = "block";

    // Reset skor dan timer
    score = 0;
    timer = 60;
    document.getElementById("score").innerText = score;
    document.getElementById("timer").innerText = timer;

    startGame(); // Mulai logika permainan

    // Set timer untuk menghitung mundur
    timerInterval = setInterval(function () {
        timer--;
        document.getElementById("timer").innerText = timer;

        if (timer <= 0) {
            clearInterval(timerInterval); // Hentikan timer ketika waktu habis
            endGame(username); // Akhiri permainan
        }
    }, 1000);
}

// Fungsi untuk mengakhiri permainan dan menyimpan skor
function endGame(username) {
    clearInterval(timerInterval);
    document.getElementById("game").style.display = "none";
    document.getElementById("highscoreMenu").style.display = "block";

    // Simpan skor pemain ke dalam array highScores
    highScores.push({ name: username, score: score });
    highScores.sort((a, b) => b.score - a.score); // Urutkan skor dari terbesar

    const highscoreList = document.getElementById("highscoreList");
    highscoreList.innerHTML = '';
    highScores.forEach(entry => {
        const li = document.createElement("li");
        li.innerText = `${entry.name}: ${entry.score}`;
        highscoreList.appendChild(li); // Tampilkan skor dalam daftar
    });
}

// Fungsi untuk kembali ke menu utama
function backToMenu() {
    document.getElementById("highscoreMenu").style.display = "none";
    document.getElementById("menu").style.display = "block";
    document.getElementById("username").value = ""; // Reset input nama
}

// Fungsi untuk memulai papan permainan
function startGame() {
    board = [];
    document.getElementById("board").innerHTML = '';

    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("img");
            tile.id = r.toString() + "-" + c.toString();
            tile.src = "./images/" + randomCandy() + ".png";

            // Tambahkan event listener untuk drag-and-drop
            tile.addEventListener("dragstart", dragStart);
            tile.addEventListener("dragover", dragOver);
            tile.addEventListener("dragenter", dragEnter);
            tile.addEventListener("drop", dragDrop);
            tile.addEventListener("dragend", dragEnd);

            document.getElementById("board").append(tile);
            row.push(tile);
        }
        board.push(row);
    }
}

// Fungsi untuk mendapatkan candy acak
function randomCandy() {
    return candies[Math.floor(Math.random() * candies.length)];
}

// Fungsi drag-and-drop
function dragStart() {
    currTile = this;
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
}

function dragDrop() {
    otherTile = this;
}

function dragEnd() {
    if (currTile.src.includes("blank") || otherTile.src.includes("blank")) {
        return;
    }

    let currCoords = currTile.id.split("-");
    let otherCoords = otherTile.id.split("-");

    let validMove = checkValid();
    if (!validMove) {
        currTile.src = otherTile.src;
        otherTile.src = currTile.src;
    } else {
        crushCandy(); // Hancurkan candy setelah validasi
    }
}

// Fungsi untuk menghancurkan candy jika ada yang cocok
function crushCandy() {
    // Cek dan hancurkan candy secara horizontal dan vertikal
}

// Fungsi untuk memeriksa apakah pergerakan valid
function checkValid() {
    // Logika untuk memeriksa apakah gerakan candy valid
}
