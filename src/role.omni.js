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
    var links =creep.room.find(FIND_STRUCTURES, {filter: (i) => i.structureType == STRUCTURE_LINK}); 
    if (links.length>1)
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
    source = utils.findClosestSource(crrep);
    if (source !=null)
    {
    	utils.storeTarget(creep,'source'source);
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
	
	target = utils.findClosest(creep, FIND_CONSTRUCTION_SITES);
	if (target !=null)
	{
		utils.storeTarget(creep, 'target', target);
		creep.memory.targetType = 'construct';
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
	
}

function deliver(creep,utils)
{
    var target = chooseTarget(creep,utils);
    if (creep.memory.targetType = 'construct'){
    	if (creep.build(target) == ERR_NOT_IN_RANGE) {
			creep.moveTo(target, {
				visualizePathStyle : {
					stroke : '#ffffff'
				}
			});
    	}
    	return;
    }
    if (creep.memory.targetType = 'spawn'){
    	if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {reusePath: 10});
    	}
    	return;
    }
    if (creep.memory.targetType = 'tower'){
    	if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {reusePath: 10});
    	}
    	return;
    }
    
}


function load(creep,utils)
{
	var source = chooseEnergySource(creep,utils);
	if (creep.memory.sourceType =='link') {
		var result = creep.withdraw(source,RESOURCE_ENERGY);
        if (result == ERR_NOT_IN_RANGE) {
        	creep.moveTo(source, {reusePath: 10});
        }
        return;
	}
	if (creep.memory.sourceType =='miner')	{
		if(source.transfer(creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source, {reusePath: 10});
		}
		return;
	}
	if (creep.memory.sourceType =='source') {
		if(source.harvest(source) == ERR_NOT_IN_RANGE) {
			creep.moveTo(source, {reusePath: 10});
		}
		return;
	}
}

var roleOmni = {
    run: function(creep,utils) {
        
        console.log('running omni');
        creep.say('o');
        if (creep.memory.mode == null || creep.carry.energy == 0){
        	creep.memory.mode = 'load';
        }
        if (creep.carry.energy == creep.carryCapacity)
		{
        	creep.memory.mode = 'deliver';
		}
        if (creep.memory.mode == 'load'){
        	chooseTarget(creep,utils);
        	if (deliver(creep,utils)){
        		creep.memory.mode='deliver';
        	}
        }
        if (creep.memory.mode == 'deliver'){
        	chooseEnergySource(creep,utils);
        	load(creep,utils);
        }
    }
}

module.exports = roleDefender;