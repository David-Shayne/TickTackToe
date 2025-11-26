// Gameboard Object (IIFE) initialization - Factory Function
const Gameboard = (function (document) {
	let board = ["", "", "", "", "", "", "", "", ""];

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

	return { getPlayerHasWon, placeMarker, printBoard, getBoard };
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

// Game Object (IFFE) Initialization - Factory Function
const Game = (function (Player, Gameboard, document) {
	//Initialization of players
	const computer = Player("Computer", "X", true);
	const player1 = Player("Player 1", "O", false);
	let winner = null;

	//Setting up initial variables for later use
	let roundCount = 0;

	//Function to start the game's introductory text
	function startGame(tileEleArray) {
		tileEleArray.forEach((e) => (e.textContent = ""));
	}

	function getGameTied() {
		return !Gameboard.getBoard().includes("");
	}

	function playRound() {
		//IFFE to initialize the round beginning actions
		const initializeRound = (function () {
			roundCount++;
		})();

		function runTurn(player, tileEle, resultEle) {
			//Returns the co-ordinates choice of where to place the marker (by either a player or computer)
			function getChoice(tileEle) {
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
					console.log(`${player.name} has won!`);
				} else if (getGameTied()) {
					resultEle.toggleProperty("hide");
					resultEle.textContent = "Game has ended in a tie!";
				}
			}

			//Run Turn function activation and process
			processChoice(getChoice(tileEle));
			checkWinAndEndRound();

			//When a player clicks a square
			//Get choice of tile id
		}

		//Run turns till a player wins
		gameboardEle.addEventListener("click", (e) => {
			//Logic to make sure game has not ended
			if (!winner && !getGameTied()) {
				runTurn(player1, e.target);
				if (!winner && !getGameTied()) {
					runTurn(computer, e.target);
				}
			}
		});
	}

	return { startGame, playRound };
})(Player, Gameboard, document);

//
// DOM Manipulation
//

const gameboardEle = document.getElementById("gameboard");
const tileEleArray = document.querySelectorAll(".tile");
const startGameBtnEle = document.getElementById("start-game-btn");

startGameBtnEle.addEventListener("click", (e) => {
	Game.startGame(tileEleArray);
	Game.playRound();
});
