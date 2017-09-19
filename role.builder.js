var roleBuilder = {

	/**
	 * @param {Creep}
	 *            creep *
	 */
	run : function(creep) {

		creep.say('b');
		utils.log("b.");
		// utils.addCreepToQueue(creep);

		var target = utils.getStoredTarget(creep, 'myLoadingTarget');
		if (target == null) {
			target = utils.findClosest(creep, FIND_CONSTRUCTION_SITES);
			utils.storeTarget(creep, 'myLoadingTarget', target);
			utils.log('builder target is ' + target);
			if (target == null) {
				creep.memory.role = 'harvester';
			}
		}
		if (target) {
			if (creep.build(target) == ERR_NOT_IN_RANGE) {
				creep.moveTo(target, {
					visualizePathStyle : {
						stroke : '#ffffff'
					}
				});
			}
		}
	}
};

module.exports = roleBuilder;