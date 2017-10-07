// spawn holds 300
// extension holds 50
// MOVE cost is 50
// WORK cost is 100
// CARRY cost is 50

var mySettings =
    {
   
        creepBuildList:
        [
        
        	{
                'role':'omni',
                'qty':3,
                'maxbodyParts': 12,
                'bodyParts': {WORK:0.5,CARRY:0.5},
            	'condition': function(room){ return (room.find(FIND_SOURCES).length * 2) > (_.filter(room.find (FIND_MY_CREEPS), (creep) =>  creep.memory !=null && creep.memory.role == 'omni').length)}
            },
            {
                'role':'defender',
                'qty':1,
                'maxbodyParts': 10,
                'bodyParts': {TOUGH:0.5,ATTACK:0.5},
                'condition': function(room){ return room.memory.underAttack==true|| room.memory.hasInvaders == true}
            }, 
            {
                'role':'healer',
                'qty':2,
                'maxbodyParts': 10,
                'bodyParts': {TOUGH:0.5,HEAL:0.5},
                'condition': function(room){ return room.memory.underAttack==true|| room.memory.hasInvaders == true}
            },
            {
                'role':'miner',
                'qty':6,
                'maxbodyParts': 6,
                'bodyParts': {WORK:0.4,CARRY:0.6},
                'condition': function(room){ return (room.find(FIND_SOURCES).length * 2) > (_.filter(room.find (FIND_MY_CREEPS), (creep) =>  creep.memory !=null && creep.memory.role == 'miner').length)}
            },
            {
                'role':'explorer',
                'qty':0,
                'maxbodyParts': 10,
                'bodyParts': {CLAIM:1,WORK:0.5,CARRY:0.5},
                'condition': function(room){ return _.filter(Game.creeps, (creep) => creep.memory !=null &&  creep.memory.role == 'explorer').length<1;}
            },
            {
                'role':'attacker',
                'qty':0,
                'maxbodyParts': 10,
                'bodyParts': {TOUGH:0.3,ATTACK:0.3,HEAL:0.4},
            	'condition': function(room){ return _.filter(Game.creeps, (creep) => creep.memory !=null && creep.memory.role == 'attacker').length<2 && room.name !='E33N16' &&room.name!='E31N18' }
            },
        	{
            'role':'bouncer',
            'qty':0,
            'maxbodyParts':12,
            'bodyParts': {TOUGH:0.5,HEAL:0.5},
        	'condition': function(room){ return _.filter(Game.creeps, (creep) => creep.memory !=null && creep.memory.role == 'bouncer').length<2 && room.name=='E31N16'}
        }
        ]
    };

 
// test pull 

var utils = require('utils');
var highPriority = require('highPriority');

utils.log('starting up');

 var roomDefence = null;
 for(var room_it in Game.rooms) {
    var room = Game.rooms[room_it];
    
    room.activeLinks =room.find(FIND_STRUCTURES, {filter: (i) => i.structureType == STRUCTURE_LINK}); 

    doTowers(room);
	var ramparts  = room.find(FIND_STRUCTURES, {filter: (i) => i.structureType == STRUCTURE_RAMPART}); ;
   	for (var r in ramparts)
 	{
 		ramparts[r].setPublic(!room.memory.underAttack && !room.memory.hasInvaders);
 	}

    
    if (room.memory.underAttack) {
        if (roomDefence == null){
            roomDefence = require('roomDefence');
        }
        roomDefence.run(room,utils);
    }
    highPriority.run(room,utils);
}

if (Game.time % 100 ==0){  
    require('lowPriority').run(utils);
  
}


    var minBucket = 8500;

    var t =Math.trunc( (Game.cpu.bucket-(minBucket-201)) / 100);
    if (t < 2)
    {
        if (Game.time % 3!=0)
        {
            console.log('skipping 2 of 3 ticks')
            console.log('Cpu Used '+Game.cpu.getUsed()+ " "+Game.cpu.bucket);
            return;
        }
    }else
    if ( Game.time % t==0)
    {
        console.log('skipping 1 of '+t+' ticks, bucket '+Game.cpu.bucket);
        utils.log('Cpu Used '+Game.cpu.getUsed()+ " "+Game.cpu.bucket);
        utils.log("game.time "+Game.time);
        utils.log("Skipping turn to coserve cpu");
        return;
    }
    


    utils.log('request settings');
var roomController = require('roomController');

    utils.log('got settings');
for(var room_it in Game.rooms) {
    var room = Game.rooms[room_it]

    roomController.run(room,mySettings,utils);
    utils.log('room '+room);
}

        utils.log('Cpu Used '+Game.cpu.getUsed()+ " "+Game.cpu.bucket);


    if (Game.cpu.getUsed()> 20)
    {
        utils.emailLogs();
    }

    console.log('Cpu Used '+Game.cpu.getUsed()+ " "+Game.cpu.bucket);
    
    utils.dumpLastException();


function doTowers(room)
{
    utils.log('start tower');
    var towers = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});

    var closestHostile = room.find(FIND_HOSTILE_CREEPS);
 
        room.memory.underAttack = false;
        room.memory.hasInvaders = false;
        room.memory.maxHp +=0.1;
        for (i in towers){
            var tower = towers[i];
            // console.log(tower.energy);
            utils.log('tower '+tower);
            if(tower && tower.energy> 0) 
            {
                var done = false;
                var matchedTarget;
                for (h in closestHostile)
                {
                    var hostile = closestHostile[h];
                    if (hostile.owner.username != 'Cokezero')
                    {
                        utils.log('hostile '+hostile);
                        utils.log('attacking...');
                        matchedTarget = hostile;
                        if (hostile.body.includes(HEAL))
                        {
                            break;
                        }
                    } 
                }
                if (matchedTarget)
                {
                    if (matchedTarget.owner.name)
                    {
                        room.memory.underAttack = true;
                        console.log("Under attack "+matchedTarget.owner.name);
                        utils.notify(room.name+' attackers detected from '+matchedTarget.owner.name,60);
                    }else
                    {
                        room.memory.hasInvaders = true;
                        console.log(room.name+' invaders detected');
                        utils.notify(room.name+' invaders detected',60);
                   }
                    tower.attack(matchedTarget);
                    done =true;
                }
               
                if (!done && tower.energy>tower.energyCapacity/2.0)
                {
                    var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: (structure) => structure.hits < room.memory.maxHp &&  structure.hits < structure.hitsMax*0.9
                            });
                
                    if(closestDamagedStructure) 
                    {
                    	var terrain = Game.map.getTerrainAt(closestDamagedStructure.pos.x,closestDamagedStructure.pos.y,closestDamagedStructure.room.name);
                    	utils.log("terrain "+terrain+" type "+ closestDamagedStructure.structureType);
                    	if (terrain== "swamp" ||closestDamagedStructure.structureType != STRUCTURE_ROAD)
                    	{	
                    		utils.log('repairing ....');
                    		tower.repair(closestDamagedStructure);
                    		break;
                    	}
                    	else
                    	{
                    		console.log("detroying ");
                    		closestDamagedStructure.destroy();
                    	}
                    }
                }
            }
        }
    utils.log('towers done');
}




