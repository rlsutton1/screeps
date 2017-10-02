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
		
		
		
		console.log('running attacker');
		creep.say('a');

		if (Game.flags.AttackRoom.room == null || creep.room.name != Game.flags.AttackRoom.room.name)
		{
			utils.log('attacker move');
			creep.moveTo(Game.flags.AttackRoom);
			return;
		}

        		
		
		var target = utils.getStoredTarget(creep, 'attackerTarget');
		console.log("current target is " + target);
		
		if (target == null) {
			console.log("checking for hostiles");
			var closestHostiles = creep.room.find(FIND_HOSTILE_CREEPS);
			
			console.log("hostiles are " + closestHostiles);
            
            closestHostiles = shuffle(closestHostiles);
			for (h in closestHostiles) {
				var hostile = closestHostiles[h];
				
				console.log("found hostile " + hostile,0x222222)
				if (hostile.owner.username != 'Cokezero') {
					target = hostile;
					console.log('target is ' + target);
				}
			}

		}
		if (target) {
            

//		    creep.heal(creep);
			utils.storeTarget(creep, 'attackerTarget', target);
			var result = creep.attack(target);
			console.log("result " + result);
			if (result == ERR_NOT_IN_RANGE) {
				creep.moveTo(target, {
					reusePath : 10
				});
			}
		}else
		{
		    	creep.moveTo(Game.flags.AttackRoom);
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