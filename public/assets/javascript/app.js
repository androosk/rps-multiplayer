var gameDatabase = firebase.database()
var playerOne = null
var playerTwo = null
var pOne = "waiting for player 1"
var pTwo = "waiting for player 2"
var yourName = ""
var playa = ""
var localPlayer = ""
var otherPlayer = ""
var player1 = ""
var player2 = ""
var newVar = null
var playerName = ""
var currentMessage = ""
var messenger = ""
var player = ""
var gamePlayTrue = null
var buttonName = ""
var playerOneMove = ""
var playerTwoMove = ""

$("#game-start-button").toggle()
$("#chat-dialog").toggle()
renderStart()
// Check if player one and player two already exist, hide game
var ref = firebase.database().ref("/players/")
ref.once("value")
  .then(function(snapshot) {
    var a = snapshot.child("playerOne").exists()
    var b = snapshot.child("playerTwo").exists()
    if (a === true && b === true & localPlayer === "") {
      gameAlreadyInPlay()
    }
    else if (a === false && b === true) {
      newVar = snapshot.val()
      $("#playertwo-idbox").text("Player 2: " + newVar.playerTwo.name)
      playerStats()
    }
  })
gameDatabase.ref("inPlay/").on("value", function(snapshot) {
  var refErence = $("#game-button-text").attr("state")
  if (snapshot.child("yesInPlay").val() === "true") {
    gamePlayYeah()
  }
  else if (refErence === "play") {
    $("#game-button-text").attr("state", "")
    cleanUpOnAisle6()
  }
})

//Listen for change in the player object in firebase
gameDatabase.ref("/players/").on("value", function(snapshot) {
  newVar = snapshot.val()
  if (snapshot.child("playerOne").exists() && player1 === "") {
    player1 = "exists"
    $("#playerone-idbox").text("Player 1: " + newVar.playerOne.name)
  }
  else if (snapshot.child("playerTwo").exists() && player2 === "") {
    player2 = "exists"
    $("#playertwo-idbox").text("Player 2: " + newVar.playerTwo.name)
  }
  else if (snapshot.child("playerOne").exists() && snapshot.child("playerTwo").exists() && newVar.playerOne.move != "" && newVar.playerTwo.move != "") {
    evaluateMove()
  }
})
//Listen for player one chat and add to chat box
gameDatabase.ref("chats/chatOne/").on("child_added", function(snapshot){
  var message = snapshot.val()
  var chatLine = $("<div class='chat-text'>").html(message)
  $("#chat-area").append(chatLine)
  $("#chat-area").scrollTop($("#chat-area")[0].scrollHeight)
})
//Listen for player two chat and add to chat box
gameDatabase.ref("chats/chatTwo/").on("child_added", function(snapshot){
  var message = snapshot.val()
  var chatLine = $("<div class='chat-text'>").html(message)
  $("#chat-area").append(chatLine)
  $("#chat-area").scrollTop($("#chat-area")[0].scrollHeight)
})
//Listen for when a player closes or refreshes their browser, and reset their session
gameDatabase.ref("/players/").on("child_removed", function(snapshot) {
  if (snapshot.val().playerNum === "one") {
    var chatMess = snapshot.val().name + " has left the game"
    var chatKey = gameDatabase.ref().child("/chats/chatTwo/").push().key
    gameDatabase.ref("/chats/chatTwo/" + chatKey).set(chatMess)
    player1 = ""
    $("#playerone-idbox").text("Player 1: waiting for player 1")
    gameDatabase.ref().child("/inPlay/yesInPlay").set("false")
  }
  else {
    var chatMess = snapshot.val().name + " has left the game"
    var chatKey = gameDatabase.ref().child("/chats/chatOne/").push().key
    gameDatabase.ref("/chats/chatOne/" + chatKey).set(chatMess)
    player2 = ""
    $("#playertwo-idbox").text("Player 2: waiting for player 2")
    gameDatabase.ref().child("/inPlay/yesInPlay").set("false")
  }
})
//Listen for changes in player stats
gameDatabase.ref("/players/").on("value", function(snapshot) {
  newVar = snapshot.val()
  playerStats()
})
// gameDatabase.ref("/inPlay/")
// Listen for player name to be entered
$("#player-name").on("keypress", (event) => {
  if (event.which === 13) {
    playa = $("#player-name").val().trim()
    $("#player-name").val("")
    checkPlayer()
  }
})
//Listen for player chat and add to chat box
$("#chat-message").on("keypress", (event) => {
  if (event.which === 13) {
    var message = $("#chat-message").val().trim()
    $("#chat-message").val("")
    currentMessage = message
    messenger = $("#chat-message").attr("data")
    player = $("#chat-message").attr("number")
    addToChat()
  }
})
$("#game-start-button").click(function () {
  if (player1 === "exists" && player2 === "exists") {
  gamePlayTrue = {
    yesInPlay : "true"
  }
  gameDatabase.ref().child("inPlay/").set(gamePlayTrue)
  }
  else {
    alert("You're waiting for another player to join")
  }
})
// function moveListen() {
$("#game-block1, #game-block2, #game-block3").on("click", function(){
  event.preventDefault()
  buttonName = $(this).attr("data-name")
  if (buttonName != undefined) {
    var localMover = "players/" + localPlayer + "/move"
    gameDatabase.ref().child(localMover).set(buttonName)
  }
  if (localPlayer === "playerOne"  && newVar.playerOne.move != "" && newVar.playerTwo.move === "") {
    $("#game-button-text").text("WAITING FOR YOUR OPPONENT")
  }
  if (localPlayer === "playerTwo"  && newVar.playerTwo.move != "" && newVar.playerOne.move === "") {
    $("#game-button-text").text("WAITING FOR YOUR OPPONENT")
  }
})

function addToChat() {
  var chatMess = (messenger + " said " + currentMessage)
  if (player === "one") {
    var chatKey = gameDatabase.ref().child("/chats/chatOne/").push().key
    gameDatabase.ref("/chats/chatOne/" + chatKey).set(chatMess)
  }
  else {
    var chatKey = gameDatabase.ref().child("/chats/chatTwo/").push().key
    gameDatabase.ref("/chats/chatTwo/" + chatKey).set(chatMess)
  }
}

function checkPlayer() {
  if (playa !== "" && player1 === "") {
      localPlayer = playa
      playerOne = {
        name : localPlayer,
        wins : 0,
        losses : 0,
        ties : 0,
        move : "",
        playerNum : "one",
      }
      gameDatabase.ref().child("players/playerOne").set(playerOne)
      gameDatabase.ref("/players/playerOne").onDisconnect().remove()
      playerName = newVar.playerOne.name
      var chatMess = playerName + " has joined the game"
      var chatKey = gameDatabase.ref().child("/chats/chatOne/").push().key
      gameDatabase.ref("/chats/chatOne/" + chatKey).set(chatMess)
      gameDatabase.ref("/chats/chatOne/").onDisconnect().remove()
      $("#chat-message").attr("data", playerName)
      $("#chat-message").attr("number", "one")
      $("#player-div").toggle()
      $("#name-here").prepend(playerName)
      $("#game-start-button").toggle()
      localPlayer = "playerOne"
      otherPlayer = "playerTwo"
      playerName = ""
      goGameScreen()
      playerStats()
  }
  else if (localPlayer === "" && player1 === "exists" && player2 === "") {
      localPlayer = playa
      playerTwo = {
        name : localPlayer,
        wins : 0,
        losses : 0,
        ties : 0,
        move : "",
        playerNum : "two",
      }
    gameDatabase.ref().child("players/playerTwo").set(playerTwo)
    gameDatabase.ref("/players/playerTwo").onDisconnect().remove()
    playerName = newVar.playerTwo.name
    var chatMess = playerName + " has joined the game"
    var chatKey = gameDatabase.ref().child("/chats/chatTwo/").push().key
    gameDatabase.ref("/chats/chatTwo/" + chatKey).set(chatMess);
    gameDatabase.ref("/chats/chatTwo/").onDisconnect().remove()
    $("#chat-message").attr("data", playerName)
    $("#chat-message").attr("number", "two")
    $("#player-div").toggle()
    $("#name-here").prepend(playerName)
    $("#game-start-button").toggle()
    localPlayer = "playerTwo"
    otherPlayer = "playerOne"
    playerName = ""
    goGameScreen()
  }
}
function goGameScreen () {
  $("#player-div").hide()
  $("#chat-dialog").toggle()
  // playerStats()
}
function renderStart () {
  $("#playerone-idbox").text("Player 1: " + pOne)
  $("#playertwo-idbox").text("Player 2: " + pTwo)
}
function playerStats() {
  if (player1 === "" && player2 === "exists") {
    var statName = "Name: Waiting"
    var statWins = "Wins: 0"
    var statLosses = "Losses: 0"
    var statTies = "Ties: 0"
    $("#playa1-name").text(statName)
    $("#playa1-wins").text(statWins)
    $("#playa1-losses").text(statLosses)
    $("#playa1-ties").text(statTies)
    // var statName = "Name: " + newVar.playerTwo.name
    // var statWins = "Wins: " + newVar.playerTwo.wins
    // var statLosses = "Losses: " + newVar.playerTwo.losses
    // var statTies = "Ties: " + newVar.playerTwo.ties
    // $("#playa2-name").text(statName)
    // $("#playa2-wins").text(statWins)
    // $("#playa2-losses").text(statLosses)
    // $("#playa2-ties").text(statTies)
  }
  else if (player1 === "exists" && player2 === "exists") {
    var statName = "Name: " + newVar.playerOne.name
    var statWins = "Wins: " + newVar.playerOne.wins
    var statLosses = "Losses: " + newVar.playerOne.losses
    var statTies = "Ties: " + newVar.playerOne.ties
    $("#playa1-name").text(statName)
    $("#playa1-wins").text(statWins)
    $("#playa1-losses").text(statLosses)
    $("#playa1-ties").text(statTies)
    var statName = "Name: " + newVar.playerTwo.name
    var statWins = "Wins: " + newVar.playerTwo.wins
    var statLosses = "Losses: " + newVar.playerTwo.losses
    var statTies = "Ties: " + newVar.playerTwo.ties
    $("#playa2-name").text(statName)
    $("#playa2-wins").text(statWins)
    $("#playa2-losses").text(statLosses)
    $("#playa2-ties").text(statTies)
  }
}
function gameAlreadyInPlay() {
  $("#main-body").hide()
  $("#heading").append("<h1>Game In Play Come Back Later</h1>")
}
function gamePlayYeah() {
  fadeRock()
  setTimeout(fadePaper, 1000)
  setTimeout(fadeScissors, 2000)
  setTimeout(shoot, 3000)
}

function fadeRock() {
  $("#game-block1").fadeTo(500, 0.5)
  $("#game-block1").fadeTo(500, 1.0)
  $("#game-button-text").attr("style", "color: red; font-weight: bolder;")
  $("#game-button-text").text("ROCK")
  $("#game-button-text").attr("state", "play")
}

function fadePaper() {
  var refErence = $("#game-button-text").attr("state")
  if (refErence === "play") {
    $("#game-block2").fadeTo(500, 0.5)
    $("#game-block2").fadeTo(500, 1.0)
    $("#game-button-text").text("PAPER")
  }
}
function fadeScissors() {
  var refErence = $("#game-button-text").attr("state")
  if (refErence === "play") {
    $("#game-block3").fadeTo(500, 0.5)
    $("#game-block3").fadeTo(500, 1.0)
    $("#game-button-text").text("SCISSORS")
  }
}
function shoot () {
  var refErence = $("#game-button-text").attr("state")
  if (refErence === "play") {
    $("#game-button-text").text("SHOOT!")
    $("#game-block1").attr("data-name", "rock")
    $("#game-block2").attr("data-name", "paper")
    $("#game-block3").attr("data-name", "scissors")
  }
}
// function resetState() {
//   $("#game-button-text").attr("style", "color: white; font-weight: normal;")
//   $("#game-button-text").text("CLICK HERE TO START")
// }
function evaluateMove() {
  playerOneMove = newVar.playerOne.move
  playerTwoMove = newVar.playerTwo.move
  gameDatabase.ref().child("players/playerOne/move").set("")
  gameDatabase.ref().child("players/playerTwo/move").set("")

  if (playerOneMove === "rock" && playerTwoMove === "paper") {
    playerTwoWins()
  }
  else if (playerOneMove === "rock" && playerTwoMove === "scissors") {
    playerOneWins()
  }
  else if (playerOneMove === "paper" && playerTwoMove === "rock") {
    playerOneWins()
  }
  else if (playerOneMove === "paper" && playerTwoMove === "scissors") {
    playerTwoWins()
  }
  else if (playerOneMove === "scissors" && playerTwoMove === "paper") {
    playerOneWins()
  }
  else if (playerOneMove === "scissors" && playerTwoMove === "rock") {
    playerTwoWins()
  }
  else if (playerOneMove === playerTwoMove) {
    var ties1 = newVar.playerOne.ties + 1
    var ties2 = newVar.playerTwo.ties + 1
    gameDatabase.ref().child("players/playerOne/ties").set(ties1)
    gameDatabase.ref().child("players/playerTwo/ties").set(ties2)
    $("#game-button-text").text("This round has ended in a tie")
    setTimeout(cleanUpOnAisle6, 3000)
  }
}

function playerOneWins(){
  var winName = newVar.playerOne.name
  var loser = newVar.playerOne.wins +1
  var winner = newVar.playerTwo.losses +1
  gameDatabase.ref().child("players/playerOne/wins").set(winner)
  gameDatabase.ref().child("players/playerTwo/losses").set(loser)
  $("#game-button-text").text(winName + " has won this round!")
  setTimeout(cleanUpOnAisle6, 3000)
}
function playerTwoWins(){
  var winName = newVar.playerTwo.name
  var loser = newVar.playerOne.losses +1
  var winner = newVar.playerTwo.wins +1
  gameDatabase.ref().child("players/playerOne/losses").set(loser)
  gameDatabase.ref().child("players/playerTwo/wins").set(winner)
  $("#game-button-text").text(winName + " has won this round!")
  setTimeout(cleanUpOnAisle6, 3000)
}
function cleanUpOnAisle6(){
  gameDatabase.ref().child("inPlay/yesInPlay").set("false")
  buttonName = ""
  $("#game-block1").removeAttr("data-name")
  $("#game-block2").removeAttr("data-name")
  $("#game-block3").removeAttr("data-name")
  $("#game-button-text").attr("style", "color: white; font-weight: normal;")
  $("#game-button-text").text("CLICK HERE TO PLAY AGAIN")
}
