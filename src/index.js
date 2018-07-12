//local storage
let store = {user: [], game: []}

//URLs
const userUrl = "http://localhost:3000/api/v1/users"
const gameUrl = "http://localhost:3000/api/v1/games"

//manages current score during game
let activeScore = 0;

//checks if game a game is in progress
let gameActive = false;

//fetch data and pass to local saves
fetch(userUrl)
.then(response=>response.json())
.then(data=>saveUsersLocally(data))

const timerContainer = document.getElementById('timer-container');
const questionAnswerContainer = document.getElementById("question-answer-container")
const questionContainer = document.getElementById('question-container');
const answerContainer = document.getElementById('answer-container');
const correctAnswerContainer = document.getElementById('correct-answer-container');
const strikeContainer = document.getElementById('strike-container');
const gameplayContainer = document.getElementById('gameplay-container');
const postGameContainer = document.getElementById("post-game-option-container")
const contentContainer = document.getElementById("content-container");
const getStartedButton = document.getElementById("get-started-button");
const landingContainer = document.getElementById("landing-container");
const loginSubmit = document.getElementById("login-submit-button")
const correctAnswerCounterContainer = document.getElementById("correct-answer-counter-container")
const loginField = document.getElementById("login-field")
const homeViewScoreboard = document.getElementById("home-view-scoreboard")

function saveUsersLocally(data){
  data.forEach(function(individualUser){
    let currentUser = new User(individualUser)
    store["user"].push(currentUser)
    saveGamesLocally(individualUser.games)
  })
}

function saveGamesLocally(games){
  return games.forEach(function(individualGame){
    let currentGame = new Game(individualGame)
    store["game"].push(currentGame)
 })
}

loginSubmit.addEventListener("click", gameSetup)

function gameSetup(){
  let playerName = loginField.value;
  gameActive = true;

  landingContainer.style.display = 'block';
  landingContainer.style.display = 'none';

  questionContainer.innerHTML=""
  timerContainer.innerHTML=""
  answerContainer.innerHTML=""
  strikeContainer.innerHTML=""
  postGameContainer.innerHTML=""

  //create timer HTML and countdown
  let timerDisplay = document.createElement("h4");
  timerDisplay.style.textAlign = "center";
  timerDisplay.id = "timer-display";
  countdown(timerDisplay, playerName);
  timerContainer.append(timerDisplay);

  //strikes
  let strikesCounter = 3; //adjust this to increase/decrease number of starting lives
  let startingStrike = strikesCounter
  let heart = `<i class="fas fa-heart hearts"></i>`;
  let strikes = document.createElement("h1");
  strikes.style.textAlign = "center";
  strikes.style.color = "white";
  strikes.innerHTML = `<i id="heart-1" class="fas fa-heart hearts"></i><i id="heart-2" class="fas fa-heart hearts"></i><i id="heart-3" class="fas fa-heart hearts"></i>`
  strikeContainer.append(strikes)

  //Generate answer form
  let answerForm = document.createElement("form")
  let answerInputField = document.createElement("input")
  let answerSubmitButton = document.createElement("button")
  answerForm.style.textAlign = "center";
  answerSubmitButton.innerText = "Submit"
  answerForm.id = "answer-form"
  answerInputField.id = "answer-input"
  answerSubmitButton.id = "submit-answer-button"
  answerForm.className = "answer-form-elements"
  answerInputField.className = "answer-form-elements"
  answerSubmitButton.className = "answer-form-elements"
  answerForm.append(answerInputField);
  answerForm.append(answerSubmitButton);
  answerContainer.append(answerForm);

  let correctAnswerCounterDisplay = document.createElement("h2")
  correctAnswerCounterContainer.append(correctAnswerCounterDisplay)

  //create question HTML and display question:
  let question = document.createElement("h2");
  question.style.textAlign = "center";
  question.id = "question-text"
  questionContainer.append(question);
  handleQuestionsAndAnswers(question, strikes, strikesCounter, startingStrike, answerForm, correctAnswerCounterDisplay, timerDisplay, playerName)
}

function countdown(timer, playerName){
  let timeRemaining = 10;
  let gameCountdown = setInterval(function(){
    timeRemaining--;
    if (timeRemaining != 0 && gameActive == true) {
      timer.innerText = timeRemaining
    }

    else if (gameActive == false){
      return;
    }

    else {
      timer.innerText = "Game Over!"
      gameOver(playerName)
      clearInterval(gameCountdown);
    }
  }, 1000)
}

function handleQuestionsAndAnswers(question, strikes, strikesCounter, startingStrike, answerForm, correctAnswerCounterDisplay, timerDisplay, playerName){
  let currentQuestion = mathQuiz();
  let userAnswer; //declaring now. Will assign value later.
  question.innerText = currentQuestion;

  for (let i = 0; i < strikesCounter; i++){
    strikes += `<i id="class="fas fa-heart hearts"></i>`
  }

  answerForm.addEventListener("click", function (e){
    e.preventDefault();
    if (e.target.id === "submit-answer-button"){
      let userAnswer = parseInt(e.target.parentElement.getElementsByTagName("INPUT")[0].value)
      if (userAnswer == answer){
        activeScore++;
        document.getElementById("answer-input").value = '';
        correctAnswerCounterDisplay.innerText = `Number of correct answers: ${activeScore}`
        handleQuestionsAndAnswers(question, strikes, strikesCounter, startingStrike, answerForm, correctAnswerCounterDisplay)
      }
      else {
        strikesCounter--;
        //strikes.innerHTML -= `<i class="fas fa-heart hearts"></i>`;
        //currentQuestion = mathQuiz();
        // question.innerText = currentQuestion;
        //this refreshes question if incorrect
        document.getElementById("answer-input").value=""
        if (strikesCounter == 0){
          document.getElementById("timer-display").innerText = `Too many strikes!`
          gameOver(playerName);
        }
      }
    }
  })
}

function gameOver(playerName){
  gameActive = false;
  disableGameplay();
  let user = findOrCreateUser(playerName);
  let newGame = user.createGame(activeScore);
}

function disableGameplay(){
  document.getElementById("answer-input").disabled = true;
  document.getElementById("answer-input").style.color = "gray";
  document.getElementById("submit-answer-button").disabled = true;
  document.getElementById("submit-answer-button").style.color = "gray";
}

function mathQuiz() {
  //determintes question type (+, -, *, /)
  questionType = Math.floor((Math.random() * 4) + 1)
  //addition
  if (questionType === 1){
    number1 = Math.floor((Math.random() * 10) + 1)
    number2 = Math.floor((Math.random() * 10) + 1)
    answer = number1 + number2
    return (`${number1} + ${number2}`);
  }
  //subtraction
  else if (questionType === 2) {
    number1 = Math.floor((Math.random() * 10) + 1)
    number2 = Math.floor((Math.random() * 10) + 1)
    answer = number1 - number2
    return(`${number1} - ${number2}`);
  }
  //multiplication
  else if (questionType === 3) {
    number1 = Math.floor((Math.random() * 5) + 1)
    number2 = Math.floor((Math.random() * 5) + 1)
    answer = number1 * number2
    return(`${number1} * ${number2}`);
  }
  //division
  else if (questionType === 4) {
    number1 = Math.floor((Math.random() * 2) + 1)
    number2 = Math.floor((Math.random() * 1) + 1)
    number1 = number1*number2
    answer = number1/number2
    return (`${number1} / ${number2}`);
  }
}


function findUser(playerName){
  return store["user"].find( (individualUser) => {
    return playerName === individualUser.name
  })
}

function createUser(playerName){
  let newUser = new User ({"name": playerName})
  store["user"].push(newUser);
  newUser.addUserBackend();
  return newUser;
}

function findOrCreateUser(playerName){
  if (findUser(playerName)){
    return findUser(playerName)
  }
  else {
    return createUser(playerName)
  }
}
