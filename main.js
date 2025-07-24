const TicTacToe = (function(){
    
    function SingularField(index){
        const fieldId = index;
        let placedSymbol = undefined; 

        return {
            fieldId,
            placedSymbol
        }
    };

    function Player(/*name = '',*/ symbol){
        // const playerName = name;
        const playerSymbol = symbol;
        let movesMade = [];
        let winCount = 0;
        let lossCount = 0;
        let tieCount = 0;
        let isMoving = false;
        return { 
            // playerName,
            playerSymbol,
            movesMade,
            winCount,
            lossCount,
            tieCount,
            isMoving
        };
    }

    const Gameboard = (function() {
        let gameboard = [...Array(9)];
        let isActive = false;
        function initializeGameboard(){
            for(let i = 0; i < gameboard.length; i++){
                gameboard[i] = SingularField(i);
            }
        };

        return {
            gameboard,
            isActive,
            initializeGameboard,
        }
    })();
    
    const DisplayController = (function(){
        
        const buttonContainer = document.querySelector('.button-container');
        function getFields() {
            return document.querySelectorAll('.field');
        }

        function initButtons(){
            restartButton();
            startButton();
            resetStatsButton();
        }

        const startButton = function (){
            const startBtn = document.createElement('button');
            startBtn.classList.add('start-game');
            startBtn.textContent = 'Start Game';
        
            startBtn.addEventListener('click', () =>{
                if(!Gameboard.isActive){
                    GameController.playGame();                            
                    startBtn.remove();
                } else {
                    displayGameInfo(`Game is already in progress`);
                }


            })
            buttonContainer.appendChild(startBtn);
            
        }

        function placeSymbol(currentPlayer){
            return new Promise((resolve) => {    
                const fields = getFields();
                fields.forEach((element, index) => {
                const newElement = element.cloneNode(true);
                element.parentNode.replaceChild(newElement, element);
                fields[index] = newElement;

                element.dataset.fieldid = Gameboard.gameboard[index].fieldId;
                
                    const handleClick = () => {
                        if(Gameboard.gameboard[index].placedSymbol === undefined && Gameboard.isActive === true) {
                        newElement.textContent = currentPlayer.playerSymbol;
                        newElement.removeEventListener('click', handleClick);

                        resolve(index);
                        }
                    } 
                    newElement.addEventListener('click', handleClick);
                
                });
                
            });  
        };
        
        const restartButton = function (){
            const restartBtn = document.createElement('button');
            restartBtn.classList.add('restart-game');
            restartBtn.textContent = 'Restart';
            restartBtn.addEventListener("click", () => {
                clearGrid();    
                GameController.playGame();
            });
            buttonContainer.appendChild(restartBtn);

        };

        function clearGrid(){
            const fields = getFields();
            GameController.clearMovesMade();
            Gameboard.initializeGameboard();
            fields.forEach(element => {
                element.textContent = '';
            });   
        };

        const resetStatsButton = function (){
            const resetBtn = document.createElement('button');
            resetBtn.classList.add('reset-stats');
            resetBtn.textContent = 'Reset Player Stats';
            
            resetBtn.addEventListener('click', () => {
                GameController.clearPlayerStats();
                for(let player of GameController.getPlayers()){
                    displayPlayerStats(player);
                }
            });

            buttonContainer.appendChild(resetBtn);
        };

        

        function displayGameInfo(message){
            const infoBar = document.querySelector('.game-info-container');
            infoBar.textContent = '';
            infoBar.textContent = message;
        };
        
        function displayPlayerStats(player){
            const player1InfoContainer = document.querySelector('.player1-info');
            const player2InfoContainer = document.querySelector('.player2-info');
            if (player.playerSymbol === 'X'){
                    player1InfoContainer.innerText = '';
                    player1InfoContainer.innerText = `${player.playerSymbol}
                    Wins ${player.winCount}
                    Losses ${player.lossCount}
                    Ties ${player.tieCount}`;
            } else {
                    player2InfoContainer.innerText = '';
                    player2InfoContainer.innerText = `${player.playerSymbol}
                    Wins ${player.winCount}
                    Losses ${player.lossCount}
                    Ties ${player.tieCount}`;
            }
        };

        return {
            initButtons,
            placeSymbol,
            displayGameInfo,
            displayPlayerStats
        }
    })();

    const GameController = (function(){
        const player1 = Player('X');
        const player2 = Player('O');
        Gameboard.initializeGameboard();
        DisplayController.displayPlayerStats(player1);
        DisplayController.displayPlayerStats(player2);

        function playGame(){

            if (Gameboard.gameboard.every((element) => element.placedSymbol == undefined)){
                Gameboard.isActive = true;
                makeMove(chooseFirstPlayer(player1, player2));
            } else {
                makeMove(changePlayer(player1, player2));
            }

        }

        function chooseFirstPlayer(playerOne, playerTwo){
            if (playerOne.winCount === playerTwo.winCount){
                if(Math.floor(Math.random()*2)){
                    playerTwo.isMoving = false;
                    playerOne.isMoving = true;
                    return playerOne;
                } else {
                    playerOne.isMoving = false;
                    playerTwo.isMoving = true;
                    return playerTwo; 
                }    
            } else if (playerOne.winCount > playerTwo.winCount){
                playerOne.isMoving = false;
                playerTwo.isMoving = true;
                return playerTwo; 
                
            } else {
                playerTwo.isMoving = false;
                playerOne.isMoving = true;
                return playerOne;
            }
        }

        function changePlayer(playerOne, playerTwo){
            if (playerOne.isMoving){
                playerOne.isMoving = false;
                playerTwo.isMoving = true;
                return playerTwo;
            } else {
                playerTwo.isMoving = false;
                playerOne.isMoving = true;
                return playerOne;
            }               
        }

        async function makeMove(currentPlayer){            

            DisplayController.displayGameInfo(`${currentPlayer.playerSymbol} Turn`);
            let index = await DisplayController.placeSymbol(currentPlayer);

            if(Gameboard.gameboard[index].placedSymbol !== undefined){
                alert('this field is already taken');
                return;

            } else if(!/^[0-8]$/.test(index)){
                alert('Invalid value');
                return 
            }

            Gameboard.gameboard[index].placedSymbol = currentPlayer.playerSymbol;
            currentPlayer.movesMade.push(index);
            checkForWin(currentPlayer);
            
        }

        function checkForWin(currentPlayer){
            const winConditions = [
                [0, 1, 2],
                [3, 4, 5],
                [6, 7, 8],
                [0, 3, 6],
                [1, 4, 7],
                [2, 5, 8],
                [0, 4, 8],
                [2, 4, 6],
            ];

            for(let index in winConditions){

                if (winConditions[index].every((element) => currentPlayer.movesMade.includes(element))){
                    DisplayController.displayGameInfo(`${currentPlayer.playerSymbol} Wins!`);

                    if (currentPlayer.playerSymbol == player1.playerSymbol) {

                        player1.winCount++;
                        player2.lossCount++;
                        DisplayController.displayPlayerStats(player1);
                        DisplayController.displayPlayerStats(player2);
                        clearMovesMade();
                    } else {

                        player2.winCount++;
                        player1.lossCount++;
                        DisplayController.displayPlayerStats(player1);
                        DisplayController.displayPlayerStats(player2);
                        clearMovesMade();
                    }
                    Gameboard.isActive = false;
                    Gameboard.initializeGameboard();
                    return;
                }
            }
            if (Gameboard.gameboard.every((field) => field.placedSymbol !== undefined)){

                DisplayController.displayGameInfo(`It's a Tie!`);
                player1.tieCount++
                player2.tieCount++
                clearMovesMade();
                Gameboard.isActive = false;                    
                Gameboard.initializeGameboard();
                DisplayController.displayPlayerStats(player1);
                DisplayController.displayPlayerStats(player2);

                return;
            }
            
            playGame();
        }

        function getPlayers(){
            let arr = [];
            arr.push(player1);
            arr.push(player2);
            return arr;
        };
            
        function clearMovesMade(){
            player1.isMoving = false;
            player2.isMoving = false;
            player1.movesMade = [];
            player2.movesMade = [];
        }

        function clearPlayerStats(){
            player1.winCount = 0;
            player1.lossCount = 0;
            player1.tieCount = 0;
            player2.winCount = 0;
            player2.lossCount = 0;
            player2.tieCount = 0;
        }
        
        
        return {
            playGame,
            clearMovesMade,
            clearPlayerStats,
            getPlayers          
        }

    })();

    DisplayController.initButtons();
    
})();
