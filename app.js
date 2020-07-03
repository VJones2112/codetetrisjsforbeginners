document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    let squares = Array.from(document.querySelectorAll('.grid div'));
    const scoreDisplay = document.querySelector('#score');
    const startBtn = document.querySelector('#start-button');
    const width = 10;
    let nextRandom = 0;
    let timerID;
    let score = 0;

    const colors = [
'orange',
'red',
'purple',
'green',
'blue'
]

    //The Tetrominoes
    const lTetromino = [
[1, width + 1, width * 2 + 1, 2],
[width, width + 1, width + 2, width * 2 + 2],
[1, width + 1, width * 2 + 1, width * 2],
[width, width * 2, width * 2 + 1, width * 2 + 2]
]

    const zTetromino = [
[0, width, width + 1, width * 2 + 1],
[width + 1, width + 2, width * 2, width * 2 + 1],
[0, width, width + 1, width * 2 + 1],
[width + 1, width + 2, width * 2, width * 2 + 1]
]

    const tTetromino = [
[1, width, width + 1, width + 2],
[1, width + 1, width + 2, width * 2 + 1],
[width, width + 1, width + 2, width * 2 + 1],
[1, width, width + 1, width * 2 + 1]
]

    const oTetromino = [
[0, 1, width, width + 1],
[0, 1, width, width + 1],
[0, 1, width, width + 1],
[0, 1, width, width + 1]
]

    const iTetromino = [
[1, width + 1, width * 2 + 1, width * 3 + 1],
[width, width + 1, width + 2, width + 3],
[1, width + 1, width * 2 + 1, width * 3 + 1],
[width, width + 1, width + 2, width + 3]
]

    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

    let currentPosition = 4;
    let currentRotation = 0;

    //randomly select a Tetromino and its first rotation
    let random = Math.floor(Math.random() * theTetrominoes.length);
    //console.log(random) just to show that random is working;
    let current = theTetrominoes[random][currentRotation]
    //Above is the LTetrominoes' first rotation

    //draw the Tetromino
    function draw() {
        //what the hell is this below?
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino')
            squares[currentPosition + index].style.backgroundColor = colors[random]
        })
    }
//I don't think I need the draw below
//    draw()

    //undraw the Tetromino
    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino')
            squares[currentPosition + index].style.backgroundColor = ''
        })
    }

    //make the Tetromino move down each second
    //timerID = setInterval(moveDown, 1000);

    //assign functions to keyCodes
    function control(e) {
        if (e.keyCode === 37) {
            moveLeft()
        } else if (e.keyCode === 38) {
            rotate()
        } else if (e.keyCode === 39) {
            moveRight()
        } else if (e.keyCode === 40) {
            moveDown()
        }
    }
    document.addEventListener('keyup', control)

    //move down function
    function moveDown() {
        undraw()
        currentPosition += width
        draw()
        freeze()
    }

    //freeze function with an if statement: If at least one item in the Tetromino array (.some) touches a div with class item of taken, we turn each of the Tetromino squares into a square that containes the class of 'taken'. Once we made the function, we added it to our moveDown function so it would work.
    function freeze() {
        if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'))
            //start a new Tetromino falling
            random = nextRandom;
            nextRandom = Math.floor(Math.random() * theTetrominoes.length)
            current = theTetrominoes[random][currentRotation]
            currentPosition = 4
            draw()
            displayShape()
            addScore()
            gameOver()
        }
    }

    //move the Tetromino left, unless it is at the edge or there is a blockage. If some part of the Tetromino divided by the width leaves exactly no remainder
    function moveLeft() {
        undraw()
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)

        if (!isAtLeftEdge) currentPosition -= 1

        if(current.some(index => squares[currentPosition + index].classList.contains('taken')))
            currentPosition += 1
    }
    draw()

    //move the Tetromino right, unless it is at the edge or there is a blockage. If some part of the Tetromino divided by the width leaves a remainder of 1(?)
    function moveRight() {
        undraw()
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1)

        if (!isAtRightEdge) currentPosition += 1

        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition -= 1
        }
        draw()
    }

    //rotate the Tetromino
    function rotate() {
        undraw()
        currentRotation++
        if (currentRotation === current.length) {
            //if the curretn rotation gets to 4, we restart at the first rotation
            currentRotation = 0
        }
        current = theTetrominoes[random][currentRotation]
        draw()
    }

    //Show the up-next Tetromino in mini-grid
    const displaySquares = document.querySelectorAll('.mini-grid div')
    const displayWidth = 4
    const displayIndex = 0

    //the Tetrominos without rotations
    const upNextTetrominoes = [
[1, displayWidth+1, displayWidth*2+1, 2], //lTetromino's 1st rotation
[0, displayWidth, displayWidth+1, displayWidth*2+1], //zTetromino's 1st rotation
[1, displayWidth, displayWidth+1, displayWidth+2], //tTetromino's 1st rotation
[0, 1, displayWidth, displayWidth+1], //oTetromino's 1st rotation
[1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //iTetromino's 1st rotation
]

    //Display the shape in the coming up mini-grid
    function displayShape() {
        //remove any trace of a tetromino from the entire grid
        displaySquares.forEach(square => {
            square.classList.remove('tetromino')
            square.style.backgroundColor = ''
        })
        upNextTetrominoes[nextRandom].forEach(index => {
            displaySquares[displayIndex + index].classList.add('tetromino')
            displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
        })
    }

    //Add functionality to the button

    startBtn.addEventListener('click', () => {
        if (timerID) {
            clearInterval(timerID)
            timerID = null
        } else {
            draw()
            timerID = setInterval(moveDown, 1000)
            nextRandom = Math.floor(Math.random() * theTetrominoes.length)
            displayShape()
        }

    })

    //Add Score
    function addScore() {
        for (let i = 0; i < 199; i += width) {
            const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9]

            if (row.every(index => squares[index].classList.contains('taken'))) {
                score += 10
                scoreDisplay.innerHTML = score
                row.forEach(index => {
                    squares[index].classList.remove('taken')
                    //remove the blue so it doesn't show up at the top of the grid.
                    squares[index].classList.remove('tetromino')
                    squares[index].style.backgroundColor = ''
                })
                const squaresRemoved = squares.splice(i, width)
                //add back a row so grid doesn't appear smaller
                squares = squaresRemoved.concat(squares)
                squares.forEach(cell => grid.appendChild(cell))
            }
        }
    }

    //Game over function
    function gameOver() {
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            scoreDisplay.innerHTML = 'end'
            clearInterval(timerID)
        }
    }









    //    PLAYING WITH ALERT
    //    function showAlert (firstName) {
    ////        your code block goes here
    //        alert(firstName + ', you have been alerted!')
    //    }
    //    showAlert('Veronica');

    //    OR YOU CAN USE AN ARRAY BUT IT DIDN'T WORK FOR ME, KEPT SAYING MY FUNCTION SHOWALERT WAS AN UNEXPECTED IDENTIFIER :(
    //    const name = ['Veronica', 'Ayala', 'Jones']
    //    fuction showAlert() {
    //        alert(name[0] + '' + name[2] + ',you have been alerted!')
    //            }
    ////    showAlert(): void
    //    showAlert();

    //    FOREACH EXAMPLE BELOW
    // let names = ['Veronica', 'Michael', 'Mom', 'Lucas', 'Stephanie', 'Guillermo']   ;
    //    
    //    names.forEach(name => {
    //        console.log(name + ' is the best!')
    //    })



})
