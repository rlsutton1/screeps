/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.defender');
 * mod.thing == 'a thing'; // true
 */


function chooseEnergySource(creep,utils)
{
	var source = utils.getStoredTarget(creep,'source');
	if (source !=null)
	{
		return;
	}
    // source or miner or link or container
    var links =creep.room.find(FIND_STRUCTURES, {filter: (i) => i.structureType == STRUCTURE_LINK || i.structureType == STRUCTURE_CONTAINER}); 
    if (links.length>0)
    {
       source = creep.pos.findClosestByPath(links);
       console.log("using link as source");
       utils.storeTarget(creep,'source',source);
       creep.memory.sourceType = 'link';
       return;
    }
    source = utils.chooseMiner(creep);
    if (source.length>0)
    {
    	utils.storeTarget(creep,'source',source[0]);
        creep.memory.sourceType = 'miner';
    	return;
    }
    source = utils.findClosestSource(creep);
    if (source !=null)
    {
    	utils.storeTarget(creep,'source',source);
        creep.memory.sourceType = 'source';
    	return;
    }

}

function chooseTarget(creep,utils)
{
    // construction site, extension, spawn, tower
	var target = utils.getStoredTarget(creep,'target');
	if (target !=null)
	{
		return;
	}
	
	

	var targets = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_EXTENSION ||
                    structure.structureType == STRUCTURE_SPAWN
                    ) && structure.energy < structure.energyCapacity*0.9;
        }
    });
    if(targets.length > 0) {
        var closest = creep.pos.findClosestByPath(targets);
    
        utils.storeTarget(creep,'target',closest);
		creep.memory.targetType = 'spawn';
        return;
    }
	

    
    var targets = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return structure.structureType == STRUCTURE_TOWER
                     && structure.energy < structure.energyCapacity*0.9;
        }
    });
    if(targets.length > 0) {
        var closest = creep.pos.findClosestByPath(targets);
    
        utils.storeTarget(creep,'target',closest);
		creep.memory.targetType = 'tower';
        return;
    }
	target = utils.findClosest(creep, FIND_CONSTRUCTION_SITES);
	if (target !=null)
	{
		utils.storeTarget(creep, 'target', target);
		creep.memory.targetType = 'construct';
		// fall through to a room controller check
	}
	if (target == null  || creep.room.controller.ticksToDowngrade < 3100)
	{
		utils.storeTarget(creep,'target',creep.room.controller);
		creep.memory.targetType = 'controller';
	}
}

function deliver(creep,utils)
{
    chooseTarget(creep,utils);
	var target = utils.getStoredTarget(creep,'target');
	
	console.log('deliver: target is '+creep.memory.targetType+" "+target)

    if (creep.memory.targetType == 'construct'){
    	if (creep.build(target) == ERR_NOT_IN_RANGE) {
			creep.moveTo(target, {
				visualizePathStyle : {
					stroke : '#ffffff'
				}
			});
    	}
    	return;
    }
	if (creep.memory.targetType == 'controller'){
		 if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
             creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
         }
	   	return;
	}
    if (creep.memory.targetType == 'spawn'){
    	if(creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {reusePath: 10});
    	}else {
    	    creep.memory.target = null;
    	}
    	return;
    }
    if (creep.memory.targetType == 'tower'){
    	if(creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {reusePath: 10});
    	}else
    	{
        	creep.memory.target = null;
    	}
    	return;
    }
    
}


function load(creep,utils)
{
	chooseEnergySource(creep,utils);
	var source = utils.getStoredTarget(creep,'source');
	console.log(creep.memory.sourceType+" at "+source);
	if (creep.memory.sourceType =='link') {
		var result = creep.withdraw(source,RESOURCE_ENERGY);
		console.log('withdraw result '+result);
        if (result == ERR_NOT_IN_RANGE) {
        	creep.moveTo(source, {reusePath: 10});
        }
        return;
	}
	if (creep.memory.sourceType =='miner')	{
		if(source.withdraw(creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source, {reusePath: 10});
		}
		return;
	}
	if (creep.memory.sourceType =='source') {
		if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
			creep.moveTo(source, {reusePath: 10});
		}
		return;
	}
}

var roleOmni = {
    run: function(creep,utils) {
        
        console.log('running omni');
        if (creep.memory.mode == null || creep.carry.energy == 0){
        	creep.memory.mode = 'load';
        	creep.memory.target = null;
        	
        }
        if (creep.carry.energy == creep.carryCapacity)
		{
        	creep.memory.mode = 'deliver';
        	creep.memory.source = null;
		}

        console.log('o '+creep.memory.mode);

        
        if (creep.memory.mode == 'deliver'){
            creep.say('o '+creep.memory.targetType);
        	deliver(creep,utils);
        	
        	// create road only when delivering and the target isn't a construction site
            if (creep.memory.targetType != "construct" && (creep.pos.x+creep.pos.y)%2==1)
            {
                creep.room.createConstructionSite(creep.pos, STRUCTURE_ROAD);
            }

        }
        if (creep.memory.mode == 'load'){
            creep.say('o '+creep.memory.sourceType);
            console.log('calling load ');
        	load(creep,utils);
        }
    }
}

module.exports = roleOmni;
