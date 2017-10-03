var roleHarvester = {

    /**
	 * @param {Creep}
	 *            creep *
	 */
    run: function(creep,utils) {
        creep.say('h');
        utils.log("h. "+creep.memory.action);
        
        
        if(creep.carry.energy < creep.carryCapacity) {
       // creep.memory.action = null;
            utils.log('checking action '+creep.memory.action);
            if (!creep.memory.action || creep.memory.action == null || creep.memory.action == 'deliver')
            {
                utils.log('choose miner');
                creep.memory.action = null;
                var sources = utils.chooseMiner(creep);
                utils.log('h.sources '+sources);
                if (sources[0])
                {
                    utils.log("chose a miner");
                    creep.memory.action='loadMiner';  
                    utils.storeTarget(creep,'myLoadingTarget',sources[0]);
                }else
                {
                    utils.log("Chose a source");
                    var source = utils.findClosestSource(creep);
                    utils.storeTarget(creep,'myLoadingTarget',source);
                    creep.memory.action='loadSource';
                }
            }
            if (creep.memory.action == 'loadMiner')
            {
                var target = utils.getStoredTarget(creep,'myLoadingTarget');
                if (!target)
                {
                    creep.memory.action = null;
                }else
                {
                    if(target.withdraw(creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {reusePath: 10});
                    }
                }
            }
            if (creep.memory.action == 'loadSource')
            {
                var target = utils.getStoredTarget(creep,'myLoadingTarget');
                if(creep.harvest(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {reusePath: 10});
                }
            }
        }else
        {
            if (creep.memory.action != 'deliver' && creep.memory.action != 'upgrade')
            {
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN
                                || structure.structureType == STRUCTURE_TOWER
                                ) && structure.energy < structure.energyCapacity*0.9;
                    }
                });
                if(targets.length > 0) {
                    var closest = creep.pos.findClosestByPath(targets);
                
                    utils.storeTarget(creep,'myLoadingTarget',closest);
                    creep.memory.action ='deliver';
                }
                else
                {
                    creep.memory.action = 'upgrade';
                }
                
            }
            
            if (creep.memory.action == 'deliver')
            {
                if(creep.withdraw(closest, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(closest, {reusePath: 10});
                }else
                {
                    creep.memory.action = null;
                }
                
            }else
            {
                 if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller, {reusePath: 10});
                }else
                {
                    creep.memory.action = null;
                }
                
            }
            
            
        }
	}
};



module.exports = roleHarvester;