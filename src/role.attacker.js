/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.defender');
 * mod.thing == 'a thing'; // true
 */

var roleAttacker = {
	run : function(creep, utils) {

		
		//Game.flags.AttackRoom
		
		
		
		utils.log('running attacker');
		creep.say('a');
		
	

		

        if (creep.memory.flag == null)
        {
            var ctr = 0;
            while (ctr < 30 && (creep.memory.flag == null  || Game.flags[creep.memory.flag]==null))
            {
                ctr++;
                creep.memory.flag = 'AttackRoom'+Math.floor((Math.random() * 9) + 1);
            }
                
        }
        creep.memory.flag='AttackRoom1';


 		var target = utils.getStoredTarget(creep, 'attackerTarget');
		utils.log("current target is " + target);
		
		if (target == null) {
			

			
			utils.log("checking for hostiles");
			var closestHostiles = creep.room.find(FIND_HOSTILE_CREEPS);
			target = chooseHostile(closestHostiles);
			if (target == null)
			{
				var closestHostiles = creep.room.find(FIND_HOSTILE_STRUCTURES);
				target = chooseHostile(closestHostiles);
			}
			

		}
		if (target) {
            

			utils.storeTarget(creep, 'attackerTarget', target);
			var result = creep.attack(target);
			utils.log("result " + result);
			if (result == ERR_NOT_IN_RANGE) {
				creep.moveTo(target, {
					reusePath : 10
				});
				creep.heal(creep);
			}
	        
		}else
		{
		    creep.heal(creep);
	    	creep.moveTo(Game.flags[creep.memory.flag]);
		}

	   

	}
}

function chooseHostile(closestHostiles)
{
	console.log("hostiles are " + closestHostiles);
    
    closestHostiles = shuffle(closestHostiles);
	for (h in closestHostiles) {
		var hostile = closestHostiles[h];
		
		console.log("found hostile " + hostile,0x222222)
		if (hostile.owner.username != 'Cokezero' && hostile.structureType != STRUCTURE_CONTROLLER&& hostile.structureType != STRUCTURE_POWER_BANK) {
			console.log('target is ' + hostile);
			return hostile;
		}
	}
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

module.exports = roleAttacker;