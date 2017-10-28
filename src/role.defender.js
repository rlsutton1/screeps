/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.defender');
 * mod.thing == 'a thing'; // true
 */

var roleDefender = {
	run : function(creep, utils) {

		utils.log('running defender');
		creep.say('d');

		var target = utils.getStoredTarget(creep, 'defenderTarget');
		utils.log("current target is " + target);
		if (target == null) {
			utils.log("checking for hostiles");
			var closestHostiles = creep.room.find(FIND_HOSTILE_CREEPS);
			utils.log("hostiles are " + closestHostiles);

			for (h in closestHostiles) {
				var hostile = closestHostiles[h];
				utils.log("found hostile " + hostile)
				if (hostile.owner.username != 'Cokezero') {
					target = hostile;
					utils.log('target is ' + target);
				}
			}

		}
		if (target) {
			utils.storeTarget(creep, 'defenderTarget', target);
			var result = creep.attack(target);
			utils.log("result " + result);
			if (result == ERR_NOT_IN_RANGE) {
				creep.moveTo(target, {
					reusePath : 10
				});
			}
		}

	}
}

module.exports = roleDefender;