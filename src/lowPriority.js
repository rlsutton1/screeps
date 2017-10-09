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

function placeExtensions(room,utils) {
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
}

function moveEnergy()
{
	    if (Game.rooms.length>1)
	    {
	        var targetTerminal;
	        var sourceTerminal;
	        for ( var room_it in Game.rooms) {
				var room = Game.rooms[room_it];
				var terminals = creep.room.find(FIND_STRUCTURES, {
			        filter: (structure) => {
			            return structure.structureType == STRUCTURE_TERMINAL
			        }
			    });
				if (terminals.lenght>0){
	           
					if (targetTerminal == null){
						targetTerminal = terminals[0];
					}
					if (sourceTerminal == null){
						sourceTerminal = terminals[0];
					}
					if (terminals[0].store[RESOURCE_ENERGY]> sourceTerminal.store[RESOURCE_ENERGY]){
						sourceTerminal = terminals[0];
					}
					if (terminals[0].store[RESOURCE_ENERGY] < targetTerminal.store[RESOURCE_ENERGY]){
						targetTerminal = terminals[0];
					}
	            }
	        }
	        var sourceEnergy = sourceTerminal.store[RESOURCE_ENERGY];
	        var targetEnergy = targetTerminal.store[RESOURCE_ENERGY];
	        var minEnergy = 10000
	        if (sourceEnergy > 2.5*minEnergy)
	        {
	        	if (targetEnergy < minEnergy){
	        		var ret = sourceTerminal.transferEnergy(targetTerminal,minEnergy);
	        		console.log("move energy returned "+ret+" ******************************");
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
			if (room.controller !=null && room.controller.my){
				placeExtensions(room,utils)
			}
			
		}
		
		moveEnergy();

	}

};