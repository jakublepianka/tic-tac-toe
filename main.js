// (function(){
    
    function SingularField(index){
        const fieldId = index;
        let placedSymbol = undefined; 

        return {
            fieldId,
            placedSymbol
        }
    };

    const Gameboard = (function() {
        let gameboard = [...Array(9)];
        function initializeGameboard(){
            for(let i = 0; i < gameboard.length; i++){
                gameboard[i] = SingularField(i);
            }
        };

        return {
            gameboard,
            initializeGameboard,
        }
    })();
    
    function Player(name, symbol){
        const playerName = name;
        const playerSymbol = symbol;
        let movesMade = [];
        let winCount = 0;
        let lossCount = 0;
        let tieCount = 0;
        let isMoving = false;
        return { 
            playerName,
            playerSymbol,
            movesMade,
            winCount,
            lossCount,
            tieCount,
            isMoving
        };
    }

    const GameController = (function(){
        //Take/store(?) two players names and symbols
        const player1 = Player('josh', 'x');
        const player2 = Player('fredor', 'o');
        Gameboard.initializeGameboard();

        function playGame(){

            if (Gameboard.gameboard.every((element) => element.placedSymbol == undefined)){
                makeMove(chooseFirstPlayer(player1, player2));
                console.log(Gameboard.gameboard);
                console.log("lol");
                // playGame();
                // return;
            } else {
                makeMove(changePlayer(player1, player2));
                console.log(Gameboard.gameboard);                
            }

            // console.log(Gameboard.gameboard);
            // playGame();
        }

        function chooseFirstPlayer(playerOne, playerTwo){
            if (playerOne.winCount === playerTwo.winCount){
                return Math.floor(Math.random()*2) ? playerOne : playerTwo;
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

            currentPlayer.isMoving = true;
            let index = await displayController.placeSymbol(currentPlayer);
            
            console.log(`${index} is the number`);
            // if (index === undefined) return;
            if(Gameboard.gameboard[index].placedSymbol !== undefined){
                return alert('this field is already taken');

            } else if(!/^[0-8]$/.test(index)){
                return alert('Invalid value');
            }

            Gameboard.gameboard[index].placedSymbol = currentPlayer.playerSymbol;
            currentPlayer.movesMade.push(index);
            checkForWin(currentPlayer);
            
            // to do:
            // Update the view of the gameboard
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
                    console.log(`${currentPlayer.playerName} is the winner!`);

                    if (currentPlayer.playerSymbol == player1.playerSymbol) {

                        player1.winCount++;
                        player2.lossCount++;
                        clearStats(player1, player2);
                    } else {

                        player2.winCount++;
                        player1.lossCount++;
                        clearStats(player1, player2);
                    }
                    Gameboard.initializeGameboard();
                    return console.log("finished");
                    // playGame();

                } else if (Gameboard.gameboard.every((field) => field.placedSymbol !== undefined)){

                    console.log(`It's a tie!`);
                    player1.tieCount++
                    player2.tieCount++
                    clearStats(player1, player2);
                    Gameboard.initializeGameboard();
                    return console.log("finished");
                    // playGame();
                }
            }
            playGame();
        }
            
        function clearStats(player1, player2){
            player1.isMoving = false;
            player2.isMoving = false;
            player1.movesMade = [];
            player2.movesMade = [];
        }
        
        
        return {
            playGame
        }

    })();

    const displayController = (function(){
        // preset values which allow for instant gameplay
        // preset grid
        // restart button
        // no confirm and symbol choice button, it should be enough to fill out the form fields
        // // // 
        // displayGameboard (refresh view)
        // connect each field to the array by its index
        // const header = document.querySelector('.header');
        
        const gameContainer = document.querySelector('.game');
        
        
        function placeSymbol(currentPlayer){
            const fields = document.querySelectorAll('.field');            
            return new Promise((resolve) => {    
            fields.forEach((element, index) => {
                element.dataset.fieldid = Gameboard.gameboard[index].fieldId;
                if(Gameboard.gameboard[index].placedSymbol === undefined) {
                    const handleClick = () => {
                        element.textContent = currentPlayer.playerSymbol;
                        element.removeEventListener('click', handleClick);

                        resolve(index);
                    } 
                    element.addEventListener('click', handleClick);
                }
                });
                
            });  
        };
        
        // function restartButton(){
        //     const restartBtn = document.createElement('button');
        //     restartBtn.classList.add('restart-game');
        //     restartBtn.innerHTML = 'Restart';
        //     restartBtn.addEventListener("Click", () => {
        //         clearGrid();
        //     });
        //     header.appendChild(restartBtn);
        // };

        // function clearGrid(){
        //     field.forEach(element => {
        //         innerHTML = '';
        //     });
        // };
        
        

        // function displayGameboard(){
        // }
        

        return {
            // connectGrid,
            placeSymbol,
            // restartButton,
            // displayGameboard,
        }
    })();


    // displayController.restartButton();
    // console.log(displayController.placeSymbol(Gameboard.gameboard));
    // console.log(displayController.placeSymbol(3));
    
    // displayController.displayGameboard()
    GameController.playGame();


// })();