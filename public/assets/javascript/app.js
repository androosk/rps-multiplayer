var gameDatabase = firebase.database()
var playerOne = null
var playerTwo = null
var pOne = "waiting for player 1"
var pTwo = "waiting for player 2"
var yourName = ""
var playa = ""
var localPlayer = ""
var player1 = ""
var player2 = ""
var newVar = null
var playerName = ""
var currentMessage = ""
var messenger = ""

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
  })
//Listen for change in the player object in firebase
gameDatabase.ref("/players/").on("value", function(snapshot) {
  if (snapshot.child("playerOne").exists() && player1 === "") {
    player1 = "exists"
    newVar = snapshot.val()
    $("#playerone-idbox").text("Player 1: " + newVar.playerOne.name)
  }
  else if (player1 === "exists") {
    newVar = snapshot.val()
    $("#playertwo-idbox").text("Player 2: " + newVar.playerTwo.name)
    player2 = "exists"
  }
})
gameDatabase.ref("/chat/").on("child_added", function(snapshot){
  var message = snapshot.val()
  var chatLine = $("<div class='chat-text'>").html(message)
  $("#chat-area").append(chatLine)
  $("#chat-area").scrollTop($("#chat-area")[0].scrollHeight)
})

//Listen for player name to be entered
$("#player-name").on("keypress", (event) => {
  if (event.which === 13) {
    playa = $("#player-name").val().trim()
    $("#player-name").val("")
    checkPlayer()
  }
})
$("#chat-message").on("keypress", (event) => {
  if (event.which === 13) {
    var message = $("#chat-message").val().trim()
    $("#chat-message").val("")
    currentMessage = message
    messenger = $("#chat-message").attr("data")
    addToChat()
  }
})
//Listen for click on rock paper or scissors
// $("#game-block1, #game-block2, #game-block3").on("click", function(){
//   event.preventDefault()
//   var buttonName = $(this).attr("data-name")
// })
function addToChat() {
  var chatMess = (messenger + " said " + currentMessage)
  var chatKey = gameDatabase.ref().child("/chat/").push().key
  gameDatabase.ref("/chat/" + chatKey).set(chatMess)
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
      }
      gameDatabase.ref().child("players/playerOne").set(playerOne)
      playerName = newVar.playerOne.name
      var chatMess = playerName + " has joined the game"
      var chatKey = gameDatabase.ref().child("/chat/").push().key
      gameDatabase.ref("/chat/" + chatKey).set(chatMess)
      $("#chat-message").attr("data", playerName)
      $("#player-div").hide()
      playerName = ""
      goGameScreen()
  }
  else if (localPlayer === "" && player1 === "exists" && player2 === "") {
      localPlayer = playa
      playerTwo = {
        name : localPlayer,
        wins : 0,
        losses : 0,
        ties : 0,
        move : "",
      }
    gameDatabase.ref().child("players/playerTwo").set(playerTwo)
    playerName = newVar.playerTwo.name
    var chatMess = playerName + " has joined the game"
    var chatKey = gameDatabase.ref().child("/chat/").push().key
    gameDatabase.ref("/chat/" + chatKey).set(chatMess);
    $("#chat-message").attr("data", playerName)
    $("#player-div").hide()
    playerName = ""
    goGameScreen()
  }
}
function goGameScreen () {
  $("#player-div").hide()
  $("#chat-dialog").toggle()
  playerStats()
}
function renderStart () {
  $("#playerone-idbox").text("Player 1: " + pOne)
  $("#playertwo-idbox").text("Player 2: " + pTwo)
}
function playerStats() {
  if (player1 === "exists") {
    var statOne = "Player One"
    var statName = "Name: " + newVar.playerOne.name
    var statWins = "Wins: " + newVar.playerOne.wins
    var statLosses = "Losses: " + newVar.playerOne.losses
    var statTies = "Ties: " + newVar.playerOne.ties
    var statDisplayPlayer = $("<div id='stat-stuff1'>").html(statOne)
    var statDisplayName = $("<div id='stat-stuff2'>").html(statName)
    var statDisplayWins = $("<div id='stat-stuff3'>").html(statWins)
    var statDisplayLosses = $("<div id='stat-stuff4'>").html(statLosses)
    var statDisplayTies = $("<div id='stat-stuff5'>").html(statTies)
    $("#player-one-stats").append(statDisplayPlayer)
    $("#player-one-stats").append(statDisplayName)
    $("#player-one-stats").append(statDisplayWins)
    $("#player-one-stats").append(statDisplayLosses)
    $("#player-one-stats").append(statDisplayTies)
  }
  if (player2 === "exists") {
    var statOne = "Player Two"
    var statName = "Name: " + newVar.playerTwo.name
    var statWins = "Wins: " + newVar.playerTwo.wins
    var statLosses = "Losses: " + newVar.playerTwo.losses
    var statTies = "Ties: " + newVar.playerTwo.ties
    var statDisplayPlayer = $("<div id='stat-stuff1'>").html(statOne)
    var statDisplayName = $("<div id='stat-stuff2'>").html(statName)
    var statDisplayWins = $("<div id='stat-stuff3'>").html(statWins)
    var statDisplayLosses = $("<div id='stat-stuff4'>").html(statLosses)
    var statDisplayTies = $("<div id='stat-stuff5'>").html(statTies)
    $("#player-two-stats").append(statDisplayPlayer)
    $("#player-two-stats").append(statDisplayName)
    $("#player-two-stats").append(statDisplayWins)
    $("#player-two-stats").append(statDisplayLosses)
    $("#player-two-stats").append(statDisplayTies)
  }
}
function gameAlreadyInPlay() {
  $("#main-body").hide()
  $("#heading").append("<h1>Game In Play Come Back Later</h1>")
}
