// Gameboard Object (IIFE) initialization - Factory Function
const Gameboard = (function () {
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
			throw Error("Square already has a marker on it!");
		}

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
})();

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
const Game = (function (Player, Gameboard) {
	//Initialization of players
	const computer = Player("Computer", "X", true);
	const player1 = Player("Player 1", "O", false);

	//Setting up initial variables for later use
	let roundCount = 0;

	//Function to start the game's introductory text
	function startGame() {
		console.log(`Welcome ${player1.name} to tick tack toe!`);
		console.log(`Below is the blank board.`);
		console.log(
			`Each co-ordinate is a number 1-9 corresponding to the squares top left to bottom right`
		);
	}

	function playRound() {
		currentPlayerTurn = player1;
		let winner = null;

		//IFFE to initialize the round beginning actions
		const initializeRound = (function () {
			roundCount++;
			console.log(`\nRound ${roundCount} Starting\n`);
			console.log(`Choose a square to place an ${player1.markerID}`);
			Gameboard.printBoard();
		})();

		function runTurn(player) {
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
					return prompt("Enter your co-ordinates: ");
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
				}
			}

			//Run Turn function activation and process
			processChoice(getChoice());
			console.log("\nNew board display:");
			Gameboard.printBoard();
			checkWinAndEndRound();
		}

		//Run turns till a player wins
		do {
			runTurn(currentPlayerTurn);
			//Switch the next player
			currentPlayerTurn = currentPlayerTurn === player1 ? computer : player1;
		} while (!winner);

		//On end of round, set log message
		console.log(`\n${winner.name} has won!`);
	}

	return { startGame, playRound };
})(Player, Gameboard);

//Introductory Text
// Game.startGame();
// Game.playRound();

//
// DOM Manipulation
//

const gameboardEle = document.getElementById("gameboard");
const tileEleArray = document.querySelectorAll(".tile");

tileEleArray.forEach((e) => console.log(e.textContent));
