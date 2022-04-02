/*
Matt Marko
        This is the Javascript code for my website that runs the game of Nim.
    For instructions on how to play, click the "How do I Play?" button the home
    page of the website.
*/

// The following four constants define which section of the website we are on
const HOME = 0;
const PLAYER_SELECT = 1;
const RULES = 2;
const IN_GAME = 3;

var currentPage = HOME;
var numPlayers = 0;

// indicated whose turn it is:
// 1 = player one, 2 = player 2/CPU
var turn = 1;  

// Indicated which matches have been removed:
// 0 = removed, 1 = active
var matchStatus = Array(15); 

// Indicated how many matches are left
var matchesLeft = 16;

// Indicated whether the game has ended
var gameEnded = false;

// Initializes fundamental values when the website loads
function initializeGame(){
    // initialze array of matches
    for(var i = 0; i <= 15; i++){
        matchStatus[i] = 1;
    }
}

// Transition to the player select screen
function goToPlayerSelect() {
    currentPage = PLAYER_SELECT;

    document.getElementById("play").style.display = "none";
    document.getElementById("ruleButton").style.display = "none";
    document.getElementById("player1").style.display = "block";
    document.getElementById("player2").style.display = "block";
    document.getElementById("back").style.display = "inline-block";
}

// Displays the rules of the game
function goToRules(){
    currentPage = RULES;
    
    document.getElementById("play").style.display = "none"; 
    document.getElementById("ruleButton").style.display = "none";    
    document.getElementById("back").style.display = "block";
    document.getElementById("rules").style.display = "block";
    document.getElementById("example").style.display = "inline";
}

// Go back when the back button is pressed
function goBack(){
    document.getElementById("play").style.display = "block";  
    document.getElementById("ruleButton").style.display = "block";
    document.getElementById("player1").style.display = "none";
    document.getElementById("player2").style.display = "none";
    document.getElementById("rules").style.display = "none";
    document.getElementById("back").style.display = "none";
    
    // Hide the matches if we are in the middle of the game
    if(currentPage == IN_GAME){
        location.reload();
    }
    
    currentPage = HOME;
}

// Begin the game once the number of players have been selected
function startGame(num){
    var matches = document.getElementsByClassName("match");

    numPlayers = num;
    currentPage = IN_GAME;
    
    for(var i = 0; i < matches.length; i++){
        matches[i].style.display = "inline-block";
    }
    
    document.getElementById("player1").style.display = "none";
    document.getElementById("player2").style.display = "none";
    document.getElementById("back").innerHTML = "Quit";
    document.getElementById("row1").style.display = "block";
    document.getElementById("row2").style.display = "block";
    document.getElementById("row3").style.display = "block";
    document.getElementById("row4").style.display = "block";
    document.getElementById("turnAnnouncement").style.display = "block";
    document.getElementById("announcementLine").style.display = "block";
    document.getElementById("mainBlock").style.padding = "2.5%";
    changeAnnouncement();
}

// Highlights the matches when we hover over them
function highlightMatches(firstMatch, lastMatch){
    if(numPlayers == 1 && turn == 2){
        return 0;
    }

    const id = "match"

    for(var i = firstMatch; i <= lastMatch; i++){
        if(matchStatus[i-1] == 1){
            matchName = id.concat(i.toString());
            document.getElementById(matchName).style.backgroundColor = "rgb(100,120,160)";
        }
    } 
}

// Unhighlights the matches when we move our mouse off them
function unhighlightMatches(firstMatch, lastMatch){
    const id = "match"
    
    for(var i = firstMatch; i <= lastMatch; i++){
        matchName = id.concat(i.toString());
        document.getElementById(matchName).style.removeProperty("background-color");
    } 
}

// Removes the selected group of matches
function matchClick(firstMatch, lastMatch){   
    if(numPlayers == 1){
        clickOnePlayer(firstMatch, lastMatch)
    } else {
        clickTwoPlayers(firstMatch, lastMatch)
    }
}

// Removes the selected group of matches in the case of a one player game
function clickOnePlayer(firstMatch, lastMatch){
    if(matchStatus[lastMatch-1] == 0 || gameEnded == true || turn == 2){
        return 0;
    }

    if(takeAllMatches(firstMatch, lastMatch)){
        displayWarning(true);
        return 0;
    }
    
    matchesLeft -= removeMatches(firstMatch,lastMatch);
    
    if(matchesLeft == 1){
        endGame();
        return 0;
    }
    
    updateTurn();  
    displayWarning(false);  
    computerAnnouncement(1);
    setTimeout(computerAnnouncement, 600, 2);
    setTimeout(computerAnnouncement, 1200, 3);
    setTimeout(computerAction, 1800);
}

// Removes the selected group of matches in the case of a two player game
function clickTwoPlayers(firstMatch, lastMatch){
    if(matchStatus[lastMatch-1] == 0 || gameEnded == true){
        return 0;
    }

    if(takeAllMatches(firstMatch, lastMatch)){
        displayWarning(true);
        return 0;
    }
         
    matchesLeft -= removeMatches(firstMatch,lastMatch);       
    
    if(matchesLeft == 1){
        endGame();
        return 0;
    }
    
    updateTurn();  
    changeAnnouncement();
    displayWarning(false);
}

// Executes the computer's turn
function computerAction(){
    var oneRowOffset = 0;
    
    if(oneRowLeft()){
        oneRowOffset = 1;
    }

    var choice = Math.floor((Math.random() * (matchesLeft-oneRowOffset)) + 1);
    var firstMatch, lastMatch = 0;
    var counter = 0;
    var removeCount = 0;

    for(var i = 0; i <= 16; i++){
        if(counter == choice){
            lastMatch = i;
            break;
        }        

        if(matchStatus[i] == 1){
            counter++;
        }
    }
    
    if(lastMatch == 1){
        firstMatch = 1;
    } else if(lastMatch >= 2 && lastMatch <= 4){
        firstMatch = 2;
    } else if(lastMatch >= 5 && lastMatch <= 9){
        firstMatch = 5;
    } else {
        firstMatch = 10;
    } 
    
    matchesLeft -= removeMatches(firstMatch, lastMatch);
    
    if(matchesLeft == 1){
        endGame();
        return 0;
    }
    
    updateTurn(); 
    changeAnnouncement();
}

// Updates the matchStatus and the matchesLeft variables
// based on the user's selection.
// Also returns the number of matches which are removed
// by the selection.
function removeMatches(firstMatch, lastMatch){
    const id = "match";
    var removeCount = 0;
    
    for(var i = firstMatch; i <= lastMatch; i++){
        if(matchStatus[i-1] == 1){
            removeCount++;
            matchStatus[i-1] = 0;
            matchName = id.concat(i.toString());
            document.getElementById(matchName).style.opacity = 0.25;

            unhighlightMatches(firstMatch, lastMatch);
        }
    }
    
    return removeCount;
}

// Changes "turn" variable to the next player's turn
function updateTurn(){
    turn = (turn % 2) + 1;
}

// Checks whether there is only one row of matches left
function oneRowLeft(){
    rowsGone = 0;
    
    if(getSum(matchStatus[0]) == 0){
        rowsGone++;
    }
    if(getSum(matchStatus.slice(1,4)) == 0){
        rowsGone++; 
    }
    if(getSum(matchStatus.slice(4,9)) == 0){
        rowsGone++; 
    }
    if(getSum(matchStatus.slice(9,16)) == 0){
        rowsGone++; 
    }

    if(rowsGone == 3){
        return true;
    } else {
        return false;
    }

}

// Changes the announcement that indicates which player's turn it is
function changeAnnouncement(){
    if(numPlayers == 2){
        var message = "It's player ";
        message = message.concat(turn);
        message = message.concat("'s turn!");
        document.getElementById("turnAnnouncement").innerHTML = message; 
    } else {
        document.getElementById("turnAnnouncement").innerHTML = "It's your turn!"; 
    }    
}

// Changes the announcement to indicate that the computer
// is making a decision
function computerAnnouncement(numPeriod){
    message = "The computer is thinking";
    for(var i = 0; i < numPeriod; i++){
        message = message.concat(".");
    }
    document.getElementById("turnAnnouncement").innerHTML = message;  
}

// Displays or hides warning depending on whether "display" input
// is true or false
function displayWarning(display){
    if(display){
        document.getElementById("turnAnnouncement").innerHTML = "You can't remove all the matches!";
    } else {
        changeAnnouncement();
    }
}

// Checks whether the user is trying to take all available matches
function takeAllMatches(firstMatch, lastMatch){
    removeCount = 0;

    for(var i = firstMatch; i <= lastMatch; i++){
        if(matchStatus[i-1] == 1){
            removeCount++;
        }
    }
    
    if(matchesLeft == removeCount){
        return true;
    } else {
        return false;
    }    
}

// Displays the winner of the game
function endGame(){
    var message = "The winner is Player ";
    gameEnded = true;
    displayWarning(false);
    
    if(numPlayers == 2){
        message = message.concat(turn);
        message = message.concat("!");
        document.getElementById("turnAnnouncement").innerHTML = message;        
    } else {
        if(turn == 1){
            document.getElementById("turnAnnouncement").innerHTML = "You won!";     
        } else {
            document.getElementById("turnAnnouncement").innerHTML = "You lost. Sorry!";             
        }
    }
    document.getElementById("back").innerHTML = "Play Again!";    
}

// Returns the sum of all elements in the input array
function getSum(list){
    sum = 0;
    for(var i = 0; i < list.length; i++) {
        sum += list[i];
    }
    return sum;
}
