// Game variables
const candies = ["Blue", "Orange", "Green", "Yellow", "Red", "Purple", "Pink"];
let board = [];
const rows = 9;
const columns = 9;
let score = 0;
let timer = 60;
let timerInterval;
let highScores = [];

let currTile;
let otherTile;

// Load the game when the window loads
window.onload = function () {
    document.getElementById("startButton").addEventListener("click", startMainGame);
    document.getElementById("backButton").addEventListener("click", backToMenu);
};

// Start the main game
function startMainGame() {
    const username = document.getElementById("username").value;
    if (!username) {
        alert("Please enter your name!");
        return;
    }

    document.getElementById("menu").style.display = "none";
    document.getElementById("game").style.display = "block";

    score = 0;
    timer = 60;
    document.getElementById("score").innerText = score;
    document.getElementById("timer").innerText = timer;

    startGame();

    // Start the game timer
    timerInterval = setInterval(function () {
        timer--;
        document.getElementById("timer").innerText = timer;

        if (timer <= 0) {
            clearInterval(timerInterval);
            endGame(username);
        }
    }, 1000);
}

// End the game and display high scores
function endGame(username) {
    clearInterval(timerInterval);
    document.getElementById("game").style.display = "none";
    document.getElementById("highscoreMenu").style.display = "block";

    highScores.push({ name: username, score: score });
    highScores.sort((a, b) => b.score - a.score);

    const highscoreList = document.getElementById("highscoreList");
    highscoreList.innerHTML = '';
    highScores.forEach(entry => {
        const li = document.createElement("li");
        li.innerText = `${entry.name}: ${entry.score}`;
        highscoreList.appendChild(li);
    });
}

// Go back to the main menu
function backToMenu() {
    document.getElementById("highscoreMenu").style.display = "none";
    document.getElementById("menu").style.display = "block";
    document.getElementById("username").value = "";
}

// Initialize the game board
function startGame() {
    board = [];
    document.getElementById("board").innerHTML = '';

    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("img");
            tile.id = r.toString() + "-" + c.toString();
            tile.src = "./images/" + randomCandy() + ".png";

            // Set up drag and drop events
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

    crushCandy(); // Start by crushing initial matches
}

// Return a random candy image
function randomCandy() {
    return candies[Math.floor(Math.random() * candies.length)];
}

// Drag and drop event handlers
function dragStart() { currTile = this; }
function dragOver(e) { e.preventDefault(); }
function dragEnter(e) { e.preventDefault(); }
function dragDrop() { otherTile = this; }
function dragEnd() {
    if (!otherTile || currTile.src.includes("blank") || otherTile.src.includes("blank")) return;

    let validMove = checkValid();
    if (!validMove) return;

    crushCandy(); // Crush candies after a valid move
}

// Check if the move is valid
function checkValid() {
    let [r1, c1] = currTile.id.split("-").map(Number);
    let [r2, c2] = otherTile.id.split("-").map(Number);
    let isAdjacent = Math.abs(r1 - r2) + Math.abs(c1 - c2) === 1;

    if (isAdjacent) {
        // Swap the images
        let temp = currTile.src;
        currTile.src = otherTile.src;
        otherTile.src = temp;
        return checkMatches();
    }
    return false;
}

// Check for matching candies (rows and columns)
function checkMatches() {
    // Check rows for matches
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns - 2; c++) {
            if (board[r][c].src === board[r][c+1].src && board[r][c+1].src === board[r][c+2].src && !board[r][c].src.includes("blank")) {
                return true;
            }
        }
    }

    // Check columns for matches
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows - 2; r++) {
            if (board[r][c].src === board[r+1][c].src && board[r+1][c].src === board[r+2][c].src && !board[r][c].src.includes("blank")) {
                return true;
            }
        }
    }

    return false;
}

// Crush candies in rows or columns of three or more
function crushCandy() {
    // Crush row matches
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns - 2; c++) {
            if (board[r][c].src === board[r][c+1].src && board[r][c+1].src === board[r][c+2].src && !board[r][c].src.includes("blank")) {
                board[r][c].src = "images/blank.png";
                board[r][c+1].src = "images/blank.png";
                board[r][c+2].src = "images/blank.png";
                score += 10;
                document.getElementById("score").innerText = score;
            }
        }
    }

    // Crush column matches
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows - 2; r++) {
            if (board[r][c].src === board[r+1][c].src && board[r+1][c].src === board[r+2][c].src && !board[r][c].src.includes("blank")) {
                board[r][c].src = "images/blank.png";
                board[r+1][c].src = "images/blank.png";
                board[r+2][c].src = "images/blank.png";
                score += 10;
                document.getElementById("score").innerText = score;
            }
        }
    }

    // Collapse candies into empty spaces
    collapseCandies();
}

// Collapse candies into empty spaces
function collapseCandies() {
    for (let c = 0; c < columns; c++) {
        let blankFound = false;
        for (let r = rows - 1; r >= 0; r--) {
            if (board[r][c].src.includes("blank")) {
                blankFound = true;
            } else if (blankFound) {
                let blankTile = board[r + 1][c];
                blankTile.src = board[r][c].src;
                board[r][c].src = "images/blank.png";
            }
        }
    }

    // Fill empty spaces with new candies
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows; r++) {
            if (board[r][c].src.includes("blank")) {
                board[r][c].src = "images/" + randomCandy() + ".png";
            }
        }
    }

    // Continue crushing if matches exist
    if (checkMatches()) {
        setTimeout(crushCandy, 200);
    }
}

