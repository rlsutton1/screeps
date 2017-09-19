var roleCourier = {

    /**
	 * @param {Creep}
	 *            creep *
	 */
    run: function(creep) {
        
         creep.say('c');
        utils.log("courier start");
        if (_.filter(creep.room.find (FIND_MY_CREEPS), (creep) =>  creep.memory !=null && creep.memory.role == 'builder').length==0)
        {
             utils.log("check construct road");
            if ((creep.pos.x+creep.pos.y)%2==1)
            {
                creep.room.createConstructionSite(creep.pos, STRUCTURE_ROAD);
            }
        }
        utils.log("after check road");
	    if(creep.carry.energy == 0 || creep.memory.loading) {
	        creep.memory.loading = true;
	        
	        var source = utils.getStoredTarget(creep,'myLoadingTarget');
	        // source = null;
	        if (source == null)
	        {
                var links =creep.room.find(FIND_STRUCTURES, {filter: (i) => i.structureType == STRUCTURE_LINK}); 
                if (links.length>1)
                {
                   // source = creep.pos.findClosestByPath(links);
                }
	        }
	        if (source==null)
	        {
	            utils.log('find miner');
	            source = utils.chooseMiner(creep)[0];
	        }
	        if (source == null)
	        {
	            utils.log('find miner NONE');
	            creep.memory.myLoadingTarget=null;
	        }
	        
	        if (source)
	        {
	            if (source.structureType)
	            {
	                if (creep.withdraw(source) == ERR_NOT_IN_RANGE)
	                {
	                utils.storeTarget(creep,'myLoadingTarget',source);
                    creep.moveTo(source, {reusePath: 10});
	                }
	            }else if(source.transfer(creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
	                utils.storeTarget(creep,'myLoadingTarget',source);
                    creep.moveTo(source, {reusePath: 10});
                }
	            
	        }
            utils.log("courier after source");


            if (creep.carry.energy == creep.carryCapacity)
            {
                creep.memory.loading = false;
                creep.memory.loadingTarget=null;
                creep.memory.myLoadingTarget=null;
            }
            utils.log("courier after energy");

        }
        else {
            creep.memory.miner = null; 
            var target = utils.getStoredTarget(creep,'myTransferTarget');
            if (target==null)
            {
                target = findCreepInNeed(creep)[0];
            }
            
            utils.log('target '+target);
            if(target==null){
                target = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN ||
                                structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                    }
                })[0];
            }
            if(target!=null) {
                utils.storeTarget(creep,'myTransferTarget',target);
                 utils.log('c.25');
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {reusePath: 10});
                }else// if (target.carry.energy == target.energyCapacity)
                {
                    creep.memory.myTransferTarget=null;
                }
            }else
            {
                creep.say('nt '+target);
            }
        }
        utils.log("courier end");

	}
};


function findCreepInNeed(creep)
{
  // return utils.getCreepFromQueue(creep);
    utils.log('Start Find c.CreepInNeed Cpu Used '+Game.cpu.getUsed());

    var candidates = creep.room.find(FIND_CREEPS, {
                    filter: (targetCreep) => {
                        var role = '';
                        if (targetCreep.memory){
                           role = targetCreep.memory.role;
                        } 
// utils.log('target role '+role +' energy '+targetCreep.carry.energy);
                        return  ( creep.memory !=null && (role=='builder' || role=='upgrader'|| role=='builder')) && targetCreep.carry.energy < targetCreep.carryCapacity;
                    }});

    var leastEnergy = 10000000;
    var candidate;
    for (var i in candidates)
    {
        var t = candidates[i];
        if (t.carry.energy < leastEnergy)
        {
            leastEnergy = t.carry.energy;
            candidate = t;
        }
    }
// utils.log('candidate is '+candidate);
    utils.log('End Find c.CreepInNeed Cpu Used '+Game.cpu.getUsed());

    return [candidate];
}

module.exports = roleCourier;