var gameDatabase = firebase.database()
var playerOne = null
var playerTwo = null
var pOne = "waiting for player 1"
var pTwo = "waiting for player 2"
var yourName = ""
var playa = ""

$("#chat-dialog").toggle()
renderPlayer()

gameDatabase.ref("/players/").on("value", function(snapshot) {
  if (snapshot.child("playerOne").exists() && snapshot.child("playerTwo").exists()) {
    console.log("Player player!")
  }
})

$("#player-name").on("keypress", (event) => {
  if (event.which === 13) {
    playa = $("#player-name").val().trim()
    $("#player-name").val("")
  }
  if ((playa != "" && playa != null) && !(playerOne && playerTwo)) {
    if (playerOne === null) {
      pOne = playa
      playerOne = {
        name : playa,
        wins : 0,
        losses : 0,
        ties : 0,
        move : "",
      }
      gameDatabase.ref().child("players/playerOne").set(playerOne)
      playa = ""
      renderPlayer()
    }
    else if (playerTwo === null) {
      pTwo = playa
      playerTwo = {
      name : playa,
      wins : 0,
      losses : 0,
      ties : 0,
      move : "",
      }
      gameDatabase.ref().child("players/playerTwo").set(playerTwo)
      renderPlayer()
      goGameScreen()
    }
  }
})


$("#game-block1, #game-block2, #game-block3").on("click", function(){
  event.preventDefault()
  var buttonName = $(this).attr("data-name")
  console.log(buttonName)

})
function goGameScreen () {
  console.log("pork")
  $("#player-div").hide()
  $("#chat-dialog").toggle()
  playerStats()
}
function renderPlayer() {
  $("#playerone-idbox").text("Player 1: " + pOne)
  $("#playertwo-idbox").text("Player 2: " + pTwo)
}
function playerStats() {
  console.log("poop")
  var statOne = "Player One"
  var statDisplay = $("<p>").html(statOne)
  $("#player-one-stats").append(statDisplay)
  $("#player-two-stats").append("<p>Player Two</p>")
}
