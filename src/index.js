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
//GET REQUEST
fetch(userUrl)
.then(response=>response.json())
.then(data=>saveUsersLocally(data))

const contentContainer = document.getElementById("content-container");

const landingContainer = document.getElementById("landing-container");
const gameplayContainer = document.getElementById('gameplay-container');

const timerContainer = document.getElementById('timer-container');
const questionContainer = document.getElementById('question-container');
const answerContainer = document.getElementById('answer-container');
const correctAnswerCounterContainer = document.getElementById("correct-answer-counter-container")
const heartContainer = document.getElementById('heart-container');
const postGameContainer = document.getElementById("post-game-option-container");

const loginField = document.getElementById("login-field")
const loginSubmit = document.getElementById("login-submit-button")
const homeScoreboardButton = document.getElementById("home-scoreboard-button");


loginSubmit.addEventListener("click", gameSetup)
loginField.addEventListener("keypress", function(e){
  if (e.which === 13){
    e.preventDefault()
    loginSubmit.click();
  }
})
homeScoreboardButton.addEventListener("click", displayScoreboard)


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

function gameSetup(){
  let playerName = loginField.value;
  let user = findOrCreateUser(playerName);
  gameActive = true;

  landingContainer.style.display = 'block';
  landingContainer.style.display = 'none';

  timerContainer.innerHTML=""
  questionContainer.innerHTML=""
  answerContainer.innerHTML=""
  heartContainer.innerHTML=""
  postGameContainer.innerHTML=""

  //create timer HTML and countdown
  let timerDisplay = document.createElement("h4");
  timerDisplay.style.textAlign = "center";
  timerDisplay.id = "timer-display";
  countdown(timerDisplay, playerName, user);
  timerContainer.append(timerDisplay);

  //hearts
  let hearts = document.createElement("h1");
  hearts.style.textAlign = "center";
  hearts.style.color = "white";
  hearts.id = "heartDisplay"
  let heartsCounter = 3;
  hearts.innerHTML = `<i id="heart-1" class="fas fa-heart hearts"></i><i id="heart-2" class="fas fa-heart hearts"></i><i id="heart-3" class="fas fa-heart hearts"></i>`
  heartContainer.append(hearts)

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
  answerInputField.className = "more-buttons answer-form-elements"
  answerSubmitButton.className = "more-buttons answer-form-elements"
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
  handleQuestionsAndAnswers(question, hearts, heartsCounter, answerForm, correctAnswerCounterDisplay, timerDisplay, playerName, user)
}
function mathQuiz() {
  //determintes question type (+, -, *, /)
  questionType = Math.floor((Math.random() * 4) + 1)
  //addition
  if (questionType === 1){
    number1 = Math.floor((Math.random() * 100) + 1)
    number2 = Math.floor((Math.random() * 100) + 1)
    answer = number1 + number2
    return (`${number1} + ${number2}`);
  }
  //subtraction
  else if (questionType === 2) {
    number1 = Math.floor((Math.random() * 100) + 1)
    number2 = Math.floor((Math.random() * 100) + 1)
    answer = number1 - number2
    return(`${number1} - ${number2}`);
  }
  //multiplication
  else if (questionType === 3) {
    number1 = Math.floor((Math.random() * 15) + 1)
    number2 = Math.floor((Math.random() * 15) + 1)
    answer = number1 * number2
    return(`${number1} * ${number2}`);
  }
  //division
  else if (questionType === 4) {
    number1 = Math.floor((Math.random() * 20) + 1)
    number2 = Math.floor((Math.random() * 20) + 1)
    // number1 = number1*number2
    answer = number1 % number2
    return (`${number1} % ${number2}`);
  }
}
function countdown(timer, playerName, user){
  let timeRemaining = 30;
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
      gameOver(playerName, user)
      clearInterval(gameCountdown);
    }
  }, 1000)
}
function handleQuestionsAndAnswers(question, hearts, heartsCounter, answerForm, correctAnswerCounterDisplay, timerDisplay, playerName, user){
  let currentQuestion = mathQuiz();
  let userAnswer; //declaring now. Will assign value later.
  question.innerText = currentQuestion;
  answerForm.addEventListener("click", function moreQuestions(e){
    e.preventDefault();
    if (e.target.id === "submit-answer-button"){
      let userAnswer = parseInt(e.target.parentElement.getElementsByTagName("INPUT")[0].value)

      if (userAnswer == answer){
        activeScore++;
        document.getElementById("answer-input").value = '';
        correctAnswerCounterDisplay.innerText = `Number of correct answers: ${activeScore}`
        answerForm.removeEventListener("click", moreQuestions)
        handleQuestionsAndAnswers(question, hearts, heartsCounter, answerForm, correctAnswerCounterDisplay, timerDisplay, playerName, user)
      }
      else {
        heartsCounter--;
        hearts.children[heartsCounter].style.display = 'none';
        document.getElementById("answer-input").value=""
        if (heartsCounter == 0){
          document.getElementById("timer-display").innerText = `No more lives!`
          answerForm.removeEventListener("click", moreQuestions)
          gameOver(playerName, user);
        }
      }
    }
  })
}
function disableGameplay(){
  document.getElementById("answer-input").disabled = true;
  document.getElementById("answer-input").style.color = "gray";
  document.getElementById("submit-answer-button").disabled = true;
  document.getElementById("submit-answer-button").style.color = "gray";
}
function gameOver(playerName, user){
  gameActive = false;
  disableGameplay();
  let newGame = user.createGame(activeScore);
  postGameOptions()
}
function postGameOptions(){
  let replayButton = document.createElement("button");
  let scoreboardButton = document.createElement("button");
  replayButton.innerText = "Replay"
  scoreboardButton.innerText = "Leaderboard"
  replayButton.id = "post-game-replay-button"
  scoreboardButton.id = "post-game-scoreboard-button"
  replayButton.className = "more-buttons post-game-buttons"
  scoreboardButton.className = "more-buttons post-game-buttons"
  postGameContainer.append(replayButton);
  postGameContainer.append(scoreboardButton);

  postGameContainer.addEventListener("click", function(e){
    e.preventDefault();
    if (e.target.id === "post-game-replay-button"){
      location.reload();
    }
    else if (e.target.id === "post-game-scoreboard-button"){
      displayScoreboard()
    }
})
}

function displayScoreboard(){

  landingContainer.style.display = 'block';
  landingContainer.style.display = 'none';

  gameplayContainer.style.display = 'none';
  let leaderboardContainer = document.createElement("div");
  leaderboardContainer.id = "leaderboard-container"
  let leaderboardHeadline = document.createElement("h1");
  leaderboardHeadline.id = "leaderboard-headline"
  leaderboardHeadline.innerText = "Leaderboard"
  contentContainer.append(leaderboardContainer);
  leaderboardContainer.append(leaderboardHeadline);

  let leaderboardListContainer = document.createElement("div");
  leaderboardListContainer.id = "leaderboard-list-container"
  leaderboardContainer.append(leaderboardListContainer);

  let leaderboardOl = document.createElement("ol");
  leaderboardListContainer.append(leaderboardOl);

  let sortedScores = store["game"].slice().sort( (a,b) => b.score - a.score )

  sortedScores.forEach(function(individualGame){
      let leaderboardItem = document.createElement("li");
      let leaderboardUser = User.findUserById(individualGame.userId)
      leaderboardItem.append(`${individualGame.score} points - ${leaderboardUser.name}`)
      leaderboardOl.append(leaderboardItem);
  })

  let homepageButton = document.createElement("button");
  homepageButton.id = "homepage-button"
  homepageButton.className = "more-buttons button-login"
  homepageButton.innerText = "Home"
  leaderboardListContainer.append(homepageButton)

  homepageButton.addEventListener("click", function(){
    location.reload();
  })

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
