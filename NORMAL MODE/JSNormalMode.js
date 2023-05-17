// Game Vairables and constants
let inputDir={x:0,y:0};
const foodSound=new Audio('food.mp3');
const gameOverSound=new Audio('death.mp3');
const moveSound=new Audio('move.wav');
const musicSound=new Audio('music.mp3');

let count=0;
let myInterval;
let timer = NaN;     // Initial timer value
let speed=8;           // Speed of the snake
let lastPaintTime=0;   // Last time the screen was painted
let score=0            // Score of the game
let snakeArr=[
    {x:13,y:15},
    {x:13,y:16},
    {x:13,y:17}
]
let food={x:6,y:7};    // The food

// Create an array to store the positions of the letters in the word
const letterPositions = [];

// The Words that will be displayed on grid for the snake to eat
let words=["AHOY","ADIOS","CIAO","HOLA","SALUT","SHALOM","NIT","TRICHY"] 

function main(millisecondspassed) {
  
    // Check if the timer reaches 0
    if (timer <= 0) {
      gameOver();
      return;
    }
  
    // Update the timer display
    if (isNaN(timer)){
      timerBox.innerHTML = "Timer : 60";
    }
    else{
      timer-=millisecondspassed;
      timerBox.innerHTML = "Timer : " + Math.ceil(timer/1000);
    }
    

    gameEngine();
  }

// Checks wether the game collides with the wall or eats itself
function isCollide(snake) {
    // If the snake bumps into the wall
    if (snake[0].x >= 25 || snake[0].x <= 0 || snake[0].y >= 25 || snake[0].y <= 0) {
      return true;
    }
    return false;
  }


// Generates a random word from the 'words' array and places it in random places on grid
function wordSpreader(){  
  // Generate a random word from the 'words' array
  const randomWord = words[Math.floor(Math.random() * words.length)];
  word.innerHTML = "The Word:<br>" + randomWord;

  // Clear the array which has the letter positions
  letterPositions.length = 0;

  // Generate random positions for each letter in the word
  randomWord.split('').forEach((letter) => {
      let letterPosition = { x: 0, y: 0 };
      do {
          letterPosition = {
              x: Math.floor(Math.random() * 23)+2,
              y: Math.floor(Math.random() * 23)+2,
            };
          } while (snakeArr.some((part) => part.x === letterPosition.x && part.y === letterPosition.y) || 
          letterPositions.some((letter) => letter.x === letterPosition.x && letter.y === letterPosition.y));

      letterPositions.push({ letter, ...letterPosition });
  });
}

wordSpreader();


// Game Over logic
function gameOver(){
    musicSound.pause();
    gameOverSound.play();
    inputDir = { x: 0, y: 0 };
    alert("Game Over. Press any key to play again!");
    snakeArr=[
      {x:13,y:15},
      {x:13,y:16},
      {x:13,y:17}
  ]
    musicSound.play();
    score = 0;
    count=0;
    gameLoop();
    scoreBox.innerHTML = "Score: " + score;
    
    wordSpreader();
    return; // Exit the game engine function to stop the game loop
}

//Game running logic
function gameEngine(){
    // Part 1: updating the snake array and food
    if (isCollide(snakeArr)) {
        gameOver();
    }   
    // Check if the snake head position matches the next letter position in the word
    if (
      letterPositions.length > 0 &&
      snakeArr[0].y === letterPositions[0].y &&
      snakeArr[0].x === letterPositions[0].x
    ) {

        // Remove the matched letter from the array
            foodSound.play();
            letterPositions.shift();  

        // Check if the snake has eaten the entire word
            if (letterPositions.length === 0) {
                score += 1;   // Updating the score
                timer += 5000;   // Updating the timer

                
                clearInterval(myInterval);
                myInterval = setInterval(main,Math.ceil(1000/speed),Math.ceil(1000/speed))

                // Updating the high score
                if (score > hiscoreval) {
                    hiscoreval = score;
                    localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
                    hiscoreBox.innerHTML = "High Score: " + hiscoreval;
                 }

                 // Displaying the Timer and Score
                 scoreBox.innerHTML = "Score: " + score;
                 timerBox.innerHTML = "Timer: " + Math.ceil(timer/1000);

                 // Changing the direction of the snake
                 snakeArr.unshift({
                   x: snakeArr[0].x + inputDir.x,
                   y: snakeArr[0].y + inputDir.y,
                 }); 

                 wordSpreader();
            }
      }
    // Checking if the snake ate any other letter in the word not following the order
    else if (
                letterPositions.length > 0 &&
                letterPositions.slice(1).some((letter) => {
                  return letter.x === snakeArr[0].x && letter.y === snakeArr[0].y;
                })
            )gameOver();

    // Moving the snake
    for (let i = snakeArr.length-2; i >=0; i--) {
        snakeArr[i+1]={...snakeArr[i]};
    }

    snakeArr[0].x+=inputDir.x;
    snakeArr[0].y+=inputDir.y;

    // Part 2: display the snake and food
    // Display the snake
    board.innerHTML="";           //clearing the board after each game loop
    snakeArr.forEach((e,index)=>{
        snakeElement=document.createElement('div');
        snakeElement.style.gridRowStart=e.y;
        snakeElement.style.gridColumnStart=e.x;

        if (index===0){
            snakeElement.classList.add('head');
        }
        else{
            snakeElement.classList.add('snake');
        }
        board.appendChild(snakeElement);
    })



    // Update the food element to display the letters
    letterPositions.forEach((letterPos) => {
    const foodElement = document.createElement('div');
    foodElement.style.gridRowStart = letterPos.y;
    foodElement.style.gridColumnStart = letterPos.x;
    foodElement.style.fontSize = `${Math.floor(60/25)}vmin`;
    foodElement.classList.add('food');

    // Create a container element to center the letter
    const letterContainer = document.createElement('div');
    letterContainer.classList.add('letter-container');

    // Set the text content of the letter container to the letter
    letterContainer.textContent = letterPos.letter;

    // Append the letter container to the food element
    foodElement.appendChild(letterContainer);

    // Append the food element to the board
    board.appendChild(foodElement);
  });
}

// Main Logic starts here
musicSound.play();

// Adding highscore to local storage
let hiscore = localStorage.getItem("hiscore");
if(hiscore === null){
    hiscoreval = 0;
    localStorage.setItem("hiscore", JSON.stringify(hiscoreval))
}
else{
    hiscoreval = JSON.parse(hiscore);
    hiscoreBox.innerHTML = "High Score:<br>" + hiscore;
}

// Game Loop
function gameLoop(){
  if (count===0){
    musicSound.play();
    timer=NaN;
    clearInterval(myInterval);
    myInterval = setInterval(main,Math.ceil(1000/speed),Math.ceil(1000/speed));
    count++;
  }
  else if (count===1){
    timer=60000;
    clearInterval(myInterval);
    myInterval = setInterval(main,Math.ceil(1000/speed),Math.ceil(1000/speed));
    count++;
  }
}

gameLoop();

// Response to keypress
window.addEventListener('keydown',e =>{
    switch (e.key) {
        case "ArrowUp":
              gameLoop();
              moveSound.play();  
              inputDir.x=0;
              inputDir.y=-1;
              break;

        case "ArrowDown":
            gameLoop();
            moveSound.play();   
            inputDir.x=0;
            inputDir.y=1;
            break;

        case "ArrowLeft":
            gameLoop();
            moveSound.play(); 
            inputDir.x=-1;
            inputDir.y=0;
            break;

        case "ArrowRight":
            gameLoop();
            moveSound.play();
            inputDir.x=1;
            inputDir.y=0;
            break;

        default:
            break;
    }
})

// Get the button elements
const upButton = document.getElementById('upButton');
const leftButton = document.getElementById('leftButton');
const rightButton = document.getElementById('rightButton');
const downButton = document.getElementById('downButton');

// Add event listeners to the buttons
upButton.addEventListener('click', () => moveSnake('up'));
leftButton.addEventListener('click', () => moveSnake('left'));
rightButton.addEventListener('click', () => moveSnake('right'));
downButton.addEventListener('click', () => moveSnake('down'));

// Function to handle snake movement
function moveSnake(direction) {
  inputDir = { x: 0, y: 0 };
  moveSound.play();
  switch (direction) {
    case 'up':
      gameLoop();
      moveSound.play(); 
      inputDir.x = 0;
      inputDir.y = -1;
      break;
    case 'down':
      gameLoop();
      moveSound.play(); 
      inputDir.x = 0;
      inputDir.y = 1;
      break;
    case 'left':
      gameLoop();
      moveSound.play(); 
      inputDir.x = -1;
      inputDir.y = 0;
      break;
    case 'right':
      gameLoop();
      moveSound.play(); 
      inputDir.x = 1;
      inputDir.y = 0;
      break;
    default:
      break;
  }
}
