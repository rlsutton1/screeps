var roleUpgrader = {

    /**
	 * @param {Creep}
	 *            creep *
	 */
    run: function(creep) {
        creep.say('u');
        utils.log("u.");
       // utils.addCreepToQueue(creep);
        
        var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_ROAD) && structure.energy < 1000;
                    }
            });
        if(targets.length > 0) {
            if(creep.repair(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
            }
	    }else
            {
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        if (structure.structureType==STRUCTURE_TOWER)
// console.log('tower '+structure.energy+' '+structure.energyCapacity);
                        return (structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity*0.75;
                    }
            });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
	        }else
            {
                if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
    }
};

module.exports = roleUpgrader;