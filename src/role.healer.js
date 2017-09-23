/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.healer');
 * mod.thing == 'a thing'; // true
 */


var roleHealer = {
    run: function(creep,utils) {
        creep.say('hh');
// console.log("healer");
        
        var defender = utils.getStoredTarget(creep,'defenderTarget');
	    if (defender==null) {
            var defenders = _.filter(creep.room.find (FIND_MY_CREEPS), (creep) => creep.memory !=null && creep.memory.role == 'defender')
            defender = creep.pos.findClosestByPath(defenders);
        }
        if (defender !=null) {
            utils.storeTarget(creep,'defenderTarget',defender);
            if(creep.rangedHeal(defender) == ERR_NOT_IN_RANGE) {
                creep.moveTo(defender, {reusePath: 10});
            }
        }

    }
}

module.exports = roleHealer;