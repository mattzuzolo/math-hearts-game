let localGameId = 0;

class Game {
  constructor(obj){
    this.localGameId = ++localGameId;
    this.score = obj.score;
    this.userId = obj.user_id;
  }

  addGameBackend(){
    let submissionBody = {
      "user_id": this.userId,
      "score": this.score
    }
    function addGame(gameUrl,submissionBody) {
       const postConfig = {
         Accept: "application/json",
         method: "POST",
         headers: {
           "Content-type": "application/json"
         },
         body: JSON.stringify(submissionBody)
       };
       return fetch(gameUrl, postConfig)
     }
     addGame(gameUrl,submissionBody)
  }
}
