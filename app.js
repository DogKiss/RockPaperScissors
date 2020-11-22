

"use strict";
var selection, computerSelection, playerSelection, resultsMessage;
var _thisText = document.getElementById("text");

initGame();

///----------------------------------------------Buttons----------------------------------------------///

let playerButtons = document.querySelectorAll(".playerButton");

//Resize buttons to make them all as wide as the largest one
maximizeButtonWidth(playerButtons);

//Set button click handlers
setButtonClickActions(playerButtons,playerSelectionClickAction);

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

///----------------------------------------------BUTTON CLICKS----------------------------------------------///
//#region Button clicks

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
//#endregion

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
 * and changes the text HTML element. 
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
    computerSelection = computerPlay();
    _thisText.innerHTML = "Computer selects: " + computerSelection.name + "<br>" + "You chose: " + playerSelection.name + "<br>" + playRound(playerSelection,computerSelection);
}

/**
 * Returns a random selection
 * @returns {selection}
 */
function computerPlay()
{
    return choose(selection.ROCK,selection.PAPER,selection.SCISSORS);
}


/**
 * Returns a string with a win message
 * @param {*} _computerSelection 
 * @param {*} _playerSelection 
 */
function playRound(_computerSelection,_playerSelection)
{
  if(_computerSelection==_playerSelection)
  {
    return "Draw";
  }
  else if(_computerSelection.beats==_playerSelection.name)
  {
    return "Computer wins";
  }
  return "You win!";
}

//#endregion


///----------------------------------------------UTILITY FUNCTIONS----------------------------------------------///
//#region Utility

/**
 * Repeats a function _repeat amount of times
 * @param {Function} _function 
 * @param {Number} _repeat 
 */
function repeat(_function,_repeat)
{
    var i = 0;
    while(i<_repeat)
    {
        _function();
      i++;  
    }

}

/**
 * Returns random pick of inputs
 * @param {*} inputs ...
 */
function choose(inputs)
{
    return arguments[irandom_range(0,arguments.length-1)];
}

/**
 * Returns random int - min/max inclusive
 * @param {Number} min
 * @param {Number} max
 */
function irandom_range(min, max) 
{
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Returns random float - min/max inclusive
 * @param {Number} min
 * @param {Number} max
 */
function random_range(min, max)
{
    return Math.random() * (max - min) + min;
}

 
/**
 * Logs value to console
 * @param {*} value 
 */
function show_debug_message(value)
{
    console.log(value);
}
//#endregion

//#region Testing

/**
 * Tests distribution of computer selections, logs result to console
 */
function testComputer()
{
    var _rocks = 0;
    var _paper = 0;
    var _scissors = 0;
    for (let i = 0; i < 1000; i++) 
    {
        switch(computerPlay())
        {
            case selection.PAPER:
                _paper++;
            break;
            case selection.ROCK:
                _rocks++;
            break;
            case selection.SCISSORS:
                _scissors++;
            break;
            default:
            break;
        }
    }
    show_debug_message("Paper: " + _paper);
    show_debug_message("Rocks: " + _rocks);
    show_debug_message("Scissors: " + _scissors);
}
//#endregion