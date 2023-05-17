// Game Vairables and constants
const foodSound = new Audio('food.mp3');
const gameOverSound = new Audio('death.mp3');
const moveSound = new Audio('move.wav');
const musicSound = new Audio('music.mp3');
const loselifesound = new Audio('loselife.mp3');
const gainBuffSound = new Audio('buff.mp3');
const portalSound = new Audio('portal.mp3');

let timer;
let speed;
let lastPaintTime;
let score;
let snakeArr;
let snakeArr1;
let speed1;
let inputDir;
let inputDir1;
let lives1;
let score1;

let food;             // The food
let gainBuff;  // The gainBuff
let gainBuffTimer;          // The gainBuff timer
let lives;                    // Lives of the player
let lastInputDir;
let lastInputDir1;
let paused;
let fixedTime;
let count;
let isPaused;
let countbuff;
let countbuff1;
let myInterval;
let modalVanish;
let hiscoreval;
let hiscoreval1;
let gridSizeChoice;
let countRestart;
let Dir;
let bomb;
let portalOpen;
let portalClose;
let countBodyPause;
let countBodyPause1;
let bombPause;
let gameOverTextVanish;
let bombAte;
let bombAte1;
let randomBuff;
let saveGameCount;
let randomWord;
let randomWord1;

// Create an array to store the positions of the letters in the word
let letterPositions;
let letterPositions1;

function initalValVariables(){
    timer = NaN;       // Initial timer value
    speed = 8;           // Speed of the snake
    lastPaintTime = 0;   // Last time the screen was painted
    score = 0            // Score of the game
    snakeArr=[
      {x:13,y:15},
      {x:13,y:16},
      {x:13,y:17}
    ]
    snakeArr1 =[
      {x : 5 ,y : 9},
      {x : 5, y : 8},
      {x : 5, y : 7}
    ]
    speed1=8;
    inputDir = { x: 0, y: 0 };
    inputDir1={x:0,y:0};
    lives1=3;
    score1=0;
    food = { x: 6, y: 7 };             // The food
    gainBuff = { x: 0, y: 0 };  // The gainBuff
    gainBuffTimer = 0;          // The gainBuff timer
    lives = 3;                    // Lives of the player
    lastInputDir = { x: 0, y: 0 };
    lastInputDir1 = { x: 0, y: 0 };
    paused = 0;
    fixedTime = NaN;
    count = 0;
    isPaused = false;
    countbuff = 0;
    countbuff1 = 0;
    modalVanish = 0;
    gridSizeChoice = 25;
    countRestart=0;
    Dir={x:0,y:1};
    bomb={x:1,y:1};
    portalOpen={x:3,y:3};
    portalClose={x:gridSizeChoice-3,y:gridSizeChoice-3};
    countBodyPause = 0;
    countBodyPause1 = 0;
    bombPause = 0;
    gameOverTextVanish = 1;
    bombAte =0;
    bombAte1 =0;
    letterPositions1 = [];
    letterPositions = [];
    randomBuff =gainBuffArray[Math.floor(Math.random() * gainBuffArray.length)];
    saveGameCount = 0;
    localStorage.setItem('saveGameCount', JSON.stringify(saveGameCount));
}

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
  "🍞",
  "🍕",
  "🍟",
  "🍗",
  "🍖",
  "🍤",
  "🍣",

];



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
  if ((snake[0].x >= gridSizeChoice || snake[0].x <= 0 || snake[0].y >= gridSizeChoice || snake[0].y <= 0) ) {
    return true;
  }
  return false;
}

// Checks whether the snake has collided with the wall
function isCollideWall(snake) {
  if ((snake[0].x >= gridSizeChoice || snake[0].x <= 0 || snake[0].y >= gridSizeChoice || snake[0].y <= 0) ) {
    return true;
  }
  return false;
}

function isCollideSelf(snake) {
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
      return true;
    }
  }
  return false;
}

function isCollide12(){
  for (let i = 0; i < snakeArr1.length; i++) {
    if (snakeArr1[i].x === snakeArr[0].x && snakeArr1[i].y === snakeArr[0].y) {
      return true;
    }
  }
  return false;
}

function isCollide21(){
  for (let i = 0; i < snakeArr.length; i++) {
    if (snakeArr[i].x === snakeArr1[0].x && snakeArr[i].y === snakeArr1[0].y) {
      return true;
    }
  }
  return false;
}

function gridChoice(choice) {
  gridSizeChoice = choice;
  portalClose={x:gridSizeChoice-3,y:gridSizeChoice-3};
  if (!saveGameCount){
    document.getElementById("modal").remove();
  }
  
  modalVanish = 1;
  if (paused && !saveGameCount){
    Resume();
  }
  
  senseKeyPress();
  senseKeyPress1();
  gameLoop();
  if (!saveGameCount){
    wordSpreader();
    wordSpreader1();
  }
  generateBomb();

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
  let button4 = document.createElement('button');
  let button5 = document.createElement('button');

  button1.textContent = "EASY";
  button2.textContent = "NORMAL";
  button3.textContent = "HARD";
  button4.textContent = "INSANE";
  button5.textContent = "IMPOSSIBLE";
  

  textBegin.classList.add("text");
  button1.classList.add("gridButton");
  button2.classList.add("gridButton");
  button3.classList.add("gridButton");
  button4.classList.add("gridButton");
  button5.classList.add("gridButton");
  

  uiDiv.appendChild(textBegin);
  uiDiv.appendChild(button1);
  uiDiv.appendChild(button2);
  uiDiv.appendChild(button3);
  uiDiv.appendChild(button4);
  uiDiv.appendChild(button5);

  parentDiv.appendChild(uiDiv);
  document.body.appendChild(parentDiv);

  button1.addEventListener('click', () => gridChoice(20));
  button2.addEventListener('click', () => gridChoice(25));
  button3.addEventListener('click', () => gridChoice(30));
  button4.addEventListener('click', () => gridChoice(35));
  button5.addEventListener('click', () => gridChoice(40));
  textBegin.textContent = "Choose Difficulty";
}

function gameOverDiv(player){
  gameOverTextVanish = 0;
  let parentDiv = document.createElement("div");
  parentDiv.classList.add("modal"); 
  parentDiv.id = "modal"

  let gameOverDiv = document.createElement("div");
  gameOverDiv.classList.add("gameOverDiv");

  let gameOverText = document.createElement("div");
  let scoreText = document.createElement("div");
  let scoreText1 = document.createElement("div");
  let lostPlayer = document.createElement("div");
  let restartButton = document.createElement("button");
  let quitButton = document.createElement("button");

  let buttonContainer=document.createElement("div");
  buttonContainer.classList.add("gameOverButtons");

  gameOverText.textContent = "GAME OVER";
  scoreText.textContent = "Score : " + score;
  scoreText1.textContent = "Score : " + score1;
  if (player == 1){
    lostPlayer.textContent = "Player 1 Lost";
  }
  else if (player == 2){
    lostPlayer.textContent = "Player 2 Lost";
  }
  restartButton.textContent = "Restart";
  quitButton.textContent = "Quit";

  gameOverText.classList.add("gameOverText");
  scoreText.classList.add("scoreText");
  scoreText1.classList.add("scoreText1");
  lostPlayer.classList.add("lostPlayer");
  restartButton.classList.add("restartButton");
  quitButton.classList.add("quitButton");

  gameOverDiv.appendChild(gameOverText);
  gameOverDiv.appendChild(lostPlayer);
  gameOverDiv.appendChild(scoreText);
  gameOverDiv.appendChild(scoreText1);
  
  buttonContainer.appendChild(restartButton);
  buttonContainer.appendChild(quitButton);

  gameOverDiv.appendChild(buttonContainer);

  parentDiv.appendChild(gameOverDiv);
  document.body.appendChild(parentDiv);

  restartButton.addEventListener('click', () => restart());
  quitButton.addEventListener('click', () => quit());

}

// Checks whether the snake has collided with itself


// generates a random position for the gain buff
function generateGainBuffPosition() {

  do {
    gainBuff = {
      x: Math.floor(Math.random() * (gridSizeChoice-2)) + 2,
      y: Math.floor(Math.random() * (gridSizeChoice-2)) + 2
    };
  } while (snakeArr.some(part => part.x === gainBuff.x && part.y === gainBuff.y) ||
    letterPositions.some(letter => letter.x === gainBuff.x && letter.y === gainBuff.y) || 
    snakeArr1.some(part => part.x === gainBuff.x && part.y === gainBuff.y));

}

// Generates a random word from the 'words' array and places it in random places on grid
function wordSpreader() {
  // Generate a random word from the 'words' array
  randomWord = words[Math.floor(Math.random() * words.length)];
  word.innerHTML = "The Word :<br>" + randomWord;

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
      letterPositions.some((letter) => letter.x === letterPosition.x && letter.y === letterPosition.y) ||
      snakeArr1.some(part => part.x === gainBuff.x && part.y === gainBuff.y) || 
      (letterPosition.x === portalOpen.x && letterPosition.y === portalOpen.y) || 
      (letterPosition.x === portalClose.x && letterPosition.y === portalClose.y) ||
      letterPositions1.some((letter) => letter.x === letterPosition.x && letter.y === letterPosition.y));

    letterPositions.push({ letter, ...letterPosition });
  });
}

function wordSpreader1(){
  // Generate a random word from the 'words' array
  randomWord1 = words[Math.floor(Math.random() * words.length)];
  word1.innerHTML = "The Word :<br>" + randomWord1;

  // Clear the array which has the letter positions
  letterPositions1.length = 0;

  // Generate random positions for each letter in the word
  randomWord1.split('').forEach((letter) => {
    let letterPosition1 = { x: 0, y: 0 };
    do {
      letterPosition1 = {
        x: Math.floor(Math.random() * (gridSizeChoice-2)) + 2,
        y: Math.floor(Math.random() * (gridSizeChoice-2)) + 2,
      };
    } while (snakeArr1.some((part) => part.x === letterPosition1.x && part.y === letterPosition1.y) ||
      letterPositions1.some((letter) => letter.x === letterPosition1 && letter.y === letterPosition1.y) ||
      snakeArr.some(part => part.x === gainBuff.x && part.y === gainBuff.y) || 
      (letterPosition1.x === portalOpen.x && letterPosition1.y === portalOpen.y) || 
      (letterPosition1.x === portalClose.x && letterPosition1.y === portalClose.y) ||
      letterPositions.some((letter) => letter.x === letterPosition1.x && letter.y === letterPosition1.y));

    letterPositions1.push({ letter, ...letterPosition1 });
  });
}

function generateBomb(){
  bomb={x:Math.floor(Math.random() * (gridSizeChoice-2)) + 2, y: 1};
}

function bombMover(){
  if (Dir.y===1){
    if (bomb.y<gridSizeChoice-1){
      bomb.y+=1;
    }
    else{
      Dir.y=-1;
    }
  }
  else if (Dir.y===-1){
    if (bomb.y>2){
      bomb.y-=1;
    }
    else{
      Dir.y=1;
    }
  }
  bombPause=1;

}

// Game Over logic
function gameOver() {
  musicSound.pause();
  gameOverSound.play();
  inputDir = { x: 0, y: 0 };
  inputDir1 = { x: 0, y: 0 };
  Pause();
  if (lives < 1){
    gameOverDiv(1);
  }
  else if (lives1 < 1){
    gameOverDiv(2);
  }

  if (bombAte === 1){
    bombAte = 0;
    gameOverDiv(1);
  }
  else if (bombAte1 === 1){
    bombAte1 = 0;
    gameOverDiv(2);
  }
  modalVanish = 0;
  countRestart= 1;
  countBodyPause = 0;
  countBodyPause1 = 0;
  
  generateBomb();
  snakeArr=[
    {x:13,y:15},
    {x:13,y:16},
    {x:13,y:17}
  ]
  snakeArr1=[
    {x : 5 ,y : 9},
    {x : 5, y : 8},
    {x : 5, y : 7}
  ]
  musicSound.play();
  score = 0;
  score1 = 0;
  count = 0;
  speed = 8;
  speed1 = 8;
  countbuff = 0;
  lives = 3;
  lives1 = 3;
  life.innerHTML = "Lives Left : " + lives;
  life1.innerHTML = "Lives Left : " + lives1;
  scoreBox.innerHTML = "Score : " + score;
  scoreBox1.innerHTML = "Score : " + score1;
  saveGameCount = 0; // Update saveGameCount to indicate game is saved
  localStorage.setItem('saveGameCount', JSON.stringify(saveGameCount));

  return; // Exit the game engine function to stop the game loop
}

// Game resume logic for when the snakes eats the wrong letter
function gameResume() {
  wordSpreader();
  generateBomb();
  countBodyPause = 0;
  loselifesound.play();
  lives--;
  life.innerHTML = "Lives Left : " + lives;
  inputDir = { x: 0, y: 0 };
}

function gameResume1(){
  wordSpreader1();
  generateBomb();
  countBodyPause1 = 0;
  loselifesound.play();
  lives1--;
  life1.innerHTML = "Lives Left : " + lives;
  inputDir1 = { x: 0, y: 0 };
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
  lives--;
  life.innerHTML = "Lives Left : " + lives;
}

function gameResumeCollideWall1() {
  if (snakeArr1[0].y <=0) {
    inputDir1 = { x: 0, y: 1 };
  }
  else if (snakeArr1[0].y >= gridSizeChoice) {
    inputDir1 = { x: 0, y: -1 };
  }
  else if (snakeArr1[0].x <=0) {
    inputDir1 = { x: 1, y: 0 };
  }
  else if (snakeArr1[0].x >= gridSizeChoice) {
    inputDir1 = { x: -1, y: 0 };
  }

  snakeArr1.reverse();
  for (let i = snakeArr1.length - 2; i >= 0; i--) {
    snakeArr1[i + 1] = { ...snakeArr1[i] };
  }

  snakeArr1[0].x += inputDir1.x;
  snakeArr1[0].y += inputDir1.y;

  wordSpreader1();
  loselifesound.play();
  lives1--;
  life1.innerHTML = "Lives Left : " + lives1;
}


// Game resume logic for when the snake collides with itself
function gameResumeCollideSelf() {
  let length=snakeArr.length;
  snakeArr=[];
  countBodyPause=0;
  for (let j=0; j<length; j++) {
    if (15+j<gridSizeChoice){
      snakeArr.push({x:13,y:15+j});
    }
    else{
      snakeArr.push({x:13-j,y:gridSizeChoice});
    }
  }

  wordSpreader();
  loselifesound.play();
  lives--;
  life.innerHTML = "Lives Left : " + lives;
}

function gameResumeCollideSelf1() {
  let length=snakeArr1.length;
  snakeArr1=[];
  countBodyPause1=0;
  for (let j=0; j<length; j++) {
    if (9-j>1){
      snakeArr1.push({x : 5 ,y : 9-j});
    }
    else{
      snakeArr1.push({x:5+j,y:1});
    }
  }

  wordSpreader1();
  loselifesound.play();
  lives1--;
  life1.innerHTML = "Lives Left : " + lives1;
}

//Game running logic
function gameEngine() {
  bombPause=0;

  // Part 1: updating the snake array and food
  if ((isCollide(snakeArr) && lives < 1)) {
    gameOver();
  }
  else if ((isCollide(snakeArr) && lives != 0)) {
    if (isCollideWall(snakeArr)) {
      gameResumeCollideWall();
    }
    else if (isCollideSelf(snakeArr)) {
      gameResumeCollideSelf();
    }
  }

  if ((isCollide(snakeArr1) && lives1 < 1)) {
    gameOver();
  }
  else if ((isCollide(snakeArr1) && lives1 != 0)) {
    if (isCollideWall(snakeArr1)) {
      gameResumeCollideWall1();
    }
    else if (isCollideSelf(snakeArr1)) {
      gameResumeCollideSelf1();
    }
  }

  if (isCollide12()){
    gameResumeCollideSelf();
  }

  if (isCollide21()){
    gameResumeCollideSelf1();
  }

  if (lives <0 || lives1 <0){
    gameOver();
  }

  // Check if the snake head collides with the buff
  if (snakeArr[0].x === gainBuff.x && snakeArr[0].y === gainBuff.y) {
    // Remove the last segment of the snake
    gainBuffSound.play();
    snakeArr.pop()
    speed -= 0.5;
    gainBuff = { x: 0, y: 0 };

  }

  // Check if the snake1 head collides with the buff
  if (snakeArr1[0].x === gainBuff.x && snakeArr1[0].y === gainBuff.y) {
    // Remove the last segment of the snake
    gainBuffSound.play();
    snakeArr1.pop()
    speed -= 0.5;
    gainBuff = { x: 0, y: 0 };

  }

  // Snake travels through the portal
  snakeArr.forEach((e) => {
    if (e.y === 3 && e.x === 3) {
      portalSound.play();
      e.y = gridSizeChoice-3;
      e.x = gridSizeChoice-3;
    }
    else if (e.y === (gridSizeChoice-3) && e.x === (gridSizeChoice-3)) {
      portalSound.play();
      e.y = 3;
      e.x = 3;
    }
    
  })

  // Snake1 travels through the portal
  snakeArr1.forEach((e) => {
    if (e.y === 3 && e.x === 3) {
      portalSound.play();
      e.y = gridSizeChoice-3;
      e.x = gridSizeChoice-3;
    }
    else if (e.y === (gridSizeChoice-3) && e.x === (gridSizeChoice-3)) {
      portalSound.play();
      e.y = 3;
      e.x = 3;
    }

  })

  // Snake eats the bomb
  if (snakeArr[0].x === bomb.x && snakeArr[0].y === bomb.y) {
    bombAte = 1;
    gameOver();
  }

  // Snake1 eats the bomb
  if (snakeArr1[0].x === bomb.x && snakeArr1[0].y === bomb.y) {
    bombAte1 = 1;
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
      speed += 1;       // Increasing the speed of the snake
      gainBuffTimer = 0;  // Resetting the gainBuff timer


      clearInterval(myInterval);
      myInterval = setInterval(main, Math.ceil(1000 / speed), Math.ceil(1000 / speed))

      // Updating the high score
      if (score > hiscoreval) {
        hiscoreval = score;
        localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
        hiscoreBox.innerHTML = "High Score : " + hiscoreval;
      }

      // Displaying the Timer and Score
      scoreBox.innerHTML = "Score : " + score;
      timerBox.innerHTML = "Timer : " + Math.ceil(timer / 1000);

      // Changing the direction of the snake
      snakeArr.unshift({
        x: snakeArr[0].x + inputDir.x,
        y: snakeArr[0].y + inputDir.y,
      });

      wordSpreader();
      generateGainBuffPosition();
      generateBomb();
      randomBuff = gainBuffArray[Math.floor(Math.random() * gainBuffArray.length)];
    }
  }
  // Checking if the snake ate any other letter in the word not following the order
  else if (
    (letterPositions.length > 0 &&
      letterPositions.slice(1).some((letter) => {
        return letter.x === snakeArr[0].x && letter.y === snakeArr[0].y;
      })) && lives < 1
  ) gameOver();

  // Checking if snake at any other letter and any lives are left
  else if (
    (letterPositions.length > 0 &&
      letterPositions.slice(1).some((letter) => {
        return letter.x === snakeArr[0].x && letter.y === snakeArr[0].y;
      })) && lives >0
  ) {
    gameResume();
  }


  // Check if the snake head position matches the next letter position in the word
  if (
    letterPositions1.length > 0 &&
    snakeArr1[0].y === letterPositions1[0].y &&
    snakeArr1[0].x === letterPositions1[0].x
  ) {

    // Remove the matched letter from the array
    foodSound.play();
    letterPositions1.shift();

    // Check if the snake has eaten the entire word
    if (letterPositions1.length === 0) {
      console.log("Fuck yes")
      score1 += 1;   // Updating the score
      timer += 5000;   // Updating the timer
      speed1 += 1;       // Increasing the speed of the snake
      gainBuffTimer = 0;  // Resetting the gainBuff timer


      clearInterval(myInterval);
      myInterval = setInterval(main, Math.ceil(1000 / speed1), Math.ceil(1000 / speed1))

      // Updating the high score
      if (score1 > hiscoreval1) {
        hiscoreval1 = score1;
        localStorage.setItem("hiscore1", JSON.stringify(hiscoreval1));
        hiScoreBox1.innerHTML = "High Score of Player 2 : " + hiscoreval1;
      }

      // Displaying the Timer and Score
      scoreBox1.innerHTML = "Score : " + score1;
      timerBox.innerHTML = "Timer : " + Math.ceil(timer / 1000);

      // Changing the direction of the snake
      snakeArr1.unshift({
        x: snakeArr1[0].x + inputDir1.x,
        y: snakeArr1[0].y + inputDir1.y,
      });

      wordSpreader1();
      generateGainBuffPosition();
      generateBomb();
      randomBuff = gainBuffArray[Math.floor(Math.random() * gainBuffArray.length)];
    }
  }
  // Checking if the snake ate any other letter in the word not following the order
  else if (
    (letterPositions1.length > 0 &&
      letterPositions1.slice(1).some((letter) => {
        return letter.x === snakeArr1[0].x && letter.y === snakeArr1[0].y;
      })) && lives1 < 1
  ) gameOver();

  // Checking if snake at any other letter and any lives are left
  else if (
    (letterPositions1.length > 0 &&
      letterPositions1.slice(1).some((letter) => {
        return letter.x === snakeArr1[0].x && letter.y === snakeArr1[0].y;
      })) && lives1 >0
  ) {
    gameResume1();
  }

      

  // Moving the snake and Bomb
  if (!paused && countBodyPause==1){
    for (let i = snakeArr.length - 2; i >= 0; i--) {
      snakeArr[i + 1] = { ...snakeArr[i] };
    }
  
    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    bombMover();
  }
  
  if (!paused && (countBodyPause===1 || countBodyPause1===1))
  {
    bombMover
  }

  // Moving the snake and Bomb
  if (!paused && countBodyPause1==1){
    for (let i = snakeArr1.length - 2; i >= 0; i--) {
      snakeArr1[i + 1] = { ...snakeArr1[i] };
    }

    snakeArr1[0].x += inputDir1.x;
    snakeArr1[0].y += inputDir1.y;

    if (!bombPause){
      bombMover();
    }

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
    else {
      snakeElement.classList.add('snake');
    }
    board.appendChild(snakeElement);
  })


  snakeArr1.forEach((e, index) => {
    snakeElement1 = document.createElement('div');
    snakeElement1.style.gridRowStart = e.y;
    snakeElement1.style.gridColumnStart = e.x;

    if (index === 0) {
      snakeElement1.classList.add('head1');
    }
    else {
      snakeElement1.classList.add('snake1');
    }
    board.appendChild(snakeElement1);

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
  if (snakeArr.length === 3 && countbuff === 0) {
    generateGainBuffPosition();
    countbuff++;
  }

  //Update the food element to display the letters for snake 2
  letterPositions1.forEach((letterPos1) => {
    const foodElement1 = document.createElement('div');
    foodElement1.style.gridRowStart = letterPos1.y;
    foodElement1.style.gridColumnStart = letterPos1.x;
    foodElement1.style.fontSize = `${Math.floor(60/gridSizeChoice)}vmin`;
    foodElement1.classList.add('food1');

    // Create a container element to center the letter
    const letterContainer1 = document.createElement('div');
    letterContainer1.classList.add('letter-container');

    // Set the text content of the letter container to the letter
    letterContainer1.textContent = letterPos1.letter;

    // Append the letter container to the food element
    foodElement1.appendChild(letterContainer1);

    // Append the food element to the board
    board.appendChild(foodElement1);
  });
  // if (snakeArr1.length === 3 && countbuff1 === 0) {
  //   generateGainBuffPosition();
  //   countbuff1++;
  // }


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
  if (gainBuffTimer >= 30 && !paused ) {
    generateGainBuffPosition();
    randomBuff = gainBuffArray[Math.floor(Math.random() * gainBuffArray.length)];
    gainBuffTimer = 0;
  }

  // Displaying the bomb
  if (bomb.x != 0 && bomb.y != 0 && !paused) {
    const bombElement = document.createElement('div');
    bombElement.style.gridRowStart = bomb.y;
    bombElement.style.gridColumnStart = bomb.x;
    bombElement.style.fontSize = `${50/gridSizeChoice}vmin`;

    const bombContainer = document.createElement('div');
    bombContainer.classList.add('bomb-container')
    bombContainer.textContent = "💣";
    bombElement.classList.add('bomb');
    bombElement.appendChild(bombContainer);
    board.appendChild(bombElement);
  }

  // Displaying the portals
  portalElementOpen = document.createElement('div');
  portalElementOpen.style.gridRowStart = portalOpen.y;
  portalElementOpen.style.gridColumnStart = portalOpen.x;
  portalElementOpen.style.fontSize = `${50/gridSizeChoice}vmin`;
  portalElementOpen.style.borderRadius = `${20/gridSizeChoice}vmin`;
  portalElementOpen.textContent = "🌀";
  portalElementOpen.classList.add('portal');

  portalElementClose = document.createElement('div');
  portalElementClose.style.gridRow = portalClose.y;
  portalElementClose.style.gridColumn = portalClose.x;
  portalElementClose.style.fontSize = `${50/gridSizeChoice}vmin`;
  portalElementClose.style.borderRadius = `${20/gridSizeChoice}vmin`;
  portalElementClose.textContent = "🌀";
  portalElementClose.classList.add('portal');

  board.appendChild(portalElementOpen);
  board.appendChild(portalElementClose);


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
    hiscoreBox.innerHTML = "High Score : " + hiscore;
  }
}

function addHiScore1(){
  // Adding highscore to local storage
  let hiscore1 = localStorage.getItem("hiscore1");
  if (hiscore1 === null) {
    hiscoreval1 = 0;
    localStorage.setItem("hiscore1", JSON.stringify(hiscoreval1))
  }
  else {
    hiscoreval1 = JSON.parse(hiscore1);
    hiscoreBox1.innerHTML = "High Score : " + hiscore1;
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
    if (!paused && modalVanish === 1) { // Check if the game is not paused
      switch (e.key) {
        case "ArrowUp":
          if ((snakeArr[0].y - snakeArr[1].y) != 1) { // Check if the current direction is not opposite
            gameLoop();
            moveSound.play();
            countBodyPause = 1;
            inputDir.x = 0;
            inputDir.y = -1;
          }
          break;

        case "ArrowDown":
          if ((snakeArr[1].y - snakeArr[0].y) != 1) { // Check if the current direction is not opposite
            gameLoop();
            moveSound.play();
            countBodyPause = 1;
            inputDir.x = 0;
            inputDir.y = 1;
          }
          break;

        case "ArrowLeft":
          if ((snakeArr[0].x - snakeArr[1].x) != 1) { // Check if the current direction is not opposite
            gameLoop();
            moveSound.play();
            countBodyPause = 1;
            inputDir.x = -1;
            inputDir.y = 0;
          }
          break;

        case "ArrowRight":
          if ((snakeArr[1].x - snakeArr[0].x) != 1) { // Check if the current direction is not opposite
            gameLoop();
            moveSound.play();
            countBodyPause = 1;
            inputDir.x = 1;
            inputDir.y = 0;
          }
          break;

        default:
          break;
      }
    }
  });
}


function senseKeyPress1(){
  
  // Response to keypress
  window.addEventListener('keydown', e => {
    
    if (!paused && modalVanish===1) { 
      // Check if the game is not paused
      switch (e.key) {
        case "w":
          if ((snakeArr1[0].y - snakeArr1[1].y) != 1) { // Check if the current direction is not opposite
            gameLoop();
            moveSound.play();
            countBodyPause1 = 1;
            inputDir1.x = 0;
            inputDir1.y = -1;
            break;
          }

        case "s":
          if ((snakeArr1[1].y - snakeArr1[0].y) != 1) { // Check if the current direction is not opposite
            gameLoop();
            moveSound.play();
            countBodyPause1 = 1;
            inputDir1.x = 0;
            inputDir1.y = 1;
            break;
          }

        case "a":
          if ((snakeArr1[0].x - snakeArr1[1].x) != 1) { // Check if the current direction is not opposite
            gameLoop();
            moveSound.play();
            countBodyPause1 = 1;
            inputDir1.x = -1;
            inputDir1.y = 0;
            break;
          }

        case "d":
          if ((snakeArr1[1].x - snakeArr1[0].x) != 1) { // Check if the current direction is not opposite
            gameLoop();
            moveSound.play();
            countBodyPause1 = 1;
            inputDir1.x = 1;
            inputDir1.y = 0;
            break;
          }
          
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

function onScreenButtons1(){

  const upButton1 = document.getElementById('button-w');
  const leftButton1 = document.getElementById('button-a');
  const rightButton1 = document.getElementById('button-d');
  const downButton1 = document.getElementById('button-s');

  // Add event listeners to the buttons
  upButton1.addEventListener('click', () => moveSnake1('up'));
  leftButton1.addEventListener('click', () => moveSnake1('left'));
  rightButton1.addEventListener('click', () => moveSnake1('right'));
  downButton1.addEventListener('click', () => moveSnake1('down'));

}

// Function to handle snake movement
function moveSnake(direction) {
  if (!paused) {
    inputDir = { x: 0, y: 0 };
    switch (direction) {
      case 'up':
        if ((snakeArr[0].y - snakeArr[1].y) != 1){
          gameLoop();
          moveSound.play();
          countBodyPause = 1;
          inputDir.x = 0;
          inputDir.y = -1;
          break;
        }
        
      case 'down':
        if ((snakeArr[1].y - snakeArr[0].y) != 1){
          gameLoop();
          moveSound.play();
          countBodyPause = 1;
          inputDir.x = 0;
          inputDir.y = 1;
          break;
        }
      case 'left':
        if ((snakeArr[0].x - snakeArr[1].x) != 1){
          gameLoop();
          moveSound.play();
          countBodyPause = 1;
          inputDir.x = -1;
          inputDir.y = 0;
          break;
        }
      case 'right':
        if ((snakeArr[1].x - snakeArr[0].x) != 1){
          gameLoop();
          moveSound.play();
          countBodyPause = 1;
          inputDir.x = 1;
          inputDir.y = 0;
          break;
        }
      default:

        break;
    }
  }
}

function moveSnake1(direction){
  if (!paused) {
    inputDir1 = { x: 0, y: 0 };
    switch (direction) {
      case 'up':
        if ((snakeArr1[0].y - snakeArr1[1].y) != 1){
          gameLoop();
          moveSound.play();
          countBodyPause1 = 1;
          inputDir1.x = 0;
          inputDir1.y = -1;
          break;
        }
      case 'down':
        if ((snakeArr1[1].y - snakeArr1[0].y) != 1){
          gameLoop();
          moveSound.play();
          countBodyPause1 = 1;
          inputDir1.x = 0;
          inputDir1.y = 1;
          break;
        }
      case 'left':
        if ((snakeArr1[0].x - snakeArr1[1].x) != 1){
          gameLoop();
          moveSound.play();
          countBodyPause1 = 1;
          inputDir1.x = -1;
          inputDir1.y = 0;
          break;
        }
      case 'right':
        if ((snakeArr1[1].x - snakeArr1[0].x) != 1){
          gameLoop();
          moveSound.play();
          countBodyPause1 = 1;
          inputDir1.x = 1;
          inputDir1.y = 0;
          break;
        }
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

  const saveButton = document.getElementById('saveGameButton');
  saveButton.addEventListener('click', () => saveGame())

  pauseButton.disabled = true;
  resumeButton.disabled = true;
  saveGameButton.disabled = true;
}

// Function to handle pause
function Pause() {
  lastInputDir = { ...inputDir };
  inputDir = { x: 0, y: 0 };
  lastInputDir1 = { ...inputDir1 };
  inputDir1 = { x: 0, y: 0 };
  paused = 1;
  pauseLoop();
  senseKeyPress();
  senseKeyPress1();

}

// Function to handle resume
function Resume() {
  if (lastInputDir.x !== 0 || lastInputDir.y !== 0) {
    inputDir = { ...lastInputDir };
  }
  if (lastInputDir1.x !== 0 || lastInputDir1.y !== 0) {
    inputDir1 = { ...lastInputDir1 };
  }
  paused = 0;
  pauseLoop();
  senseKeyPress();
  senseKeyPress1();

}

// Function  loop to handle pause and resume
function pauseLoop() {
  if (paused === 1) {
    resumeButton.disabled = false;
    pauseButton.disabled = true;
    saveGameButton.disabled = false;
    if (!saveGameCount){
      fixedTime = timer;
    }
    
    timer = NaN;
    clearInterval(myInterval);
    myInterval = setInterval(main, Math.ceil(1000 / speed), Math.ceil(1000 / speed));


  } else if (paused === 0) {
    resumeButton.disabled = true;
    pauseButton.disabled = false;
    saveGameButton.disabled = true;
    timer = fixedTime;
    clearInterval(myInterval);
    myInterval = setInterval(main, Math.ceil(1000 / speed), Math.ceil(1000 / speed));


  }
}

function restart(){
  gameOverTextVanish = 1;
  document.getElementById("modal").remove();
  gridSize();
}

function quit(){
  window.close();
}

// Save savegamecount separatl

function saveGame() {
  // Save game data to localStorage
  const gameData = {
    snakeArr: snakeArr,
    timer: timer,
    speed: speed,
    lastPaintTime: lastPaintTime,
    score: score,
    snakeArr1 : snakeArr1,
    speed1: score1,
    inputDir: inputDir,
    inputDir1: inputDir1,
    lives1: lives1,
    score1: score1,
    food: food,
    gainBuff: gainBuff,
    gainBuffTimer: gainBuffTimer,
    lives: lives,
    lastInputDir: lastInputDir,
    lastInputDir1: lastInputDir1,
    paused: paused,
    fixedTime: fixedTime,
    count: count,
    isPaused: isPaused,
    countbuff: countbuff,
    countbuff1: countbuff1,
    modalVanish: modalVanish,
    gridSizeChoice: gridSizeChoice,
    countRestart: countRestart,
    Dir: Dir,
    bomb: bomb,
    portalOpen: portalOpen,
    portalClose: portalClose,
    countBodyPause: countBodyPause,
    countBodyPause1: countBodyPause1,
    bombPause: bombPause,
    gameOverTextVanish: gameOverTextVanish,
    bombAte: bombAte,
    bombAte1:bombAte1,
    randomBuff: randomBuff,
    letterPositions: letterPositions,
    letterPositions1: letterPositions1,
    randomWord: randomWord,
    randomWord1: randomWord1
    
  };
  localStorage.setItem('gameData', JSON.stringify(gameData));

  saveGameCount = 1; // Update saveGameCount to indicate game is saved
  localStorage.setItem('saveGameCount', JSON.stringify(saveGameCount));
  
  alert('Game Saved');

  // Close the window
  window.close();
}

function loadGame() {
  const savedGameData = localStorage.getItem('gameData');
  if (savedGameData) {
    const gameData = JSON.parse(savedGameData);

    // Load the saved game data into the game variables
    snakeArr = gameData.snakeArr;
    timer = gameData.timer;
    speed = gameData.speed;
    lastPaintTime = gameData.lastPaintTime;
    score = gameData.score;
    snakeArr1 = gameData.snakeArr1;
    speed1 = gameData.speed1;
    inputDir = gameData.inputDir;
    inputDir1 = gameData.inputDir1;
    lives1 = gameData.lives1;
    score1 = gameData.score1;
    food = gameData.food;
    gainBuff = gameData.gainBuff;
    gainBuffTimer = gameData.gainBuffTimer;
    lives = gameData.lives;
    lastInputDir = gameData.lastInputDir;
    lastInputDir1 = gameData.lastInputDir1;
    paused = gameData.paused;
    fixedTime = gameData.fixedTime;
    count = gameData.count;
    isPaused = gameData.isPaused;
    countbuff = gameData.countbuff;
    countbuff1 = gameData.countbuff1;
    modalVanish = gameData.modalVanish;
    gridSizeChoice = gameData.gridSizeChoice;
    countRestart = gameData.countRestart;
    Dir = gameData.Dir;
    bomb = gameData.bomb;
    portalOpen = gameData.portalOpen;
    portalClose = gameData.portalClose;
    countBodyPause = gameData.countBodyPause;
    countBodyPause1 = gameData.countBodyPause1;
    bombPause = gameData.bombPause;
    gameOverTextVanish = gameData.gameOverTextVanish;
    bombAte = gameData.bombAte;
    bombAte1 = gameData.bombAte1;
    randomBuff = gameData.randomBuff;
    letterPositions = gameData.letterPositions;
    letterPositions1 = gameData.letterPositions1;
    randomWord = gameData.randomWord;
    randomWord1 = gameData.randomWord1;
  }

  life.innerHTML = "Lives Left : " + lives;
  life1.innerHTML = "Lives Left : " + lives1;
  scoreBox.innerHTML = "Score : " + score;
  scoreBox1.innerHTML = "Score : " + score1;
  word.innerHTML = "The Word :<br>" + randomWord;
  word1.innerHTML = "The Word :<br>" + randomWord1;

}


// Main logic starts here


let savedGameCount = localStorage.getItem("saveGameCount");
if(savedGameCount){
  saveGameCount = JSON.parse(savedGameCount);
}

if (performance.navigation.type === 1) {
  saveGameCount = 0; // Update saveGameCount to indicate game is saved
  localStorage.setItem('saveGameCount', JSON.stringify(saveGameCount));
}


if (saveGameCount === 1){
  musicSound.play();
  loadGame();
  pauseResumeButtons();
  pauseLoop();
  gridChoice(gridSizeChoice);
  addHiScore();
  addHiScore1();
  onScreenButtons();
  onScreenButtons1();
  
}

else{
  musicSound.play();
  initalValVariables();
  gridSize();
  addHiScore();
  addHiScore1();
  onScreenButtons();
  onScreenButtons1();
  pauseResumeButtons();
}



