/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.defender');
 * mod.thing == 'a thing'; // true
 */

var roleBouncer = {
	run : function(creep, utils) {

		
		//Game.flags.AttackRoom
		
		
		
		console.log('running bouncer');
		creep.say('bb');
		
		if (!creep.memory.reachedWayPoint){
    		creep.moveTo(Game.flags.wayPoint);
		}
		if (!creep.memory.reachedWayPoint 
		    && creep.room.id == 
		    Game.flags.wayPoint.room.id)
		{
		    creep.memory.reachedWayPoint = true;
		}
		

		if (creep.hits < creep.hitsMax)
		{
			creep.moveTo(Game.flags.bounceSafe);
		}else
		if (Game.flags.bounce.room == null || creep.room.name != Game.flags.bounce.room.name)
		{
			creep.moveTo(Game.flags.bounce);
		}
		creep.heal(creep);
 
	}
}

module.exports = roleBouncer;