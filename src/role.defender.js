/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.defender');
 * mod.thing == 'a thing'; // true
 */

var roleDefender = {
	run : function(creep) {

		console.log('running defender');
		creep.say('d');

		var target = utils.getStoredTarget(creep, 'defenderTarget');
		console.log("current target is " + target);
		if (target == null) {
			console.log("checking for hostiles");
			var closestHostiles = creep.room.find(FIND_HOSTILE_CREEPS);
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
			utils.storeTarget(creep, 'defenderTarget', target);
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

module.exports = roleDefender;