const paddle1 = document.getElementById('paddle1');
const paddle2 = document.getElementById('paddle2');
const ball = document.getElementById('ball');
const score1 = document.getElementById('score1');
const score2 = document.getElementById('score2');

let ballDirection = { x: 5, y: 5 };
let paddle1Y = 250;
let paddle2Y = 250;
let score1Value = 0;
let score2Value = 0;
let upPressed = false;
let downPressed = false;
let wPressed = false;
let sPressed = false;
let lastScorer = null;
let isGameActive = false;


document.addEventListener('keydown', (e) => {
    if (e.key === 'w') upPressed = true;
    if (e.key === 's') downPressed = true;
    if (e.key === 'ArrowUp') wPressed = true;
    if (e.key === 'ArrowDown') sPressed = true;
    if (e.key === ' ') {
        if (!isGameActive) {
            // Reset scores if either player has reached 10 or more
            if (score1Value >= 10 || score2Value >= 10) {
                score1Value = 0;
                score2Value = 0;
                score1.textContent = score1Value;
                score2.textContent = score2Value;
                document.getElementById('winnerText').textContent = ''; // Clear winner text
            }
            startRound(); // Start a new round whether it's a new game or a reset
        }
    }

    paddle1.style.top = `${paddle1Y}px`;
    paddle2.style.top = `${paddle2Y}px`;
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'w') upPressed = false;
    if (e.key === 's') downPressed = false;
    if (e.key === 'ArrowUp') wPressed = false;
    if (e.key === 'ArrowDown') sPressed = false;

    paddle1.style.top = `${paddle1Y}px`;
    paddle2.style.top = `${paddle2Y}px`;
});

function startRound() {
    isGameActive = true;
    let initialSpeed = 3; // You can keep the same initial speed for the x direction

    if (lastScorer === null) {
        // Randomly choose a direction to move horizontally
        ballDirection = { x: Math.random() < 0.5 ? -initialSpeed : initialSpeed, y: 0 };
    } else if (lastScorer === 'player1') {
        // Start the ball towards player 2, moving horizontally
        ballDirection = { x: initialSpeed, y: 0 };
    } else {
        // Start the ball towards player 1, moving horizontally
        ballDirection = { x: -initialSpeed, y: 0 };
    }
    moveBall();
}

function moveBall() {
    let ballX = ball.offsetLeft + ballDirection.x;
    let ballY = ball.offsetTop + ballDirection.y;
    const ballDiameter = 20; // The diameter of the ball

    // Check for collision with top
    if (ballY <= 0) {
        ballY = 0; // Reposition ball so it's not past the boundary
        ballDirection.y *= -1;
    }

    // Check for collision with bottom
    if (ballY + ballDiameter >= 600) {
        ballY = 600 - ballDiameter; // Reposition ball so it's not past the boundary
        ballDirection.y *= -1;
    }
    // Collision detection for Paddle 1 (left paddle)
    if (ballX <= (paddle1.offsetLeft + paddle1.offsetWidth) && ballX + ballDiameter >= paddle1.offsetLeft && ballY + ballDiameter >= paddle1.offsetTop && ballY <= (paddle1.offsetTop + paddle1.offsetHeight)) {
        ballDirection.x *= -1;
        adjustBallDirectionY(ballY, paddle1Y);
    }

    // Collision detection for Paddle 2 (right paddle)
    if (ballX + ballDiameter >= paddle2.offsetLeft && ballX <= (paddle2.offsetLeft + paddle2.offsetWidth) && ballY + ballDiameter >= paddle2.offsetTop && ballY <= (paddle2.offsetTop + paddle2.offsetHeight)) {
        ballDirection.x *= -1;
        adjustBallDirectionY(ballY, paddle2Y);
    }

    // Check for scoring
    if (ballX <= 0) {
        score2Value++;
        score2.textContent = score2Value;
        lastScorer = 'player2';
        resetBall();
        return; // Exit the function to prevent the ball from moving after scoring
    }
    if (ballX + 20 >= 800) { // game-container width is 800, ball width is 20
        score1Value++;
        score1.textContent = score1Value;
        lastScorer = 'player1';
        resetBall();
        return; // Exit the function to prevent the ball from moving after scoring
    }

    // Move the ball
    ball.style.left = `${ballX}px`;
    ball.style.top = `${ballY}px`;

    // Continue the animation
    requestAnimationFrame(moveBall);
}

function adjustBallDirectionY(ballY, paddleY) {
    const paddleHeight = 100; // The height of the paddle
    const ballDiameter = 20; // The diameter of the ball
    const paddleCenter = paddleY + (paddleHeight / 2);
    const ballCenter = ballY + (ballDiameter / 2);
    const impactDiff = ballCenter - paddleCenter;

    // Normalize the impact difference based on the paddle height
    const normalizedImpact = impactDiff / (paddleHeight / 2);

    // Calculate new Y direction based on where the ball hits the paddle
    // We multiply by a factor to ensure a noticeable but reasonable change in direction
    const newYDirection = normalizedImpact * 5; // Adjust this factor as needed

    // Ensure the ball doesn't go too fast in the Y direction
    ballDirection.y = Math.max(Math.min(newYDirection, 5), -5);
}



function resetBall() {
    ball.style.left = '390px';
    ball.style.top = '290px';

    let winner = null;
    if (score1Value >= 10) {
        winner = 'Player 1';
    } else if (score2Value >= 10) {
        winner = 'Player 2';
    }

    isGameActive = false; // Set the game as not active when the ball is reset

    if (winner) {
        document.getElementById('winnerText').textContent = winner + ' Wins!';
        pauseGame();
    }
}

function pauseGame() {
    ballDirection = { x: 0, y: 0 };
}

function updatePaddles() {
    if (upPressed && paddle1Y > 0) paddle1Y -= 4;
    if (downPressed && paddle1Y < 500) paddle1Y += 4;
    if (wPressed && paddle2Y > 0) paddle2Y -= 4;
    if (sPressed && paddle2Y < 500) paddle2Y += 4;

    paddle1.style.top = `${paddle1Y}px`;
    paddle2.style.top = `${paddle2Y}px`;

    requestAnimationFrame(updatePaddles); // Continuously update paddles
}

updatePaddles(); // Start the loop