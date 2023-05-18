// Game Vairables and constants
let inputDir={x:0,y:0};
const foodSound=new Audio('food.mp3');
const gameOverSound=new Audio('death.mp3');
const moveSound=new Audio('move.wav');
const musicSound=new Audio('music.mp3');
const sequence = document.querySelector(".color_seq");

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

let colors = [
  ['FF0000', '000CFF', '7C00FF' , 'FF8B00'],
  ['00FFE8', 'FFEC00', '32FF00', 'FF0000'],
  ['FF8B00', '7C00FF', '32FF00'],
  ['000CFF', 'FF00F0', 'FF8B00', '32FF00'],
  ['32FF00', '7C00FF', 'FFEC00']
];

let colorSequence = [];


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


function colorSpreader(){
  const randomColorSequence = colors[Math.floor(Math.random() * colors.length)];

  colorSequence.length = 0;

  randomColorSequence.forEach((color) => {
    let colorPosition = {x: 0, y: 0};
    do {
        colorPosition = {
            x: Math.floor(Math.random() * 23)+2,
            y: Math.floor(Math.random() * 23)+2,
          };
        } while (snakeArr.some((part) => part.x === colorPosition.x && part.y === colorPosition.y) || 
        colorSequence.some((letter) => letter.x === colorPosition.x && letter.y === colorPosition.y));

    colorSequence.push({ color, ...colorPosition });
  });

  let color_markup = "";
  for(let i =0 ; i < randomColorSequence.length; i++){
        color_markup += `<div class="color_blocks" style ="background-color: #${randomColorSequence[i]}; color: #${randomColorSequence[i]}"></div>`;
    }
  sequence.innerHTML = color_markup;
}

colorSpreader();

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
    colorSpreader();
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
      colorSequence.length > 0 &&
      snakeArr[0].y === colorSequence[0].y &&
      snakeArr[0].x === colorSequence[0].x
    ) {

        // Remove the matched letter from the array
            foodSound.play();
            colorSequence.shift();  

        // Check if the snake has eaten the entire word
            if (colorSequence.length === 0) {
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

                 colorSpreader();
            }
      }
    // Checking if the snake ate any other letter in the word not following the order
    else if (
                colorSequence.length > 0 &&
                colorSequence.slice(1).some((color) => {
                  return color.x === snakeArr[0].x && color.y === snakeArr[0].y;
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
    colorSequence.forEach((colorPos) => {
        const foodElement = document.createElement('div');
        foodElement.style.gridRowStart = colorPos.y;
        foodElement.style.gridColumnStart = colorPos.x;
        foodElement.style.backgroundColor = `#${colorPos.color}`;
        foodElement.classList.add('food');

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
