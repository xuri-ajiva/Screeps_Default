// require staff
let creep_call = require('callcreeps');
let sM = require('spawn.mainLoop');
let test = require('testclass');
let links = require('structure.link');

module.exports.loop = function () {
    
    console.log(1);
    
    //test class
    test.test1();
    test.expald();


    //call all spawns
    let l = 0;
    for (let sp in Game.spawns) {
        //console.log(Game.spawns[sp]);
        sM(Game.spawns[sp]);
        l++;
        //links
        //links.check(Game.spawns[sp].room);
        //test.createWalls(Game.spawns[sp].room);
        //var ini  = require('Init');
        //console.log(ini);
        //ini.Init(sp);
    }


    //Call creeps actions
    creep_call.call();

    //check my invation
    /*if (c < 3 && l < 2) Game.spawns['Spawn1'].createCreep([MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, WORK, WORK, WORK], 'claim' + Game.time, {
        global: {
            action: 'GBuildAt',
            memory: {pos: Game.flags['spawn'], struct: STRUCTURE_SPAWN}
        }
    });*/



    for (let name in Memory.creeps)
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            //console.log('✝: ' + name);
        }

};

