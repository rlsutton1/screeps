/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('utils');
 * mod.thing == 'a thing'; // true
 */

var loghistory = '';

var logf = function(value)
{
    var message = 'Cpu Used '+Game.cpu.getUsed()+" "+value;
    loghistory += message+'\n';
    console.log(message);
}

var utilz = {

findClosestSource: function(creep)
{
    var sources = creep.room.find(FIND_SOURCES);
    var closest = creep.pos.findClosestByPath(sources);
 // module.exports.log('closets is '+closest);
    return closest;
},
findClosest: function(creep, sourceType)
{
    var sources = creep.room.find(sourceType);
    var closest = creep.pos.findClosestByPath(sources);
    logf('closets is '+closest);
    return closest;
},

findMiner: function(creep)
{
     logf('Start Find Miner Cpu Used '+Game.cpu.getUsed());

    var candidates = creep.room.find(FIND_CREEPS, {
                    filter: (targetCreep) => {
                        return  targetCreep.memory.role=='miner' && targetCreep.energy == targetCreep.energyCapacity;
                    }})
                    
    var mostEnergy = 0;
    var candidate;
    for (var i in candidates)
    {
        var t = candidates[i];
        if (t.carry.energy > mostEnergy)
        {
            mostEnergy = t.carry.energy;
            candidate = t;
        }
    }
    logf('End FInd Miner Cpu Used '+Game.cpu.getUsed());

    return [candidate];
},

getStoredTarget: function(creep,token)
{
    
	logf('getting stored target '+creep.memory[token]);
    return Game.getObjectById(creep.memory[token]);
},

storeTarget: function(creep,token,target)
{
    if (target == null)
    {
        creep.memory[token]=null;        
    }else
    {
        creep.memory[token]=target.id;
    }
        
},
log: function(value)
{
   logf(value);
},
emailLogs: function()
{
  console.log(loghistory);  
},
notify: function(message)
{
    if (Game.bucket !=null) {
        Game.notify(message,60); 
    }else
    {
        console.log('Notify: '+message);
    }
},
chooseMiner: function(creep)
{
    console.log('chooseMiner for '+creep.id);
    // get the stored miner
    // creep.memory.miner = null;
    if (creep.memory.miner)
    {
        var ret = Game.getObjectById(creep.memory.miner);
        if (ret)
        {
            // return the stored miner
            return [ret];
        }
    }
    
    // get the list of miners
    var candidates = creep.room.find(FIND_CREEPS, {
        filter: (targetCreep) => {
            return targetCreep.memory && targetCreep.memory.role=='miner';
        }})
    
  
    // find the miner with the least consumers
    var lastUsed = Game.time;
    var candidate;
    for (var i in candidates)
    {
        var t = candidates[i];
        if (t.memory.lastUsed==null)
        {
            t.memory.lastUsed = 0;
        }
        if (t.memory.lastUsed < lastUsed)
        {
            lastUsed = t.memory.lastUsed;
            candidate = t;
        }
    }
    
    // store the miner and add the creep to the miners list of consumers
    if (candidate){
        creep.memory.miner = candidate.id;
        candidate.memory.lastUsed = Game.time;
    }
    // return the miner
    if (candidate == null)
    {
        return [];
    }
    return [candidate];
    
}


};

module.exports = utilz;