const cells = document.querySelectorAll(".cell");

const statusText = document.getElementById("status");

const scoreXElement = document.getElementById("scoreX");
const scoreOElement = document.getElementById("scoreO");

const roundNumberElement =
    document.getElementById("roundNumber");

const playerOLabel =
    document.getElementById("playerOLabel");

const newRoundButton =
    document.getElementById("newRound");

const resetScoreButton =
    document.getElementById("resetScore");

const modeButtons =
    document.querySelectorAll(".mode");

const winnerModal =
    document.getElementById("winnerModal");

const winnerTitle =
    document.getElementById("winnerTitle");

const modalButton =
    document.getElementById("modalButton");


// ======================================
// GAME VARIABLES
// ======================================

let board = [
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    ""
];

let currentPlayer = "X";

let gameActive = true;

let gameMode = "computer";

let scoreX = 0;

let scoreO = 0;

let round = 1;


// ======================================
// WINNING COMBINATIONS
// ======================================

const winningCombinations = [

    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    [0, 4, 8],
    [2, 4, 6]

];


// ======================================
// CELL CLICK
// ======================================

cells.forEach(cell => {

    cell.addEventListener("click", () => {

        const index =
            Number(cell.dataset.index);

        if (
            !gameActive ||
            board[index] !== ""
        ) {
            return;
        }

        // Computer mode
        if (
            gameMode === "computer" &&
            currentPlayer === "O"
        ) {
            return;
        }

        makeMove(index, currentPlayer);

        const result = checkGame();

        if (result) {
            finishGame(result);
            return;
        }

        switchPlayer();

        // Computer turn
        if (
            gameMode === "computer" &&
            currentPlayer === "O" &&
            gameActive
        ) {

            statusText.textContent =
                "CPU IS THINKING...";

            setTimeout(computerMove, 450);
        }

    });

});


// ======================================
// MAKE MOVE
// ======================================

function makeMove(index, player) {

    board[index] = player;

    const cell = cells[index];

    cell.textContent = player;

    cell.classList.add(
        "filled",
        player.toLowerCase()
    );

}


// ======================================
// SWITCH PLAYER
// ======================================

function switchPlayer() {

    currentPlayer =
        currentPlayer === "X"
            ? "O"
            : "X";

    if (currentPlayer === "X") {

        statusText.textContent =
            "PLAYER X'S TURN";

    } else {

        statusText.textContent =
            gameMode === "computer"
                ? "CPU'S TURN"
                : "PLAYER O'S TURN";

    }

}


// ======================================
// CHECK GAME
// ======================================

function checkGame() {

    for (
        let combination of winningCombinations
    ) {

        const a = combination[0];
        const b = combination[1];
        const c = combination[2];

        if (
            board[a] &&
            board[a] === board[b] &&
            board[a] === board[c]
        ) {

            return {
                winner: board[a],
                combination: combination
            };

        }

    }


    // Draw

    if (
        board.every(cell => cell !== "")
    ) {

        return {
            winner: "DRAW"
        };

    }

    return null;

}


// ======================================
// FINISH GAME
// ======================================

function finishGame(result) {

    gameActive = false;


    if (result.winner === "DRAW") {

        statusText.textContent =
            "ROUND DRAW";

        winnerTitle.textContent =
            "IT'S A DRAW!";

    } else {

        const winner =
            result.winner;

        result.combination.forEach(index => {

            cells[index].classList.add(
                "winner"
            );

        });


        if (winner === "X") {

            scoreX++;

            scoreXElement.textContent =
                scoreX;

            statusText.textContent =
                "PLAYER X WINS!";

            winnerTitle.textContent =
                "PLAYER X WINS!";

        } else {

            scoreO++;

            scoreOElement.textContent =
                scoreO;

            statusText.textContent =
                gameMode === "computer"
                    ? "CPU WINS!"
                    : "PLAYER O WINS!";

            winnerTitle.textContent =
                gameMode === "computer"
                    ? "CPU WINS!"
                    : "PLAYER O WINS!";

        }

    }


    setTimeout(() => {

        winnerModal.classList.add("show");

    }, 500);

}


// ======================================
// COMPUTER AI
// ======================================

function computerMove() {

    if (!gameActive) {
        return;
    }


    let move = findWinningMove("O");


    // Block player
    if (move === null) {

        move = findWinningMove("X");

    }


    // Take center
    if (
        move === null &&
        board[4] === ""
    ) {

        move = 4;

    }


    // Take corner
    if (move === null) {

        const corners = [
            0,
            2,
            6,
            8
        ];

        const availableCorners =
            corners.filter(
                index => board[index] === ""
            );

        if (availableCorners.length) {

            move =
                availableCorners[
                    Math.floor(
                        Math.random() *
                        availableCorners.length
                    )
                ];

        }

    }


    // Random available position
    if (move === null) {

        const available =
            board
                .map((value, index) =>
                    value === ""
                        ? index
                        : null
                )
                .filter(
                    index => index !== null
                );

        if (available.length) {

            move =
                available[
                    Math.floor(
                        Math.random() *
                        available.length
                    )
                ];

        }

    }


    if (move !== null) {

        makeMove(move, "O");

        const result = checkGame();

        if (result) {

            finishGame(result);

            return;

        }

        switchPlayer();

    }

}


// ======================================
// FIND WINNING MOVE
// ======================================

function findWinningMove(player) {

    for (
        let combination of winningCombinations
    ) {

        const [a, b, c] =
            combination;

        const values = [
            board[a],
            board[b],
            board[c]
        ];

        const playerCount =
            values.filter(
                value => value === player
            ).length;

        const emptyCount =
            values.filter(
                value => value === ""
            ).length;

        if (
            playerCount === 2 &&
            emptyCount === 1
        ) {

            if (board[a] === "") return a;

            if (board[b] === "") return b;

            if (board[c] === "") return c;

        }

    }

    return null;

}


// ======================================
// NEW ROUND
// ======================================

function startNewRound() {

    board = [
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        ""
    ];

    currentPlayer = "X";

    gameActive = true;

    round++;

    roundNumberElement.textContent =
        String(round).padStart(2, "0");

    statusText.textContent =
        "PLAYER X'S TURN";


    cells.forEach(cell => {

        cell.textContent = "";

        cell.classList.remove(
            "filled",
            "x",
            "o",
            "winner"
        );

    });

}


// ======================================
// RESET SCORE
// ======================================

function resetScore() {

    scoreX = 0;

    scoreO = 0;

    round = 1;

    scoreXElement.textContent = "0";

    scoreOElement.textContent = "0";

    roundNumberElement.textContent = "01";

    startNewRound();

}


// ======================================
// CHANGE GAME MODE
// ======================================

modeButtons.forEach(button => {

    button.addEventListener("click", () => {

        modeButtons.forEach(btn => {

            btn.classList.remove("active");

        });

        button.classList.add("active");

        gameMode =
            button.dataset.mode;

        if (gameMode === "computer") {

            playerOLabel.textContent =
                "CPU";

        } else {

            playerOLabel.textContent =
                "PLAYER O";

        }

        scoreX = 0;

        scoreO = 0;

        scoreXElement.textContent = "0";

        scoreOElement.textContent = "0";

        round = 1;

        roundNumberElement.textContent =
            "01";

        startNewRound();

    });

});


// ======================================
// BUTTON EVENTS
// ======================================

newRoundButton.addEventListener(
    "click",
    () => {

        winnerModal.classList.remove(
            "show"
        );

        startNewRound();

    }
);


resetScoreButton.addEventListener(
    "click",
    () => {

        winnerModal.classList.remove(
            "show"
        );

        resetScore();

    }
);


modalButton.addEventListener(
    "click",
    () => {

        winnerModal.classList.remove(
            "show"
        );

        startNewRound();

    }
);
