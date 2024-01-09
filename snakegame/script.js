// Elemen HTML
const board = document.getElementById('game-board');
const instruksi = document.getElementById('instruksi');
const logo = document.getElementById('logo');
const score = document.getElementById('score');
const hiScoreText = document.getElementById('highscore');

// Definisi variabel
const besarGrid = 30;
let ular = [{x: 15, y: 15}];
let makan = generateMakan();
let hiScore = 0;
let direksi = 'right';
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;
let newDireksi;

// Fungsi draw
function draw() {
    board.innerHTML = '';
    drawUlar();
    drawMakan();
    updScore();
}

// Draw ular
function drawUlar() {
    ular.forEach((segment) => {
        const ularElement = createGameElement('div','ular');
        setPosisi(ularElement, segment);
        board.appendChild(ularElement);
    })
}

// Utk membuat ular atau makanan
function createGameElement(tag, className) {
    const Element = document.createElement(tag);
    Element.className = className;
    return Element;
}

// Menentukan posisi ular atau makanan
function setPosisi(Element, posisi) {
    Element.style.gridColumn = posisi.x;
    Element.style.gridRow = posisi.y;
}

//Test fungsi draw
// draw();

// Fungsi draw utk makanan
function drawMakan() {
        if (gameStarted) {
            const makanElement = createGameElement('div','makan')
            setPosisi(makanElement, makan);
            board.appendChild(makanElement);
        }
}

// Generate makanan
function generateMakan() {
    const x = Math.floor(Math.random() * besarGrid) + 1;
    const y = Math.floor(Math.random() * besarGrid) + 1;
    return {x,y};
}

// Gerak ular
function gerak() {
    const head = {...ular[0]};
    switch (direksi) {
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
        case 'right':
            head.x++;
            break;
        case 'left':
            head.x--;
            break;
    }

    ular.unshift(head);

    // ular.pop();
    if(head.x === makan.x && head.y === makan.y) {
        makan = generateMakan();
        speed();
        clearInterval(gameInterval);
        gameInterval = setInterval(() => {
            gerak();
            checkCollision();
            draw();
        }, gameSpeedDelay);
    } else {
        ular.pop();
    }
}

//test gerak
// setInterval(() => {
//     gerak();
//     draw();
// }, 60);

// Start game func
function startGame() {
    gameStarted = true;
    instruksi.style.display = 'none'
    logo.style.display = 'none'
    gameInterval = setInterval(() => {
        gerak();
        checkCollision();
        draw();
    }, gameSpeedDelay);
}

// Keypress listen
function keyPress(event) {
    if ((!gameStarted && event.code === 'Space') || (!gameStarted && event.key === ' ') || (!gameStarted && event.key === 'Enter')) {
        startGame();
    } else {
        let newDireksi;

        switch (event.key) {
            case 'ArrowUp':
                newDireksi = 'up';
                break;
            case 'ArrowDown':
                newDireksi = 'down';
                break;
            case 'ArrowLeft':
                newDireksi = 'left';
                break;
            case 'ArrowRight':
                newDireksi = 'right';
                break;
            case 'w':
                newDireksi = 'up';
                break;
            case 's':
                newDireksi = 'down';
                break;
            case 'a':
                newDireksi = 'left';
                break;
            case 'd':
                newDireksi = 'right';
                break;
            default:
                return;
        }

        if (
            (direksi === 'up' && newDireksi === 'down') ||
            (direksi === 'up' && newDireksi === 'down' && 'left') ||
            (direksi === 'up' && newDireksi === 'down' && 'right') ||
            (direksi === 'up' && newDireksi === 'down' && 'up') ||
            (direksi === 'down' && newDireksi === 'up') ||
            (direksi === 'down' && newDireksi === 'up' && 'left') ||
            (direksi === 'down' && newDireksi === 'up' && 'right') ||
            (direksi === 'down' && newDireksi === 'up' && 'down') ||
            (direksi === 'left' && newDireksi === 'right') ||
            (direksi === 'left' && newDireksi === 'right' && 'down') ||
            (direksi === 'left' && newDireksi === 'right' && 'up') ||
            (direksi === 'left' && newDireksi === 'right' && 'left') ||
            (direksi === 'right' && newDireksi === 'left') ||
            (direksi === 'right' && newDireksi === 'left' && 'up') ||
            (direksi === 'right' && newDireksi === 'left' && 'down') ||
            (direksi === 'right' && newDireksi === 'left' && 'right')
        ) {
            return;
        }

        direksi = newDireksi;
    }
}


document.addEventListener('keydown', keyPress)

// Add speed
function speed() {
    // console.log(gameSpeedDelay);
    if (gameSpeedDelay >180) {
        gameSpeedDelay -= 5;
    } else if (gameSpeedDelay > 150 ) {
        gameSpeedDelay -=3;
    } else if (gameSpeedDelay > 100 ) {
        gameSpeedDelay -=2;
    } else if (gameSpeedDelay > 25 ) {
        gameSpeedDelay -=1;
    }
}

// Collision
function checkCollision() {
    const head = ular[0];

    if(head.x < 1 || head.x > besarGrid || head.y < 1 || head.y > besarGrid) {
        resetGame();
    }

    for(let i = 1; i < ular.length; i++) {
        if (head.x === ular[i].x && head.y === ular[i].y){
            resetGame();
        }
    }
}

//reset game
function resetGame() {
    updHiScore();
    stopGame();
    ular = [{x:15,y:15}];
    makan = generateMakan();
    direksi = 'right';
    gameSpeedDelay = 200;
    updScore();
}

//scoring sys
function updScore() {
    const currScore = ular.length -1;
    score.textContent = currScore.toString().padStart(3, '0');
}

//stop game
function stopGame() {
    clearInterval(gameInterval);
    gameStarted = false;
    instruksi.style.display = 'block';
    logo.style.display = 'block';
}

//high score
function updHiScore() {
    const currScore = ular.length -1;
    if(currScore > hiScore) {
        hiScore = currScore;
        hiScoreText.textContent = hiScore.toString().padStart(3, '0');
    }
    hiScoreText.style.display = 'block';
}