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

	const printBoard = function () {
		console.log(board.slice(0, 3));
		console.log(board.slice(3, 6));
		console.log(board.slice(6));
	};

	return { getPlayerHasWon, placeMarker, printBoard };
})();

//Player factory function
const Player = function (name, markerID) {
	let score = 0;

	const getScore = function () {
		return score;
	};

	const incrementScore = function () {
		score++;
	};

	return { getScore, incrementScore, name, markerID };
};

const Game = (function (Player, Gameboard) {
	//Initialization
	const computer = Player("Computer", "X");
	const player1 = Player("Player 1", "O");
	let roundCount = 0;

	const startGame = function () {
		console.log(`Welcome ${player1.name} to tick tack toe!`);
		console.log(`Below is the blank board.`);
		console.log(
			`Each co-ordinate is a number 1-9 corresponding to the squares top left to bottom right`
		);
		Gameboard.printBoard();
	};

	const playRound = function () {
		roundCount++;
		console.log(`\nRound ${roundCount} Starting\n`);
	};

	return { startGame, playRound };
})(Player, Gameboard);

Game.startGame();
Game.playRound();
