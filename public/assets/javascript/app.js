var gameDatabase = firebase.database()
var playerObj = null
var playa = ""
var localPlayer = ""
var otherPlayer = ""
var player1 = ""
var player2 = ""
var newVar = null
var currentMessage = ""
var messenger = ""
var player = ""
var gamePlayTrue = null
var buttonName = ""
var playerOneMove = ""
var playerTwoMove = ""
var statName = ""
var statLosses = ""
var statWins = ""
var statTies = ""
var x = ""
var y = ""
var z = ""
var localNode = ""
var currentBlock = ["ROCK", "PAPER", "SCISSORS"]
var block = ""
var k = 0
var count = -1
var myBlock = ""
//Load preplay game board values
renderStart()

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
function loadPlayer() {
    playerObj = {
      name : playa,
      wins : 0,
      losses : 0,
      ties : 0,
      move : "",
      playerNum : playerNumber,
    }
  x = "player" + playerNumber
  y = "player" + playerNumOpp
  z = "chat" + playerNumber
  playerStart()
  }
function playerStart() {
  gameDatabase.ref().child("/players/" + x).set(playerObj)
  gameDatabase.ref("/players/" + x).onDisconnect().remove()
  var chatMess = playa + " has joined the game"
  var chatKey = gameDatabase.ref().child("/chats/" + z + "/").push().key
  gameDatabase.ref("/chats/" + z + "/" + chatKey).set(chatMess)
  gameDatabase.ref("/chats/" + z + "/").onDisconnect().remove()
  $("#chat-message").attr("data", playa)
  $("#chat-message").attr("number", "one")
  $("#name-here").prepend(playa)
  $("#name-here").removeAttr("hidden")
  localPlayer = x
  otherPlayer = y
  $("#game-button-text").removeAttr("hidden")
  $("#player-name-input").attr("hidden", "true")
  if (player1 === "" || player2 === "") {
    $("#game-button-text").text("WAITING FOR ANOTHER PLAYER")
  }
  playerStats()
}
function playerStats() {
  if (player1 === "") {
    statName = "Waiting"
    statWins = "Wins: 0"
    statLosses = "Losses: 0"
    statTies = "Ties: 0"
    fillOne()
  }
  else {
    statName = newVar.playerOne.name
    statWins = "Wins: " + newVar.playerOne.wins
    statLosses = "Losses: " + newVar.playerOne.losses
    statTies = "Ties: " + newVar.playerOne.ties
    fillOne()
  }
}
function playerStats2 () {
  if (player2 === "") {
    statName = "Waiting"
    statWins = "Wins: 0"
    statLosses = "Losses: 0"
    statTies = "Ties: 0"
    fillTwo()
  }
  else {
    statName = newVar.playerTwo.name
    statWins = "Wins: " + newVar.playerTwo.wins
    statLosses = "Losses: " + newVar.playerTwo.losses
    statTies = "Ties: " + newVar.playerTwo.ties
    fillTwo()
  }
}
function fillOne() {
  $("#playa1-name").text(statName)
  $("#playa1-wins").text(statWins)
  $("#playa1-losses").text(statLosses)
  $("#playa1-ties").text(statTies)
  playerStats2()
}
function fillTwo() {
  $("#playa2-name").text(statName)
  $("#playa2-wins").text(statWins)
  $("#playa2-losses").text(statLosses)
  $("#playa2-ties").text(statTies)
}

function renderStart () {
  $("#playerone-idbox").text("Player 1: Waiting for player 1")
  $("#playertwo-idbox").text("Player 2: Waiting for player 2")
  $("#chat-area").empty()
}
function myFadeFunction() {
  $("#game-button-text").attr({
    style: "color: red; font-weight: bolder;",
    state: "play"})
    count +=1
    block = "#game-block" + (count).toString()
    myBlock = currentBlock[count]
    delayStuff()
  }
function delayStuff() {
  if (count < 3) {
  setTimeout(function() {
    $(block).fadeTo(500, 0.5)
    $(block).fadeTo(500, 1.0)
    $("#game-button-text").text(myBlock)
    myFadeFunction()}, k)
    k=1000
    }
  else {
    var refErence = $("#game-button-text").attr("state")
    if (refErence === "play") {
    setTimeout(function() {
      $("#game-button-text").text("SHOOT!")
      $("#game-block0").attr("data-name", "rock")
      $("#game-block1").attr("data-name", "paper")
      $("#game-block2").attr("data-name", "scissors")
      }, 1000)
    }
  }
}
function evaluateMove() {
  playerOneMove = newVar.playerOne.move
  playerTwoMove = newVar.playerTwo.move
  gameDatabase.ref().child("/players/playerOne/move").set("")
  gameDatabase.ref().child("/players/playerTwo/move").set("")
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
    gameDatabase.ref().child("/players/playerOne/ties").set(ties1)
    gameDatabase.ref().child("/players/playerTwo/ties").set(ties2)
    $("#game-button-text").text("This round has ended in a tie")
    setTimeout(cleanUpOnAisle6, 5000)
  }
}
function playerOneWins(){
  var winName = newVar.playerOne.name
  var loser = newVar.playerOne.wins +1
  var winner = newVar.playerTwo.losses +1
  gameDatabase.ref().child("/players/playerOne/wins").set(winner)
  gameDatabase.ref().child("/players/playerTwo/losses").set(loser)
  $("#game-button-text").text(winName + " has won this round!")
  setTimeout(cleanUpOnAisle6, 5000)
}
function playerTwoWins(){
  var winName = newVar.playerTwo.name
  var loser = newVar.playerOne.losses +1
  var winner = newVar.playerTwo.wins +1
  gameDatabase.ref().child("/players/playerOne/losses").set(loser)
  gameDatabase.ref().child("/players/playerTwo/wins").set(winner)
  $("#game-button-text").text(winName + " has won this round!")
  setTimeout(cleanUpOnAisle6, 5000)
}
function cleanUpOnAisle6(){
  gameDatabase.ref().child("/inPlay/yesInPlay").set("false")
  buttonName = ""
  k = 0
  count = -1
  $("#game-block0").removeAttr("data-name")
  $("#game-block1").removeAttr("data-name")
  $("#game-block2").removeAttr("data-name")
  $("#game-button-text").attr("style", "color: white; font-weight: normal;")
  $("#game-button-text").text("CLICK HERE TO PLAY AGAIN")
}
//Listen for change in the player object in firebase
gameDatabase.ref("/players/").on("value", function(snapshot) {
  newVar = snapshot.val()
  if (snapshot.child("playerOne").exists() && snapshot.child("playerTwo").exists() && newVar.playerOne.move === "" && newVar.playerTwo.move === "") {
    $("#game-button-text").text("EITHER PLAYER MAY CLICK HERE TO START ROUND")
  }
  if (snapshot.child("playerOne").exists() && player1 === "") {
    player1 = "exists"
    $("#playerone-idbox").text("Player 1: " + newVar.playerOne.name)
  }
  else if (snapshot.child("playerTwo").exists() && player2 === "") {
    player2 = "exists"
    $("#playertwo-idbox").text("Player 2: " + newVar.playerTwo.name)
    playerStats()
  }
   else if (snapshot.child("playerOne").exists() && snapshot.child("playerTwo").exists() && newVar.playerOne.move != "" && newVar.playerTwo.move != "") {
    evaluateMove()
  }
  else {
    newVar = snapshot.val()
    playerStats()
  }
})
gameDatabase.ref("/inPlay/").on("value", function(snapshot) {
  var refErence = $("#game-button-text").attr("state")
  if (snapshot.child("yesInPlay").val() === "true") {
    myFadeFunction()
  }
  else if (refErence === "play") {
    $("#game-button-text").attr("state", "")
    cleanUpOnAisle6()
  }
})

//Listen for player one chat and add to chat box
gameDatabase.ref("/chats/chatOne/").on("child_added", function(snapshot){
  var message = snapshot.val()
  var chatLine = $("<div class='chat-text'>").html(message)
  $("#chat-area").append(chatLine)
  $("#chat-area").scrollTop($("#chat-area")[0].scrollHeight)
})
//Listen for player two chat and add to chat box
gameDatabase.ref("/chats/chatTwo/").on("child_added", function(snapshot){
  var message = snapshot.val()
  var chatLine = $("<div class='chat-text'>").html(message)
  $("#chat-area").append(chatLine)
  $("#chat-area").scrollTop($("#chat-area")[0].scrollHeight)
})
//Listen for when a player closes or refreshes their browser, and reset their session
gameDatabase.ref("/players/").on("child_removed", function(snapshot) {
  if (snapshot.val().playerNum === "One") {
    var chatMess = snapshot.val().name + " has left the game"
    var chatKey = gameDatabase.ref().child("/chats/chatTwo/").push().key
    gameDatabase.ref("/chats/chatTwo/" + chatKey).set(chatMess)
    player1 = ""
    $("#playerone-idbox").text("Player 1: Waiting for player 1")
    gameDatabase.ref().child("/inPlay/yesInPlay").set("false")
    if (player2 != "") {
      gameDatabase.ref().child("/players/playerTwo/wins").set(0)
      gameDatabase.ref().child("/players/playerTwo/losses").set(0)
      gameDatabase.ref().child("/players/playerTwo/ties").set(0)
    }
  }
  else {
    var chatMess = snapshot.val().name + " has left the game"
    var chatKey = gameDatabase.ref().child("/chats/chatOne/").push().key
    gameDatabase.ref("/chats/chatOne/" + chatKey).set(chatMess)
    player2 = ""
    $("#playertwo-idbox").text("Player 2: waiting for player 2")
    gameDatabase.ref().child("/inPlay/yesInPlay").set("false")
    if (player1 != "") {
      gameDatabase.ref().child("/players/playerOne/losses").set(0)
      gameDatabase.ref().child("/players/playerOne/ties").set(0)
      gameDatabase.ref().child("/players/playerOne/wins").set(0)
    }
  }
  $("#game-button-text").text("WAITING FOR ANOTHER PLAYER")
})
// Listen for player name to be entered
$("#player-name-input").on("keypress", (event) => {
  if (event.which === 13) {
    playa = $("#player-name-input").val().trim()
    $("#player-name-input").val("")
    if (playa !== "" && player1 === "") {
      playerNumber = "One"
      playerNumOpp = "Two"
    }
    else if (localPlayer === "" && player1 === "exists" && player2 === "") {
      playerNumber = "Two"
      playerNumOpp = "One"
    }
    loadPlayer()
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
  gameDatabase.ref().child("/inPlay/").set(gamePlayTrue)
  }
  else {
    alert("You're waiting for another player to join")
  }
})
$("#game-block0, #game-block1, #game-block2").on("click", function(){
  event.preventDefault()
  buttonName = $(this).attr("data-name")
  if (buttonName != undefined) {
    var localMover = "/players/" + localPlayer + "/move"
    gameDatabase.ref().child(localMover).set(buttonName)
  }
  if (localPlayer === "playerOne"  && newVar.playerOne.move != "" && newVar.playerTwo.move === "") {
    $("#game-button-text").text("WAITING FOR YOUR OPPONENT")
  }
  if (localPlayer === "playerTwo"  && newVar.playerTwo.move != "" && newVar.playerOne.move === "") {
    $("#game-button-text").text("WAITING FOR YOUR OPPONENT")
  }
})
