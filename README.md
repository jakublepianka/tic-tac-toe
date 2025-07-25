<h1>Tic-Tac-Toe</h1>  
A modular, browser-based Tic-Tac-Toe game built with vanilla JavaScript, HTML, and CSS.  
Players can enter their names, track wins/losses/ties, and restart or reset stats via UI buttons.  

<h2>Features  </h2>
<ul>
<li>Two-player game: X and O take turns.</li>
<li>Player name input: Click player name fields to enter custom names.</li>
<li>Score tracking: Wins, losses, and ties are displayed and updated.</li>
<li>Restart game: Restart button resets the board for a new round.</li>
<li>Reset stats: Reset button clears all player stats.</li>
<li>Responsive UI: All controls and info are managed via DOM elements.</li>
</ul>

<h2>How to Play  </h2>
<ul>
    <li>Click on "X Name" or "O Name" to enter player names.</li>
    <li>Press Start Game to begin.</li>
    <li>Click on the grid fields to place your symbol.</li>
    <li>Use Restart or click on the grid fields to play again</li>
    <li>Reset Player Stats to clear scores.</li>
</ul>

<h2>Code Structure  </h2>
<ul>
    <li>Modular design: Uses IIFEs for encapsulation (Gameboard, DisplayController, GameController).</li>
    <li>DisplayController: Handles all DOM updates and button creation.</li>
    <li>GameController: Manages game flow, player turns, win/tie logic, and stats.</li>
    <li>Gameboard: Stores the state of the board and fields.</li>
</ul>