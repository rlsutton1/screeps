/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('roomDefence');
 * mod.thing == 'a thing'; // true
 */

var roleDefender = require('role.defender');
var roleHealer = require('role.healer');


module.exports = {
    run:function (room,utils) {
    
        var roomsCreeps = room.find (FIND_MY_CREEPS);

        for(var name in roomsCreeps) {
// utils.log('Cpu Used '+Game.cpu.getUsed());
            var creep = roomsCreeps[name];
            try
            {
                
                if( creep.memory !=null  && creep.memory.role == 'defender') {
                    roleDefender.run(creep);
                }
                if( creep.memory !=null && creep.memory.role == 'healer') {
                    roleHealer.run(creep);
                }
            }
            catch (err)
            {
                Game.notify('defence: '+err,60);
                utils.log(err);
            }
        }
        
        
        var walls = room.find(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_WALL || s.structureType == STRUCTURE_RAMPART});
        for (let wall of walls) {
            if (wall.hits <= 10000) {
                utils.notify("Activating safe mode "+wall.pos+ " Tick "+Game.time );
                console.log("Activating safe mode "+wall.pos+ " Tick "+Game.time );
                room.controller.activateSafeMode();
                break;
            }
        }
    }

};