"use strict";

//#region Init vars
var totalRounds = 5;

var selection, computerSelection, playerSelection, resultsMessage, fadeEffect, barFadeEffect, buttonWinEffect, gameOverFadeEffect;
var computerScore = 0, playerScore = 0, playerCurrentWidth = 0, computerCurrentWidth = 0, computerOpacity = 0, currentRound = 0;
var loseOpacity = 1, playerWon = false, computerWon = false;

var mainText = document.getElementById("text");
var playerScoreElement = document.getElementById("playerscore");
var computerScoreElement = document.getElementById("computerscore");
var headerElement = document.getElementById("mainText");
var playerRunningScoreElement = document.getElementById("playerRunningScore");
var computerRunningScoreElement = document.getElementById("computerRunningScore");
let playerButtons = document.querySelectorAll(".playerButton");
let computerButtons = document.querySelectorAll(".computerButton");
//#endregion


///----------------------------------------------Init Game----------------------------------------------///

initGame();

///----------------------------------------------Buttons----------------------------------------------///

//Resize buttons to make them all as wide as the largest one
maximizeButtonWidth(playerButtons);
maximizeButtonWidth(computerButtons);

//Set button click handlers
setButtonClickActions(playerButtons,playerSelectionClickAction);

///----------------------------------------------GAME FUNCTIONS----------------------------------------------///

//#region Game
/**
 * Inits selections
 */
function initGame()
{
    selection =
    {
        NOONE :
        {
            "name" : "Undefined",
            "beats" : "Noone"
        },
        ROCK :
        {
            "name" : "Rock",
            "beats" : "Scissors"
        },
        PAPER :
        {
            "name" : "Paper",
            "beats" : "Rock"
        },
        SCISSORS :
        {
            "name" : "Scissors",
            "beats" : "Paper"
        }
    }
}

/**
 * Sets playerSelection to selection relative to button pressed, sets computer selection, plays round,  
 * and changes the text HTML element. I.e this fires the entire round.
 */
function playerSelectionClickAction()
{
    switch(this.id)
    {
        case "Rock":
            playerSelection = selection.ROCK;
        break;  
        case "Paper":
            playerSelection = selection.PAPER;
        break; 
        case "Scissors":
            playerSelection = selection.SCISSORS;
        break;

        default:
        break;
    }
    computerSelection = choose(selection.ROCK,selection.PAPER,selection.SCISSORS);
    playRound(computerSelection,playerSelection)
    fadeEffect = setInterval(fadeOutButtons,1);
}

/**
 * Starts round and sets winner
 * @param {*} _computerSelection 
 * @param {*} _playerSelection 
 */
function playRound(_computerSelection,_playerSelection)
{
    currentRound++;
    for (let i = 0; i < playerButtons.length; i++)
    {
        playerButtons[i].disabled = true;
        playerButtons[i].style.cursor = "none";
    }
    if(_computerSelection.name==_playerSelection.name) //Draw
    {
        return;
    }
    else if(_computerSelection.beats==_playerSelection.name)
    {
        computerWon = true;
        computerScore++;
        return;
    }
    playerWon = true;
    playerScore++;
    return;
}

/**
 * Fades out all other buttons than player selection, and fades in enemy button
 */
function fadeOutButtons()
{
    var _clearFadeOut = false;
    for (let i = 0; i < playerButtons.length; i++)
    {
        var _thisButton = playerButtons[i];
        if(_thisButton.id!=playerSelection.name)
        {
            if(!_thisButton.style.opacity)
            {
                _thisButton.style.opacity = 1;
            }
            if(_thisButton.style.opacity>0)
            {
                _thisButton.style.opacity -= 0.01;
            }
            else
            {
                _clearFadeOut = true;
            }
        }
    }
    updateHeaderRound();
    fadeInComputerSelection();
    if(_clearFadeOut)
    {
        computerOpacity = 0;
        buttonWinEffect = setInterval(buttonEffect,1);
        clearInterval(fadeEffect); 
    }
}


/**
 * Lerps progress bar to where it should be. Resets round on completion || fires display game winner in header function.
 */
function showNewScore()
{
    if(!computerWon && !playerWon) //Early out for a draw
    {
        resetRound();
        clearInterval(barFadeEffect);
        return;
    }

    var _lerpFactor = 0.04, _leeway = 0.1,_lerpComplete = false, _gameComplete = false;

    var _targetWidth = clamp((playerScore/totalRounds)*100,0,50); //Init vars as players vars
    var _currentWidth = playerCurrentWidth;
    var _element = playerScoreElement;

    if(computerWon)
    {
        _targetWidth = clamp((computerScore/totalRounds)*100,0,50);
        _currentWidth = computerCurrentWidth;
        _element = computerScoreElement;
    }

    _gameComplete = _targetWidth>=50; //Game win condition
   
    _currentWidth = lerp(_currentWidth,_targetWidth,_lerpFactor); //Lerp width towards target
    setWidth(_element,_currentWidth+"%"); //Assigns width to element
    playerWon ? playerCurrentWidth = _currentWidth : computerCurrentWidth = _currentWidth; //Assigns current value to global var
    _lerpComplete = (_targetWidth-_currentWidth)<=_leeway; //Accounts for leeway in checking for lerp completion

    if(_lerpComplete)
    {
        _gameComplete ? displayWinnerInHeader() : resetRound();
        clearInterval(barFadeEffect);
    }
}

/**
 * Changes header to win text and changes main button to allow a new game
 */
function displayWinnerInHeader()
{
    currentRound = 0;
    if(playerWon)
    {
        changeHeaderText("Player wins the game!");
    }
    else
    {
        computerOpacity = 1;
        changeHeaderText("Computer wins the game!");
        gameOverFadeEffect = setInterval(fadeOutComputerSelection,1);
    }
    //Change paper button to be new game button
    document.getElementById("Paper").innerHTML = "Play again";
    document.getElementById("Paper").style.opacity = 1;
    document.getElementById("Paper").style.width = "30%";
    document.getElementById("Paper").disabled = false;
    document.getElementById("Paper").style.cursor = "pointer";
    document.getElementById("Paper").onclick = resetGame;
    document.getElementById("Rock").style.cursor = "default";
    document.getElementById("Rock").style.opacity = 0;
    document.getElementById("Scissors").style.cursor = "default";
    document.getElementById("Scissors").style.opacity = 0;
}

/**
 * Resets round and allows for next round
 */
function resetRound()
{
    loseOpacity = 1;
    playerWon = false;
    computerWon = false;
    for (let i = 0; i < playerButtons.length; i++)
    {
        playerButtons[i].style.opacity = 1;
        playerButtons[i].style.cursor = "pointer";
        playerButtons[i].disabled = false;
        computerButtons[i].style.opacity = 0; 
    }

}

/**
 * Fades out losing button and fires progress bar effect on completion
 */
function buttonEffect()
{
    //For dramatic pause
    if(loseOpacity<=-0.5)
    {
        updateHeaderRoundWinner();
        if(loseOpacity<=-1)
        {
            clearInterval(buttonWinEffect); 
            //Starts lerping progress bars
            barFadeEffect = setInterval(showNewScore,1);
            return;
        }
    }
    loseOpacity -= 0.01;
    if(playerWon)
    {
        //Player won - computer button fades out
        document.getElementById("computer"+computerSelection.name).style.opacity = loseOpacity;
    }
    else if(computerWon)
    {
        //Computer won - player button fades out
        document.getElementById(playerSelection.name).style.opacity = loseOpacity;
    }
    else
    {
        //Draw - both buttons fade out
        document.getElementById(playerSelection.name).style.opacity = loseOpacity;
        document.getElementById("computer"+computerSelection.name).style.opacity = loseOpacity;
    }
}



///----------------------------------------------HELPER FUNCTIONS----------------------------------------------///

//#region Helpers
/**
 * Updates header text to round winner and changes displayed score
 */
function updateHeaderRoundWinner()
{
    if(playerWon)
    {
        changeHeaderText("Player wins!");
        //Changes displayed running total
        playerRunningScoreElement.innerHTML = playerRunningScoreElement.innerHTML.replace(/[0-9]/g, playerScore);
    }
    else if(computerWon)
    {
        changeHeaderText("Computer wins!");
        //Changes displayed running total
        computerRunningScoreElement.innerHTML = computerRunningScoreElement.innerHTML.replace(/[0-9]/g, computerScore);
    }
    else
    {
        changeHeaderText("Draw!");
    }
}

/**
 * Fades in computers current selection
 */
function fadeInComputerSelection()
{
    computerOpacity+=0.01;
    document.getElementById("computer"+computerSelection.name).style.opacity = computerOpacity;
}

/**
 * Fades out computers current selection and clears interval for fade effects upon fadeout
 */
function fadeOutComputerSelection()
{
    computerOpacity-=0.01;
    document.getElementById("computer"+computerSelection.name).style.opacity = computerOpacity;
    if(computerOpacity<=0)
    {
        clearInterval(gameOverFadeEffect); 
    }
}

/**
 * Changes header text to _string
 * @param {String} _string 
 */
function changeHeaderText(_string)
{
    headerElement.innerHTML = _string;
}

/**
 * Updates header text to current round
 */
function updateHeaderRound()
{
    headerElement.style.opacity = computerOpacity;
    changeHeaderText("Round " + currentRound);
}

/**
 * Refreshes page to allow for new game
 */
function resetGame()
{
    location.reload();
    return false;
}
//#endregion


//#endregion

///----------------------------------------------UTILITY FUNCTIONS----------------------------------------------///

//#region Utility

///----------------------------------------------BUTTON RESIZING----------------------------------------------///

//#region Button resizing

/**
 * Resizes element to conform to the largest width in the list
 * @param {NodeList} _list 
 */
function maximizeButtonWidth(_list)
{
    var _maxWidth = 0;
    for (let i = 0; i < _list.length; i++)
    {
        var _thisButton = _list[i];
        _thisButton.style.width = "auto";
        if(getWidth(_thisButton)>_maxWidth)
        {
            _maxWidth=getWidth(_thisButton);
        }
    }
    _maxWidth += "px";
    for (var i = 0; i < _list.length; i++)
    {
        setWidth(_list[i],_maxWidth);
    }
}

/**
 * Returns element width in pixels
 * @param {Element} element 
 */
function getWidth(element)
{
    return parseInt(window.getComputedStyle ? window.getComputedStyle(element,null).getPropertyValue("width")  : element.currentStyle.width );
}

/**
 * Sets element width
 * @param {Element} _element 
 * @param {number} _width 
 */
function setWidth(_element,_width)
{
    _element.style.width = _width;
}
//#endregion

///----------------------------------------------MISC FUNCTIONS----------------------------------------------///

//#region Misc
/**
 * Returns the clamped value of _value between _min and _max, both inclusive.
 * @param {Number} _value 
 * @param {Number} _min 
 * @param {Number} _max 
 */
function clamp(_value,_min,_max)
{
    return Math.min(Math.max(parseInt(_value), _min), _max);
}

/**
 * Sets all onclicks to provided funtion
 * @param {NodeList} _list 
 * @param {function} _function
 */
function setButtonClickActions(_list,_function)
{
    for (let i = 0; i < _list.length; i++)
    {
        _list[i].onclick = _function;
    }
}

/**
 * Standard lerp function
 * @param {Number} _value 
 * @param {Number} _target  
 * @param {Number} _lerpAmount 
 */
function lerp (_value, _target, _lerpAmount)
{
     return (_value + ((_target - _value) * _lerpAmount));
}

/**
 * Returns random pick of inputs
 * @param {*} _inputs ...
 */
function choose(_inputs)
{
    return arguments[irandom_range(0,arguments.length-1)];
}

/**
 * Returns random int - min/max inclusive
 * @param {Number} _min
 * @param {Number} _max
 */
function irandom_range(_min, _max) 
{
    _min = Math.ceil(_min);
    _max = Math.floor(_max);
    return Math.floor(Math.random() * (_max - _min + 1)) + _min;
}
//#endregion

//#endregion
