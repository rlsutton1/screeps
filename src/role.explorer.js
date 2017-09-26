var roleExplorer = {

	/**
	 * @param {Creep}
	 *            creep *
	 */
	run : function(creep, utils) {

		creep.say('e');
		// creep.moveTo(Game.flags.ExploreRoom);
		utils.log("Explorer " + creep.room.name + " "
				+ Game.flags.ExploreRoom.room);

		// check if we've reached the target room yet
		if (Game.flags.ExploreRoom.room == null || creep.room.name != Game.flags.ExploreRoom.room.name)
		{
			utils.log('explorer move');
			if (creep.moveTo(Game.flags.ExploreRoom) == ERR_NO_PATH) {
				creep.memory.reachedRoom = true;
			}
			return;
		}

		// check if we own the room
		if (!creep.room.controller.my) {
			if (creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
				creep.moveTo(creep.room.controller);
			} else {
				creep.memory.claimed = true;
				creep.memory.loading = true;
				utils.log('claiming... ');
			}
			return;
		}

		utils.log("e.");
		if (creep.memory.loading) {

			var energy = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 1);

			if (energy.length) {
				utils.log('found ' + energy[0].energy + ' energy at ',
						energy[0].pos);
				creep.pickup(energy[0]);
				creep.memory.loading = false;
			} else {

				var sources = utils.findMiner(creep);
				utils.log('h.sources ' + sources);
				var source = utils.findClosestSource(creep);// creep.room.find(FIND_SOURCES);
				if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
					creep.moveTo(source, {
						visualizePathStyle : {
							stroke : '#ffaa00'
						}
					});
				}
				if (creep.carry.energy == creep.carryCapacity) {
					creep.memory.loading = false;
				}
			}
		} else {
			utils.log('h.delivering');
			var target = utils.findClosest(creep, FIND_CONSTRUCTION_SITES);
			if (target) {
				if (creep.build(target) == ERR_NOT_IN_RANGE) {
					creep.moveTo(target, {
						visualizePathStyle : {
							stroke : '#ffffff'
						}
					});
				}
				if (creep.carry.energy == 0) {
					creep.memory.loading = true;
				}
			}

		}
	}
};

module.exports = roleExplorer;