// Gameboard Object (IIFE) initialization
const Gameboard = (function () {
	let board = ["", "", "", "", "", "", "", "", ""];

	//Winning logic
	const getPlayerHasWon = function (markerID) {
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
	};

	const placeMarker = function (markerID, index) {
		//Empty square check
		if (board[index] !== "") {
			throw Error("Square already has a marker on it!");
		}

		board[index] = markerID;
	};

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

	const getScore = function () {
		return score;
	};

	const incrementScore = function () {
		score++;
	};

	const getIsComputer = function () {
		return isComputer;
	};

	return { getScore, incrementScore, name, markerID, getIsComputer };
};

const Game = function (Player, Gameboard) {
	//Initialization
	const computer = Player("Computer", "X", true);
	const player1 = Player("Player 1", "O");
	let roundCount = 0;
	let winner = null;

	const startGame = function () {
		console.log(`Welcome ${player1.name} to tick tack toe!`);
		console.log(`Below is the blank board.`);
		console.log(
			`Each co-ordinate is a number 1-9 corresponding to the squares top left to bottom right`
		);
	};

	function setWinner(player) {
		winner = player;
	}

	const playRound = function () {
		currentPlayerTurn = player1;

		const initializeRound = (function () {
			roundCount++;
			console.log(`\nRound ${roundCount} Starting\n`);
			console.log(`Choose a square to place an ${player1.markerID}`);
			Gameboard.printBoard();
		})();

		const runTurn = function (player) {
			function getChoice() {
				if (player.getIsComputer()) {
					let availableChoices = [];
					Gameboard.getBoard().forEach((v, i) => {
						if (v === "") {
							availableChoices.push(i + 1);
						}
					});
					let choiceIndex = Math.floor(Math.random() * availableChoices.length);
					return availableChoices[choiceIndex];
				} else {
					return prompt("Enter your co-ordinates: ");
				}
			}

			function processChoice(choice) {
				Gameboard.placeMarker(player.markerID, choice - 1);
			}

			function checkWinAndEndRound() {
				//Check if the current player has won
				if (Gameboard.getPlayerHasWon(player.markerID)) {
					setWinner(player);
				}
			}

			//Run Turn function activation
			let choice = getChoice();
			processChoice(choice);
			console.log("\nNew board display:");
			Gameboard.printBoard();
			checkWinAndEndRound();
		};

		//Run turns till a player wins
		do {
			runTurn(currentPlayerTurn);
			//Switch the next player
			currentPlayerTurn = currentPlayerTurn === player1 ? computer : player1;
		} while (!winner);

		//On end of round, set log message
		console.log(`\n${winner.name} has won!`);
	};

	return { startGame, playRound };
};

const game1 = Game(Player, Gameboard);
game1.startGame();
game1.playRound();
