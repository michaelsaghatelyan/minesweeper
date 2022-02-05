document.addEventListener('DOMContentLoaded', () => {
const grid = document.querySelector('.grid')
let isGameOver = false;
let isGameStarted = false;
let width = 10
let mines = parseInt((width*width)/5)
let flags = 0
let frees = width*width-mines
let squares = []

function createField() { //creating the minefield

    const minesArray = Array(mines).fill('mine') //array for mines
    const freesArray = Array(frees).fill('free') //array for free cells
    const mineField = minesArray.concat(freesArray) //concatenating mines and free cells
    const shuffledField = mineField.sort(() => Math.random()-0.5) //getting the minefield through shuffling
    
    for(let i = 0; i < width*width; ++i) {
        const square = document.createElement('div') // creating css divisions for the squares
        square.setAttribute('id', i) // giving IDs to the squares
        square.classList.add(shuffledField[i]) //assigning the "mine|free" attribute to each square
        grid.appendChild(square)
        squares.push(square)
        
        square.addEventListener('click', function(e) { //left click
            if(!isGameStarted) {
                isGameStarted=true
            }
            click(square)
            if(!isGameOver) checkForWin()
          })
                
        square.oncontextmenu = function(e) { //right click
            e.preventDefault()
            if(!isGameStarted) return
            addFlag(square)
            if(!isGameOver) checkForWin()
        }
    }

    for(let i=0;i<squares.length;++i) {
        let total=0;
        const isLeftEdge = (i % width === 0)
        const isRightEdge = (i % width === width-1)
        if(squares[i].classList.contains('free')) { //counting the number of mines near each free square

            if (i > 0 && !isLeftEdge && squares[i-1].classList.contains('mine')) total ++ //WEST
            if (i > 9 && !isRightEdge && squares[i+1-width].classList.contains('mine')) total ++ //NORTHEAST
            if (i > 10 && squares[i-width].classList.contains('mine')) total ++ //NORTH
            if (i > 11 && !isLeftEdge && squares[i-1-width].classList.contains('mine')) total ++ //NORTHWEST
            if (i < 99 && !isRightEdge && squares[i+1].classList.contains('mine')) total ++ //EAST
            if (i < 90 && !isLeftEdge && squares[i-1+width].classList.contains('mine')) total ++ //SOUTHWEST
            if (i < 88 && !isRightEdge && squares[i+1+width].classList.contains('mine')) total ++ //SOUTHEAST
            if (i < 89 && squares[i+width].classList.contains('mine')) total ++ //SOUTH

            squares[i].setAttribute('data', total) //assigning numbers of surrounding mines to each square
        }
    }
}

createField()

function addFlag(square) {
    if(isGameOver) return
    if(!square.classList.contains('checked') && flags<mines) {
        if(!square.classList.contains('flag') && !square.classList.contains('dontknow')) {
            square.classList.add('flag')
            square.innerHTML = '🏳️‍🌈'
            flags++
        }
        else if(square.classList.contains('flag')) {
            square.classList.remove('flag')
            square.classList.add('dontknow')
            square.innerHTML = '❓'
            flags--
        }
        else if(square.classList.contains('dontknow')) {
            square.classList.remove('dontknow')
            square.innerHTML = ''
        }
    }
}

//clicking on square action
function click(square) {
    let currentId = square.id
    if(isGameOver) return
    if(square.classList.contains('dontknow')) return
    if(square.classList.contains('checked')) return
    if(square.classList.contains('flag')) return
    if(square.classList.contains('mine')) {
        square.classList.add('exploded')
        gameOver(square)
    }
    else {
    let total = square.getAttribute('data')
    if(total!=0) {
        console.log(total==1)
            if (total==1) square.classList.add('one')
            if (total==2) square.classList.add('two')
            if (total==3) square.classList.add('three')
            if (total==4) square.classList.add('four')
            if (total==5) square.classList.add('five')
            if (total==6) square.classList.add('six')
            if (total==7) square.classList.add('seven')
            if (total==8) square.classList.add('eight')
            square.classList.add('checked')
            square.innerHTML = total
            return
        }
    checkSquare(square, currentId)
    }
    square.classList.add('checked')
}

function checkSquare(square, currentId) {
    const isLeftEdge = (currentId % width === 0)
    const isRightEdge = (currentId % width === width-1)

    setTimeout(() => {

        if(currentId >= 0 && !isLeftEdge) { //checking WEST
            const newId = squares[parseInt(currentId)-1].id
            const newSquare = document.getElementById(newId)
            click(newSquare)
        }
        if(currentId > 9 && !isRightEdge) { //checking NORTHEAST
            const newId = squares[parseInt(currentId)+1-width].id
            const newSquare = document.getElementById(newId)
            click(newSquare)
        }
        if(currentId > 10) { //checking NORTH
            const newId = squares[parseInt(currentId)-width].id
            const newSquare = document.getElementById(newId)
            click(newSquare)
        }
        if(currentId > 11 && !isLeftEdge) { //checking NORTHWEST
            const newId = squares[parseInt(currentId)-1-width].id
            const newSquare = document.getElementById(newId)
            click(newSquare)
        }
        if(currentId < 88 && !isRightEdge) { //checking SOUTHEAST
            const newId = squares[parseInt(currentId)+1+width].id
            const newSquare = document.getElementById(newId)
            click(newSquare)
        }
        if(currentId < 90 && !isLeftEdge) { //checking SOUTHWEST
            const newId = squares[parseInt(currentId)-1+width].id
            const newSquare = document.getElementById(newId)
            click(newSquare)
        }
        if(currentId < 89) { //checking SOUTH
            const newId = squares[parseInt(currentId)+width].id
            const newSquare = document.getElementById(newId)
            click(newSquare)
        }
        if(currentId <= 99 && !isRightEdge) { //checking EAST
            const newId = squares[parseInt(currentId)+1].id
            const newSquare = document.getElementById(newId)
            click(newSquare)
        }
    }, 10)
}

function gameOver(square) {

    console.log('YOU LOST')
    isGameOver=true
    squares.forEach(square => {
        if(square.classList.contains('mine') && square.classList.contains('flag')) {
            square.classList.add('foundmine')
            square.innerHTML = '✔️';
        }
        else if(!square.classList.contains('mine') && square.classList.contains('flag')) {
            square.classList.add('falsemine')
            square.innerHTML = '❌';
        }
        else if(square.classList.contains('mine')) {
            square.classList.add('answermine')
            square.innerHTML = '💀';
        }
    })
}

function checkForWin() {
    let matches=0;
    for(let i=0; i<squares.length;++i) {
        
        if(squares[i].classList.contains('flag') && squares[i].classList.contains('mine')) {
            matches++
        }
        if(matches===mines) {
            console.log('CONGRATS, YOU WON. YOUR TIME: ')
            end()
            isGameOver=true
        }
    }
}

})
            
           