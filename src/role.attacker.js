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
			var closestHostiles = creep.room.find(FIND_HOSTILE_STRUCTURES);
			console.log("hostiles are " + closestHostiles);

			for (h in closestHostiles) {
				var hostile = closestHostiles[h];
				console.log("found hostile " + hostile)
				if (hostile.owner.username != 'Cokezero') {
					target = hostile;
					console.log('target is ' + target);
				}
			}

		}
		if (target) {
			utils.storeTarget(creep, 'attackerTarget', target);
			var result = creep.attack(target);
			console.log("result " + result);
			if (result == ERR_NOT_IN_RANGE) {
				creep.moveTo(target, {
					reusePath : 10
				});
			}
		}

	}
}

module.exports = roleAttacker;