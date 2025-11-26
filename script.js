// Gameboard Object (IIFE) initialization
const Gameboard = (function (document) {
	let board = ["", "", "", "", "", "", "", "", ""];

	function resetBoard() {
		board = ["", "", "", "", "", "", "", "", ""];
	}

	//Winning logic
	function getPlayerHasWon(markerID) {
		//Horizontal match
		for (let i = 0; i <= 6; i += 3) {
			if (board[i] === markerID && markerID === board[i + 1] && markerID === board[i + 2]) {
				return true;
			}
		}

		//Vertical match
		for (let i = 0; i <= 2; i += 1) {
			if (board[i] === markerID && markerID === board[i + 3] && markerID === board[i + 6]) {
				return true;
			}
		}

		//Left diagonal match
		if (board[0] == markerID && board[4] === markerID && board[8] === markerID) {
			return true;
		}

		//Right diagonal match
		if (board[2] === markerID && board[4] === markerID && board[6] === markerID) {
			return true;
		}

		return false;
	}

	function placeMarker(markerID, index) {
		//Empty square check
		if (board[index] !== "") {
			throw Error("Error placing marker");
		}

		let tileEle = document.getElementById(`tile-${index + 1}`);
		tileEle.textContent = markerID;

		markerID === "O"
			? tileEle.classList.add("selected-player")
			: tileEle.classList.add("selected-comp");

		board[index] = markerID;
	}

	function printBoard() {
		console.log(board.slice(0, 3));
		console.log(board.slice(3, 6));
		console.log(board.slice(6));
	}

	function getBoard() {
		return board;
	}

	return { getPlayerHasWon, placeMarker, printBoard, getBoard, resetBoard };
})(document);

//Player factory function
const Player = function (name, markerID, isComputer = false) {
	let score = 0;

	function getScore() {
		return score;
	}

	function incrementScore() {
		score++;
	}

	function getIsComputer() {
		return isComputer;
	}

	return { getScore, incrementScore, name, markerID, getIsComputer };
};

// Game Object (IFFE) Initialization
const Game = (function (Player, Gameboard, document) {
	//Initialization of players
	const computer = Player("Computer", "X", true);
	const player1 = Player("Player 1", "O", false);
	const resultEle = document.getElementById("result");
	const gameboardEle = document.getElementById("gameboard");
	const tileEleArray = document.querySelectorAll(".tile");
	let winner = null;

	//Function to start the game's introductory text
	function startGame() {
		//Run turns till a player wins
		gameboardEle.addEventListener("click", runRoundEventFunc);
	}

	function getGameTied() {
		return !Gameboard.getBoard().includes("");
	}

	function runTurn(player, tileEle) {
		//Returns the co-ordinates choice of where to place the marker (by either a player or computer)
		function getChoice() {
			if (player.getIsComputer()) {
				let availableChoices = [];
				Gameboard.getBoard().forEach((v, i) => {
					if (v === "") {
						//Set the choice to correspond with the 1-9 options rather than the index
						availableChoices.push(i + 1);
					}
				});

				//Process and return a random choice out of available choices (indexes of board array without a marker)
				let choiceIndex = Math.floor(Math.random() * availableChoices.length);
				return availableChoices[choiceIndex];
			} else {
				return tileEle.id.slice(5);
			}
		}

		function processChoice(choice) {
			//Place a marker at the index of the choice generated
			Gameboard.placeMarker(player.markerID, choice - 1);
		}

		function checkWinAndEndRound() {
			//Check if the current player has won then set variable to end round
			if (Gameboard.getPlayerHasWon(player.markerID)) {
				winner = player;
				resultEle.toggleAttribute("hidden");
				resultEle.textContent = player.getIsComputer() ? "The computer won!" : "You won!";
			} else if (getGameTied()) {
				resultEle.toggleAttribute("hidden");
				resultEle.textContent = "Game has ended in a tie!";
			}
		}

		//Run Turn function activation and process
		processChoice(getChoice());
		checkWinAndEndRound();
	}

	//Function to be added to tile click event listener (each click)
	function runRoundEventFunc(e) {
		//Logic to make sure game has not ended
		if (!winner && !getGameTied()) {
			runTurn(player1, e.target);
			if (!winner && !getGameTied()) {
				runTurn(computer, e.target);
			}
		}
	}

	//Resets the game to base values and removes event listeners
	function resetGame() {
		tileEleArray.forEach((e) => {
			e.textContent = "";
			e.classList = "tile";
		});

		winner = null;
		resultEle.toggleAttribute("hidden");
		Gameboard.resetBoard();
		gameboardEle.removeEventListener("click", runRoundEventFunc);
	}

	return { startGame, resetGame };
})(Player, Gameboard, document);

//
// DOM Manipulation
//
const startGameBtnEle = document.getElementById("start-game-btn");
const resetGameBtnEle = document.getElementById("reset-game-btn");

startGameBtnEle.addEventListener("click", (e) => {
	e.target.classList.add("disabled");
	e.target.textContent = "Game Started";
	Game.startGame();
});

resetGameBtnEle.addEventListener("click", (e) => {
	startGameBtnEle.classList.remove("disabled");
	startGameBtnEle.textContent = "Start Game";
	Game.resetGame();
});
