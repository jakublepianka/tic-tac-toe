(function(){

    const Gameboard = (function() {
        let gameboard = [...Array(9)];
        function clearGameboard(){
            for(let i = 0; i < gameboard.length; i++){
                gameboard[i] = undefined;
            }
        };
        // function displayGameboard(){

         
        // };

        return {
            gameboard,
            clearGameboard,
            // displayGameboard
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

        function playGame(){

        while (true){            
            if (Gameboard.gameboard.every((element) => element == undefined)){
                makeMove(chooseFirstPlayer(player1, player2));
                console.log(Gameboard.gameboard);
            }

            makeMove(changePlayer(player1, player2));
            console.log(Gameboard.gameboard);
            
            }
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

        function makeMove(player){            

            player.isMoving = true;
            let index = prompt(`${player.playerName}'s move: `, );
            
            if(Gameboard.gameboard[index] !== undefined){
                return console.log('this field is already taken');

            } else if(!/^[0-8]$/.test(index)){
                return console.log('Invalid value');

            }

            Gameboard.gameboard[index] = player.playerSymbol;
            player.movesMade.push(index);
            checkForWin(player);
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
                if (winConditions[index].every((element) => currentPlayer.movesMade.includes(`${element}`))){
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
                    Gameboard.clearGameboard();

                } else if (!(Gameboard.gameboard.includes(undefined))){

                    console.log(`It's a tie!`);
                    player1.tieCount++
                    player2.tieCount++
                    clearStats(player1, player2);
                    Gameboard.clearGameboard();

                }
            }
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

    GameController.playGame();


})();