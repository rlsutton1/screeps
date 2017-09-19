/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('roomDefence');
 * mod.thing == 'a thing'; // true
 */

var roleMiner = require('role.miner');

module.exports = {
	run : function(room) {

		var roomsCreeps = room.find(FIND_MY_CREEPS);

		for ( var name in roomsCreeps) {
			// utils.log('Cpu Used '+Game.cpu.getUsed());
			var creep = roomsCreeps[name];
			try {

				if (creep.memory && creep.memory.role == 'miner') {
					roleMiner.run(creep);
				}
			} catch (err) {
				Game.notify('miner ' + err, 60);
				utils.log(err);
			}
		}

	}

};