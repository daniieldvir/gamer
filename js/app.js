var WALL = 'WALL';
var FLOOR = 'FLOOR';
var BALL = 'BALL';
var GAMER = 'GAMER';
var GLUE = 'GLUE'

var isGlue = false

var GAMER_IMG = '<img src="img/gamer.png" />';
var BALL_IMG = '<img src="img/ball.png" />';
var GLUE_IMG = '🦠'

var gBoard;
var gGamerPos;
var gIntervalBall
var gIntervalGlue
var gScore = 0
var gRenderBall = 2

function initGame() {
	gGamerPos = { i: 2, j: 9 };
	gBoard = buildBoard();
	renderBoard(gBoard);
	gIntervalBall = setInterval(rendomBall, 5000)
	gIntervalGlue = setInterval(glue, 5000)
}


function rendomBall() {
	var emptyCell = getEmptyCell(gBoard)
	gBoard[emptyCell.i][emptyCell.j].gameElement = BALL
	renderBoard(gBoard)
	gRenderBall++
}

function glue() {
	var emptyCell = getEmptyCell(gBoard)
	gBoard[emptyCell.i][emptyCell.j].gameElement = GLUE
	renderBoard(gBoard)
}

function restart() {
	document.querySelector('.you_win').style.display = ''
	document.querySelector('.Restart_btn').style.display = ''

	initGame()
}

function buildBoard() {
	// Create the Matrix
	var board = createMat(10, 12)

	// Put FLOOR everywhere and WALL at edges
	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board[0].length; j++) {
			// Put FLOOR in a regular cell
			var cell = { type: FLOOR, gameElement: null };

			// Place Walls at edges
			if (i === 0 || i === board.length - 1 || j === 0 || j === board[0].length - 1) {
				cell.type = WALL;
			}

			// Add created cell to The game board
			board[i][j] = cell;
		}
	}

	// Place the gamer at selected position
	board[gGamerPos.i][gGamerPos.j].gameElement = GAMER;

	// Place the Balls (currently randomly chosen positions)
	board[3][8].gameElement = BALL;
	board[7][4].gameElement = BALL;

	board[0][5].type = FLOOR;
	board[9][5].type = FLOOR;
	board[5][0].type = FLOOR;
	board[5][11].type = FLOOR;

	return board;
}

// Render the board to an HTML table
function renderBoard(board) {

	var strHTML = '';
	for (var i = 0; i < board.length; i++) {
		strHTML += '<tr>\n';
		for (var j = 0; j < board[0].length; j++) {
			var currCell = board[i][j];

			var cellClass = getClassName({ i: i, j: j })

			// change to short if statement
			cellClass += (currCell.type === FLOOR) ? ' floor' : ' wall'

			//Change To template string
			strHTML += `\t<td class="cell ${cellClass}" onclick="moveTo(${i},${j})">\n`;

			// TODO - change to switch case statement
			if (currCell.gameElement === GAMER) {
				strHTML += GAMER_IMG;
			} if (currCell.gameElement === BALL) {
				strHTML += BALL_IMG;
			}
			else if (currCell.gameElement === GLUE) {
				strHTML += GLUE_IMG
			}
			strHTML += '\t</td>\n';
		}
		strHTML += '</tr>\n';

	}
	var elBoard = document.querySelector('.board');
	elBoard.innerHTML = strHTML;


}

function getEmptyCell(board) {
	var emptyCells = [];
	var currCell;

	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board[0].length; j++) {
			currCell = board[i][j];

			if (!currCell.gameElement && currCell.type !== WALL) {
				emptyCells.push({ i, j })
			}
		}
	}
	var randomCell = getRandomInt(0, emptyCells.length)
	return emptyCells[randomCell]
}


// Move the player to a specific location
function moveTo(i, j) {
	if (isGlue) return

	var targetCell = gBoard[i][j];

	if (targetCell.gameElement === GLUE) {

		isGlue = true,

			setTimeout(function () {
				isGlue = false
			}, 3000);
	}

	if (targetCell.type === WALL) return;

	// Calculate distance to make sure we are moving to a neighbor cell
	var iAbsDiff = Math.abs(i - gGamerPos.i);
	var jAbsDiff = Math.abs(j - gGamerPos.j);

	// If the clicked Cell is one of the four allowed
	if ((iAbsDiff === 1 && jAbsDiff === 0) || (jAbsDiff === 1 && iAbsDiff === 0) || (i === 9) || (i === 5) || (i === 0)) {

		if (targetCell.gameElement === BALL) {
			var elBallsCount = document.querySelector('.ball-count span')
			gScore++
			elBallsCount.innerText = gScore

			var elSound = document.querySelector('.collect')
			elSound.play()
		}

	}

	if (gScore === gRenderBall) {
		document.querySelector('.you_win').style.display = 'block'
		document.querySelector('.Restart_btn').style.display = 'block'

		clearInterval(gIntervalBall);
		clearInterval(gIntervalGlue);
	}


	// MOVING from current position
	// Model:
	gBoard[gGamerPos.i][gGamerPos.j].gameElement = null;
	// Dom:
	renderCell(gGamerPos, '');

	// MOVING to selected position
	// Model:
	gGamerPos.i = i;
	gGamerPos.j = j;
	gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
	// DOM:
	renderCell(gGamerPos, GAMER_IMG);

} // else console.log('TOO FAR', iAbsDiff, jAbsDiff);


// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
	var cellSelector = '.' + getClassName(location)
	var elCell = document.querySelector(cellSelector);
	elCell.innerHTML = value;
}

// Move the player by keyboard arrows
function handleKey(event) {

	var i = gGamerPos.i;
	var j = gGamerPos.j;


	switch (event.key) {
		case 'ArrowLeft':
			if (j === 0) {
				moveTo(5, 11);
				break;
			}
			moveTo(i, j - 1);
			break;

		case 'ArrowRight':
			if (j === 11) {
				moveTo(5, 0);
				break;
			}
			moveTo(i, j + 1);
			break;
		case 'ArrowUp':
			if (i === 0) {
				moveTo(9, 5)
				break;
			}
			moveTo(i - 1, j);
			break;
		case 'ArrowDown':
			if (i === 9) {
				moveTo(0, 5)
				break;
			}
			moveTo(i + 1, j);
			break;
	}
}



// Returns the class name for a specific cell
function getClassName(location) {
	var cellClass = 'cell-' + location.i + '-' + location.j;
	return cellClass;
}


