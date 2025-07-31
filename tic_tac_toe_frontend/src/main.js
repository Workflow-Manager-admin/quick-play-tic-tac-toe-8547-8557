import './style.css';

// Color palette from requirements
const COLORS = {
    accent: '#e74c3c',
    primary: '#3498db',
    secondary: '#2ecc71',
};

const PLAYER_X = 'X';
const PLAYER_O = 'O';

// PUBLIC_INTERFACE
function createTicTacToeApp() {
    const app = document.createElement('div');
    app.id = 'ttt-root';

    // Status Bar
    const statusBar = document.createElement('div');
    statusBar.id = 'ttt-status-bar';
    statusBar.setAttribute('aria-live', 'polite');

    // Game Board
    const boardWrap = document.createElement('div');
    boardWrap.id = 'ttt-board-wrap';
    const board = document.createElement('div');
    board.id = 'ttt-board';
    boardWrap.appendChild(board);

    // Restart Button
    const restartBtn = document.createElement('button');
    restartBtn.type = 'button';
    restartBtn.id = 'ttt-restart';
    restartBtn.innerText = 'Restart Game';

    // Central stack layout
    app.appendChild(statusBar);
    app.appendChild(boardWrap);
    app.appendChild(restartBtn);

    // Game state
    let grid = Array(9).fill('');
    let xIsNext = true;
    let gameOver = false;

    // PUBLIC_INTERFACE
    function calculateWinner(squares) {
        /** Checks for a winner on the board. Returns 'X', 'O' or null. */
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
            [0, 4, 8], [2, 4, 6],            // Diagonals
        ];
        for (let [a, b, c] of lines) {
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c])
                return squares[a];
        }
        return null;
    }

    // PUBLIC_INTERFACE
    function isDraw(squares) {
        /** Determines if the board is in a draw state (full, no winner). */
        return squares.every(cell => cell) && !calculateWinner(squares);
    }

    // PUBLIC_INTERFACE
    function renderStatus() {
        /** Renders the game status bar with player's turn or result. */
        const winner = calculateWinner(grid);
        let status = '';
        if (winner) {
            status = `Winner: ${winner}`;
            statusBar.style.color = COLORS.accent;
        } else if (isDraw(grid)) {
            status = 'Draw!';
            statusBar.style.color = COLORS.secondary;
        } else {
            status = `Turn: ${xIsNext ? PLAYER_X : PLAYER_O}`;
            statusBar.style.color = COLORS.primary;
        }
        statusBar.textContent = status;
    }

    // PUBLIC_INTERFACE
    function renderBoard() {
        /** Renders the 3x3 Tic Tac Toe grid and attaches click handlers. */
        board.innerHTML = '';
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('button');
            cell.className = 'ttt-cell';
            cell.setAttribute('data-idx', i);
            cell.setAttribute('tabindex', '0');
            cell.setAttribute('aria-label', `Grid cell ${i+1}`);
            cell.disabled = !!grid[i] || gameOver;
            cell.textContent = grid[i] ? grid[i] : '';
            // Style the moves
            if (grid[i] === PLAYER_X) {
                cell.style.color = COLORS.primary;
            } else if (grid[i] === PLAYER_O) {
                cell.style.color = COLORS.secondary;
            }

            cell.addEventListener('click', () => handleMove(i));
            board.appendChild(cell);
        }
    }

    // PUBLIC_INTERFACE
    function handleMove(idx) {
        /** Handles clicking a cell: updates state, checks for win/draw, re-renders. */
        if (gameOver || grid[idx]) return;
        grid[idx] = xIsNext ? PLAYER_X : PLAYER_O;
        xIsNext = !xIsNext;
        if (calculateWinner(grid) || isDraw(grid)) {
            gameOver = true;
        }
        renderBoard();
        renderStatus();
    }

    // PUBLIC_INTERFACE
    function restartGame() {
        /** Resets game state and re-renders board and status bar. */
        grid = Array(9).fill('');
        xIsNext = true;
        gameOver = false;
        renderBoard();
        renderStatus();
    }

    restartBtn.addEventListener('click', restartGame);

    // Initial render
    renderBoard();
    renderStatus();
    return app;
}

// Mount the game app
const rootEl = document.getElementById('app');
rootEl.innerHTML = '';
rootEl.appendChild(createTicTacToeApp());
