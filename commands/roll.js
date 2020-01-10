module.exports = {
	name: 'roll',
	description: 'roll dice in the format XdX where the first X is the number of dice and the second X is the number of sides on the dice',
	execute(message, args) {
        var parsedInput = args.toString().split("+");
        var diceList = [];
        var totalScore = 0;
        var diceRoll = 0;
        function rollDice(size){
            return 1 + Math.floor(Math.random()*size);
        }

        for(var i = 0; i < parsedInput.length; i++){
            var diceRoll = parsedInput[i];

            if(diceRoll.indexOf("d") > 0){
                var diceParts = diceRoll.split('d');

                for (var z = 0; z < diceParts[0]; z++){
                    diceRoll = rollDice(diceParts[1]);
                    diceList.push(diceRoll);
                    totalScore += diceRoll;
                }
            }
            else{
                totalScore = parseInt(diceRoll);
            }
        }

       
        message.channel.send(`**Dice Rolls: ** ${diceList} \n **Total: ** ${totalScore}`);
	},
};

    
        