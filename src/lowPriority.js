/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('roomDefence');
 * mod.thing == 'a thing'; // true
 */

//var roleMiner = require('role.miner');
function createExtension(room, x, y, utils) {
	if ((x + y) % 2 == 0) {
		utils.log('building extension at ' + x + ' ' + y);
		if (room.createConstructionSite(x, y, STRUCTURE_EXTENSION) == OK) {
			return 1;
		}
	}
	return 0;
}

function createMoreExtensions(ctr, extensions, exts, room) {
	return ctr > 3 || room.find(FIND_CONSTRUCTION_SITES).length > 2
			|| (ctr + extensions.length) > exts[room.controller.level];
}

function placeExtensions(room) {
	var exts = [ 0, 0, 5, 10, 20, 30, 40, 50, 60 ];
	
	var extensions = room.find(FIND_MY_STRUCTURES, {
		filter : {
			structureType : STRUCTURE_EXTENSION
		}
	});
	if (room.controller !=null){
		var max = exts[room.controller.level];
		var spawn = room.find(FIND_MY_SPAWNS)[0];
		if (spawn !=null){
			var pos = spawn.pos;
			var ctr = 0;
			for (var radius = 2; radius <= 20;radius++)
			{ 	for (var c = 0; c <= radius;c++)
				{
					var x = radius;
					var y = c;
					ctr += createExtension(room, pos.x + x, pos.y + y, utils);
					if (createMoreExtensions(ctr, extensions, exts, room)) {
						return;
					}

					x = radius;
					y = -c;
					ctr += createExtension(room, pos.x + x, pos.y + y, utils);
					if (createMoreExtensions(ctr, extensions, exts, room)) {
						return;
					}

					x = -radius;
					y = c;
					ctr += createExtension(room, pos.x + x, pos.y + y, utils);
					if (createMoreExtensions(ctr, extensions, exts, room)) {
						return;
					}

					x = -radius;
					y = -c;
					ctr += createExtension(room, pos.x + x, pos.y + y, utils);
					if (createMoreExtensions(ctr, extensions, exts, room)) {
						return;
					}


					y = radius;
					x = c;
					ctr += createExtension(room, pos.x + x, pos.y + y, utils);
					if (createMoreExtensions(ctr, extensions, exts, room)) {
						return;
					}

					y = radius;
					x = -c;
					ctr += createExtension(room, pos.x + x, pos.y + y, utils);
					if (createMoreExtensions(ctr, extensions, exts, room)) {
						return;
					}

					y = -radius;
					x = c;
					ctr += createExtension(room, pos.x + x, pos.y + y, utils);
					if (createMoreExtensions(ctr, extensions, exts, room)) {
						return;
					}

					y = -radius;
					x = -c;
					ctr += createExtension(room, pos.x + x, pos.y + y, utils);
					if (createMoreExtensions(ctr, extensions, exts, room)) {
						return;
					}
				}
			}
		}
}


module.exports = {
	run : function(utils) {

		utils.log('start memory clear');
		for ( var name in Memory.creeps) {
			if (!Game.creeps[name]) {
				delete Memory.creeps[name];
				utils.log('Clearing non-existing creep memory:', name);
			}
		}
		utils.log('memory clear done');


		for ( var room_it in Game.rooms) {
			var room = Game.rooms[room_it];
			if (room.controller.my){
				placeExtensions(room)
			}
			
		}

	}

};