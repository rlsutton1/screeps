var roleMiner = {

    /**
	 * @param {Creep}
	 *            creep *
	 */
    run: function(creep,utils) {
        utils.log("m.");
        creep.say('m');
        if (creep.carry.energy < creep.carryCapacity)
        {
            var source = utils.getStoredTarget(creep,'myLoadingTarget');
	        if (source ==null)
	        {
                source = utils.findClosestSource(creep);
                utils.storeTarget(creep,'myLoadingTarget',source);
            }
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.say('miner - looking');
                    creep.moveTo(source, {reusePath: 10});
            }else
            {
                if (creep.carry.energy > creep.carryCapacity/2.0){
                    var links =creep.room.find(FIND_STRUCTURES, {filter: (i) => i.structureType == STRUCTURE_LINK}); 
                    if (links.length>1)
                    {
                        for (var i in links)
                        {
                            var link = links[i];
                            creep.transfer(link,RESOURCE_ENERGY,creep.carry.energy - creep.carryCapacity/2.0);
                        }
                    }
                }

            }
        }else
        {
        	if (creep.carry.energy > creep.carryCapacity/2.0){
                var links =creep.room.find(FIND_STRUCTURES, {filter: (i) => i.structureType == STRUCTURE_LINK}); 
                if (links.length>1)
                {
                    for (var i in links)
                    {
                        var link = links[i];
                        creep.transfer(link,RESOURCE_ENERGY,creep.carry.energy - creep.carryCapacity/2.0);
                    }
                }
            }
        }
	}
};


module.exports = roleMiner;