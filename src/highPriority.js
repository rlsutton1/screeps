/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('roomDefence');
 * mod.thing == 'a thing'; // true
 */

var roleMiner = require('role.miner');
var roleDefender = require('role.defender');
var roleAttacker = require('role.attacker');


module.exports = {
	run : function(room, utils) {

		var roomsCreeps = room.find(FIND_MY_CREEPS);

		for ( var name in roomsCreeps) {
			// utils.log('Cpu Used '+Game.cpu.getUsed());
			var creep = roomsCreeps[name];
			try {

				if (creep.memory != null && creep.memory.role == 'miner') {
					roleMiner.run(creep, utils);
				}
				if (creep.memory != null && creep.memory.role == 'attacker') {
					roleAttacker.run(creep, utils);
				}
	
				if (creep.memory != null && creep.memory.role == 'defender') {
					roleDefender.run(creep,utils);
				}
			} catch (err) {
				utils.storeException(err);
				utils.notify('miner ' + err, 60);
				utils.log(err);
			}
		}

	}

};