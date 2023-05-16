// Game Vairables and constants
let inputDir = { x: 0, y: 0 };
const foodSound = new Audio('food.mp3');
const gameOverSound = new Audio('death.mp3');
const moveSound = new Audio('move.wav');
const musicSound = new Audio('music.mp3');
const loselifesound = new Audio('loselife.mp3');

let timer = NaN;       // Initial timer value
let speed = 8;           // Speed of the snake
let lastPaintTime = 0;   // Last time the screen was painted
let score = 0            // Score of the game
let snakeArr=[
  {x:13,y:15},
  {x:13,y:16},
  {x:13,y:17}
]
let countStart = 0;           
let food = { x: 6, y: 7 };             // The food
let gainBuff = { x: 0, y: 0 };  // The gainBuff
let gainBuffTimer = 0;          // The gainBuff timer
let lives = 3;                    // Lives of the player
let lastInputDir = { x: 0, y: 0 };
let paused = 0;
let fixedTime = NaN;
let count = 0;
let isPaused = false;
let myInterval;
let modalVanish = 0;
let hiscoreval;
let gridSizeChoice = 25;
let countRestart=0;
let countBodyPause = 0;
let countBuff=0;

// Create an array to store the positions of the letters in the word
const letterPositions = [];

// The Words that will be displayed on grid for the snake to eat
let words = ["AHOY", "ADIOS", "CIAO", "HOLA", "SALUT", "SHALOM", "NIT", "TRICHY", "BREAK", "CROWN", "DANCE", "EXTRA", "FLAME", "GRAPE", "HOUSE", "IVORY",
  "JUMBO", "LEMON", "MANGO", "NORTH", "QUILT", "ROYAL", "TANGO", "UNITY", "VOICE", "WHALE", "YACHT", "ZEBRA"]

//The Gain Buffs that will be displayed on the screen
const gainBuffArray = [
  "🐁",
  "🍇",
  "🍉",
  "🍈",
  "🍓",
  "🍍",
  "🍌",
  "🥝",
  "🍏",
  "🍎",
  "🍔",
  "🍅",
  "🥚",
];

let randomBuff = gainBuffArray[Math.floor(Math.random() * gainBuffArray.length)];

// Function that runs at set intervals
function main(millisecondspassed) {

  // Check if the timer reaches 0
  if (timer <= 0) {
    gameOver();
    return;
  }

  // Update the timer display
  if (isNaN(timer)) {
    if (isNaN(fixedTime)) {
      timerBox.innerHTML = "Timer : 120";
    }
    else {
      timerBox.innerHTML = "Timer : " + Math.ceil(fixedTime / 1000);
    }

  }
  else {
    timer -= millisecondspassed;
    timerBox.innerHTML = "Timer : " + Math.ceil(timer / 1000);
  }


  gameEngine();
}

// Checks whether the game collides with the wall or eats itself
function isCollide(snake) {
  // If you bump into yourself
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
      return true;
    }
  }
  // If the snake bumps into the wall
  if (snake[0].x >= gridSizeChoice || snake[0].x <= 0 || snake[0].y >= gridSizeChoice || snake[0].y <= 0) {
    return true;
  }
  return false;
}

// Checks whether the snake has collided with the wall
function isCollideWall(snake) {
  if (snake[0].x >= gridSizeChoice || snake[0].x <= 0 || snake[0].y >= gridSizeChoice || snake[0].y <= 0) {
    return true;
  }
  return false;
}

function gridChoice(choice) {
  gridSizeChoice = choice;
  console.log(gridSizeChoice);
  document.getElementById("modal").remove();
  modalVanish = 1;
  if (paused){
    Resume();
  }
  senseKeyPress();
  gameLoop();
  wordSpreader();

}

function gridSize() {
  let parentDiv = document.createElement("div");
  parentDiv.classList.add("modal"); 
  parentDiv.id = "modal"

  let uiDiv = document.createElement("div");
  uiDiv.classList.add("uiDiv");

  

  let textBegin = document.createElement('div');
  let button1 = document.createElement('button');
  let button2 = document.createElement('button');
  let button3 = document.createElement('button');

  button1.textContent = "EASY";
  button2.textContent = "MEDIUM";
  button3.textContent = "HARD";
  

  textBegin.classList.add("text");
  button1.classList.add("gridButton");
  button2.classList.add("gridButton");
  button3.classList.add("gridButton");
  

  uiDiv.appendChild(textBegin);
  uiDiv.appendChild(button1);
  uiDiv.appendChild(button2);
  uiDiv.appendChild(button3);

  parentDiv.appendChild(uiDiv);
  document.body.appendChild(parentDiv);

  button1.addEventListener('click', () => gridChoice(20));
  button2.addEventListener('click', () => gridChoice(25));
  button3.addEventListener('click', () => gridChoice(30));
  textBegin.textContent = "Choose Difficulty";

}


// Checks whether the snake has collided with itself
function isCollideSelf(snake) {
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
      return true;
    }
  }
  return false;
}

// generates a random position for the gain buff
function generateGainBuffPosition() {

  do {
    gainBuff = {
      x: Math.floor(Math.random() * (gridSizeChoice-2)) + 2,
      y: Math.floor(Math.random() * (gridSizeChoice-2)) + 2
    };
  } while (snakeArr.some(part => part.x === gainBuff.x && part.y === gainBuff.y) ||
    letterPositions.some(letter => letter.x === gainBuff.x && letter.y === gainBuff.y));

}

// Generates a random word from the 'words' array and places it in random places on grid
function wordSpreader() {
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
        x: Math.floor(Math.random() * (gridSizeChoice-2)) + 2,
        y: Math.floor(Math.random() * (gridSizeChoice-2)) + 2,
      };
    } while (snakeArr.some((part) => part.x === letterPosition.x && part.y === letterPosition.y) ||
      letterPositions.some((letter) => letter.x === letterPosition.x && letter.y === letterPosition.y));

    letterPositions.push({ letter, ...letterPosition });
  });
}

// Game Over logic
function gameOver() {
  musicSound.pause();
  gameOverSound.play();
  inputDir = { x: 0, y: 0 };
  alert("Game Over. Press any key to play again!");
  modalVanish = 0;
  countRestart= 1;
  countBodyPause = 0;
  Pause();
  gridSize();
  snakeArr=[
    {x:13,y:15},
    {x:13,y:16},
    {x:13,y:17}
  ]
  musicSound.play();
  score = 0;
  count = 0;
  speed = 8;
  countBuff=0;
  lives = 3;
  life.innerHTML = "Lives Left: " + lives;
  scoreBox.innerHTML = "Score: " + score;

  return; // Exit the game engine function to stop the game loop
}

// Game resume logic for when the snakes eats the wrong letter
function gameResume() {
  console.log("Game Resumed");  
  wordSpreader();
  loselifesound.play();
  countBodyPause = 0;
  alert("Lost 1 life. Be Careful");
  lives--;
  life.innerHTML = "Lives Left: " + lives;
  inputDir = { x: 0, y: 0 };

}

// Game resume logic for when the snake collides with the wall
function gameResumeCollideWall() {
  if (snakeArr[0].y <=0) {
    inputDir = { x: 0, y: 1 };
  }
  else if (snakeArr[0].y >= gridSizeChoice) {
    inputDir = { x: 0, y: -1 };
  }
  else if (snakeArr[0].x <=0) {
    inputDir = { x: 1, y: 0 };
  }
  else if (snakeArr[0].x >= gridSizeChoice) {
    inputDir = { x: -1, y: 0 };
  }

  snakeArr.reverse();
  for (let i = snakeArr.length - 2; i >= 0; i--) {
    snakeArr[i + 1] = { ...snakeArr[i] };
  }

  snakeArr[0].x += inputDir.x;
  snakeArr[0].y += inputDir.y;

  wordSpreader();
  loselifesound.play();
  alert("Lost 1 life. Be Careful");
  lives--;
  life.innerHTML = "Lives Left: " + lives;
}

// Game resume logic for when the snake collides with itself
function gameResumeCollideSelf() {
  let length=snakeArr.length;
  snakeArr=[];
  countBodyPause=0;
  for (let j=0; j<length; j++) {
    if (15+j<gridSizeChoice){
      snakeArr.push({x:13,y:15+j});
      console.log({x:13,y:15+j});
    }
    else{
      snakeArr.push({x:13-j,y:gridSizeChoice});
    }
  }
}

//Game running logic
function gameEngine() {
  // Part 1: updating the snake array and food
  if (isCollide(snakeArr) && lives === 0) {
    gameOver();
  }
  else if (isCollide(snakeArr) && lives != 0) {
    if (isCollideWall(snakeArr)) {
      gameResumeCollideWall();
    }
    else if (isCollideSelf(snakeArr)) {
      gameResumeCollideSelf()
    }
  }

  // Check if the snake head collides with the buff
  if (snakeArr[0].x === gainBuff.x && snakeArr[0].y === gainBuff.y) {
    // Remove the last segment of the snake
    snakeArr.pop()
    speed -= 0.5;
    gainBuff = { x: 0, y: 0 };

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
      speed += 1;       // Increasing the speed of the snake
      gainBuffTimer = 0;  // Resetting the gainBuff timer


      clearInterval(myInterval);
      myInterval = setInterval(main, Math.ceil(1000 / speed), Math.ceil(1000 / speed))

      // Updating the high score
      if (score > hiscoreval) {
        hiscoreval = score;
        localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
        hiscoreBox.innerHTML = "High Score:<br>" + hiscoreval;
      }

      // Displaying the Timer and Score
      scoreBox.innerHTML = "Score: " + score;
      timerBox.innerHTML = "Timer: " + Math.ceil(timer / 1000);

      // Changing the direction of the snake
      snakeArr.unshift({
        x: snakeArr[0].x + inputDir.x,
        y: snakeArr[0].y + inputDir.y,
      });

      wordSpreader();
      generateGainBuffPosition();
      randomBuff = gainBuffArray[Math.floor(Math.random() * gainBuffArray.length)];
    }
  }
  // Checking if the snake ate any other letter in the word not following the order
  else if (
    (letterPositions.length > 0 &&
      letterPositions.slice(1).some((letter) => {
        return letter.x === snakeArr[0].x && letter.y === snakeArr[0].y;
      })) && lives === 0
  ) gameOver();

  // Checking if snake at any other letter and any lives are left
  else if (
    (letterPositions.length > 0 &&
      letterPositions.slice(1).some((letter) => {
        return letter.x === snakeArr[0].x && letter.y === snakeArr[0].y;
      })) && lives != 0
  ) gameResume();

  // Moving the snake
  if (!paused && countBodyPause===1){
    for (let i = snakeArr.length - 2; i >= 0; i--) {
      snakeArr[i + 1] = { ...snakeArr[i] };
    }
  
    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;
  }
  

  // Part 2: display the snake and food
  // Display the snake
  board.innerHTML = "";           //clearing the board after each game loop

  board.style.gridTemplateRows=`repeat(${gridSizeChoice},1fr)`;
  board.style.gridTemplateColumns=`repeat(${gridSizeChoice},1fr)`;

  snakeArr.forEach((e, index) => {
    snakeElement = document.createElement('div');
    snakeElement.style.gridRowStart = e.y;
    snakeElement.style.gridColumnStart = e.x;

    if (index === 0) {
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
    foodElement.style.fontSize = `${Math.floor(60/gridSizeChoice)}vmin`;
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
  if (snakeArr.length === 3 && countBuff === 0) {
    generateGainBuffPosition();
    countBuff++;
  }


  if ( gainBuff.x != 0 && gainBuff.y != 0 && gainBuffTimer < 30 && !paused) {
    // Update the board to display the buff
    const buffElement = document.createElement('div');
    buffElement.style.gridRowStart = gainBuff.y;
    buffElement.style.gridColumnStart = gainBuff.x;
    buffElement.style.fontSize = `${50/gridSizeChoice}vmin`;
    buffElement.classList.add('buff');

    // Create a container element to center the letter
    const buffContainer = document.createElement('div');
    buffContainer.classList.add('buff-container');

    // Set the text content of the letter container to the letter
    buffContainer.textContent = randomBuff;

    // Append the letter container to the food element
    buffElement.appendChild(buffContainer);
    
    board.appendChild(buffElement);
    gainBuffTimer++;
  }
  if (gainBuffTimer >= 30 && !paused) {
    generateGainBuffPosition();
    randomBuff = gainBuffArray[Math.floor(Math.random() * gainBuffArray.length)];
    gainBuffTimer = 0;
  }


}

function addHiScore(){
// Adding highscore to local storage
let hiscore = localStorage.getItem("hiscore");
if (hiscore === null) {
  hiscoreval = 0;
  localStorage.setItem("hiscore", JSON.stringify(hiscoreval))
}
else {
  hiscoreval = JSON.parse(hiscore);
  hiscoreBox.innerHTML = "High Score:<br>" + hiscore;
}

}


// Running the main function at set intervals
function gameLoop() {

  if (count === 0) {
    timer = NaN;
    clearInterval(myInterval);
    myInterval = setInterval(main, Math.ceil(1000 / speed), Math.ceil(1000 / speed));
    count++;
  }
  else if (count === 1) {
    timer = 120000;
    pauseButton.disabled = false;
    clearInterval(myInterval);
    myInterval = setInterval(main, Math.ceil(1000 / speed), Math.ceil(1000 / speed));
    count++;
  }
}

function senseKeyPress() {
  // Response to keypress
  window.addEventListener('keydown', e => {
    if (!paused && modalVanish===1) { // Check if the game is not paused
      switch (e.key) {
        case "ArrowUp":
          gameLoop();
          moveSound.play();
          countBodyPause=1;
          inputDir.x = 0;
          inputDir.y = -1;
          break;

        case "ArrowDown":
          gameLoop();
          moveSound.play();
          countBodyPause=1;
          inputDir.x = 0;
          inputDir.y = 1;
          break;

        case "ArrowLeft":
          gameLoop();
          moveSound.play();
          countBodyPause=1;
          inputDir.x = -1;
          inputDir.y = 0;
          break;

        case "ArrowRight":
          gameLoop();
          moveSound.play();
          countBodyPause=1;
          inputDir.x = 1;
          inputDir.y = 0;
          break;

        default:
          break;
      }
    }
  });
}

function onScreenButtons(){

  const upButton = document.getElementById('upButton');
  const leftButton = document.getElementById('leftButton');
  const rightButton = document.getElementById('rightButton');
  const downButton = document.getElementById('downButton');

  // Add event listeners to the buttons
  upButton.addEventListener('click', () => moveSnake('up'));
  leftButton.addEventListener('click', () => moveSnake('left'));
  rightButton.addEventListener('click', () => moveSnake('right'));
  downButton.addEventListener('click', () => moveSnake('down'));

}

// Function to handle snake movement
function moveSnake(direction) {
  if (!paused) {
    inputDir = { x: 0, y: 0 };
    switch (direction) {
      case 'up':
        gameLoop();
        moveSound.play();
        countBodyPause=1;
        inputDir.x = 0;
        inputDir.y = -1;
        break;
      case 'down':
        gameLoop();
        moveSound.play();
        countBodyPause=1;
        inputDir.x = 0;
        inputDir.y = 1;
        break;
      case 'left':
        gameLoop();
        moveSound.play();
        countBodyPause=1;
        inputDir.x = -1;
        inputDir.y = 0;
        break;
      case 'right':
        gameLoop();
        moveSound.play();
        countBodyPause=1;
        inputDir.x = 1;
        inputDir.y = 0;
        break;
      default:
        break;
    }
  }
}

function pauseResumeButtons(){
  const pauseButton = document.getElementById('pauseButton');
  pauseButton.addEventListener('click', () => Pause());

  const resumeButton = document.getElementById('resumeButton');
  resumeButton.addEventListener('click', () => Resume())

  pauseButton.disabled = true;
  resumeButton.disabled = true;
}

// Function to handle pause
function Pause() {
  lastInputDir = { ...inputDir };
  inputDir = { x: 0, y: 0 };
  paused = 1;
  pauseLoop();
  senseKeyPress();

}

// Function to handle resume
function Resume() {
  if (lastInputDir.x !== 0 || lastInputDir.y !== 0) {
    inputDir = { ...lastInputDir };
  }
  paused = 0;
  pauseLoop();
  senseKeyPress();

}

// Function  loop to handle pause and resume
function pauseLoop() {
  if (paused === 1) {
    resumeButton.disabled = false;
    pauseButton.disabled = true;
    fixedTime = timer;
    timer = NaN;
    clearInterval(myInterval);
    myInterval = setInterval(main, Math.ceil(1000 / speed), Math.ceil(1000 / speed));


  } else if (paused === 0) {
    resumeButton.disabled = true;
    pauseButton.disabled = false;
    timer = fixedTime;
    clearInterval(myInterval);
    myInterval = setInterval(main, Math.ceil(1000 / speed), Math.ceil(1000 / speed));


  }
}

// Main logic starts here
musicSound.play();

gridSize();
addHiScore();
onScreenButtons();
pauseResumeButtons()