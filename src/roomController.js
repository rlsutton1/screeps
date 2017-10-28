/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('roomController');
 * mod.thing == 'a thing'; // true
 */


var roleHarvester = null;// require('role.harvester');
var roleUpgrader = null;//require('role.upgrader');
var roleBuilder = null;//require('role.builder');
var roleCourier = null;//require('role.courier');
var roleExplorer = require('role.explorer');
var roleHealer = require('role.healer');
var roleOmni = require('role.omni');

var spawnFuct = function spawn(buildInfo,spawn,utils)
{
   
    var maxParts = buildInfo['maxbodyParts'];
    for (var parts = maxParts; parts > 0;parts--)
    {
    	var body = [];
    	var ctr = 0;
        		
    	for (var part in buildInfo['bodyParts'])
    	{
    		var partCount = buildInfo['bodyParts'][part];
    		utils.log("part count "+partCount);
    		var qty = partCount*parts;
    		utils.log(part+" "+qty+" "+maxParts);
    		for (var i =0;i < qty;i++)
    		{
    			body[ctr++] = part.toLowerCase();
    			body[ctr++] = MOVE;
    		}
    	}
    	utils.log(body);
    	var newName = spawn.createCreep(body, undefined, {role: buildInfo['role']});
        if (newName.length>2)
        {
            utils.log('Spawning new '+ buildInfo['role']+': ' + newName);
            utils.log("qty "+buildInfo.qty);
            utils.log("bodyParts "+buildInfo.bodyParts);
            return true;
        }
    }
    utils.log("Not spawning "+buildInfo['role']+" due to "+newName);
    return false;
}

module.exports = {
    


run:function (room,mySettings,utils) {




 utils.log('Tick limit '+Game.cpu.limit);
 
  
    var links =room.activeLinks; 
    if (links.length>1)
    {
        var targetLink;
        var sourceLink;
        for (var i in links){
            var link = links[i];
            if (targetLink == null){
                targetLink = link;
            }
            if (sourceLink == null){
                sourceLink = link;
            }
            if (link.energy> sourceLink.energy){
                sourceLink = link;
            }
            if (link.energy < targetLink.energy){
                targetLink = link;
            }
        }
        if (targetLink.energy < targetLink.energyCapacity*0.8){
            sourceLink.transferEnergy(targetLink,(sourceLink.energy-targetLink.energy)/2.0);
        }
    }
   
    
       
        var controller = room.controller;
        var roomsCreeps = room.find (FIND_MY_CREEPS);

  
       utils.log("start room");
  
        var spawn = room.find(FIND_MY_SPAWNS)[0];
        var omnis = _.filter(roomsCreeps, (creep) =>  creep.memory !=null && creep.memory.role == 'omni');

        if (!room.memory.nextSpawn){
            room.memory.nextSpawn = Game.time+100;
            room.memory.spawnIndex = 0;
            room.memory.spawnPlan =  ['omni','miner','omni','miner','omni','miner','omni','miner'];
        }
        utils.loggingOn();
        if (spawn && !spawn.spawning && room.controller.my){
        	//spawn.say(Game.time - room.memory.nextSpawn)
        	
        	spawn.room.visual.text(
        			 room.memory.nextSpawn - Game.time ,
                   spawn.pos.x + 1, 
                   spawn.pos.y, 
                   {align: 'left', opacity: 0.8});
        	
            if (room.memory.nextSpawn < Game.time)
            {
                var spawnPlan= room.memory.spawnPlan;
                var spawnType = spawnPlan[room.memory.spawnIndex];
                console.log('spawn type '+spawnType);
                for (var role in mySettings['creepBuildList'])
                {
                    var buildInfo = mySettings['creepBuildList'][role];
         
                    if (buildInfo.role == spawnType){
                        console.log('room ' +room.name);
                        if (spawnFuct(buildInfo,spawn,utils))
                        {
                        	
                            room.memory.nextSpawn += (1500/spawnPlan.length) - (Math.random()*5);
                            room.memory.nextSpawn = Math.floor(room.memory.nextSpawn);
                            room.memory.spawnIndex = (room.memory.spawnIndex + 1)% spawnPlan.length;
                        }
                        break;
                    }
                }
            }
            
        }
        utils.loggingOff();

        if (spawn && !spawn.spawning){// && (spawn.energy >= spawn.energyCapacity || omnis.length == 0)){
        	var spawnDone =false;
            for (var role in mySettings['creepBuildList'])
            {
                var buildInfo = mySettings['creepBuildList'][role];
         
                var creeps = _.filter(roomsCreeps, (creep) =>  creep.memory !=null && creep.memory.role == buildInfo['role']);
       
              // utils.log(buildInfo['role']+' in existance: '+
				// creeps.length+'/'+buildInfo.qty);
       
                var condition = buildInfo.condition;
                var shouldBuild = true;
                if (condition)
                {
                    shouldBuild = condition(room);
                }
       
                if(creeps.length <buildInfo.qty && shouldBuild) 
                {
                 	if (spawnFuct(buildInfo,spawn,utils))
                 	{
                 		break;
                 	}
                }
            }
        

   
            utils.log("before spawn");

    
            if(spawn.spawning) { 
                var spawningCreep = Game.creeps[spawn.spawning.name];
                spawn.room.visual.text(
                     spawningCreep.memory.role,
                    spawn.pos.x + 1, 
                    spawn.pos.y, 
                    {align: 'left', opacity: 0.8});
            }
        }

        room.memory.maxHp +=0.5;

        utils.log("before creeps");
        for(var name in roomsCreeps) {
// utils.log('Cpu Used '+Game.cpu.getUsed());
            var creep = roomsCreeps[name];
            try
            {
                if ( creep.memory !=null && creep.fatigue<= 0)
                {
                    if(creep.memory.role == 'harvester') {
                        roleHarvester.run(creep,utils);
                    }
                    if(creep.memory.role == 'upgrader') {
                        roleUpgrader.run(creep,utils);
                    }
                    if(creep.memory.role == 'builder') {
                        roleBuilder.run(creep,utils);
                    }
                    if (creep.memory.role == 'courier')
                    {   
                        roleCourier.run(creep,utils);
                    }
                    if (creep.memory.role=='explorer')
                    {
                        roleExplorer.run(creep,utils);
                    }
                    if(creep.memory.role == 'healer') {
                        roleHealer.run(creep,utils);
                    }
                    if(creep.memory.role == 'omni') {
                        roleOmni.run(creep,utils);
                    }
                }
            }
            catch (err)
            {
            	utils.storeException(err);
                utils.notify(err,60);
                utils.log(err);
            }
        }
    
    utils.log("after creeps");
    utils.log("game.time "+Game.time);
    utils.log('');
}
    
};

