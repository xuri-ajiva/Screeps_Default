let defend = require('defend');

let summoner = require('spawer');
let creep_call = require('callcreeps');

require('prototype.spawn')();

module.exports = function (spawn) {
    //let s = require('action.spawnhelper' );
    //s.detectPos(undefined,spawn);
    //s.Build(undefined, spawn, false);

    spawn.memory.stats = [];
    spawn.memory.stats.push("0: " + Game.cpu.getUsed().toFixed(4));
    let c_this = Game.cpu.getUsed();

    spawn.memory.stats.push("init: " + (Game.cpu.getUsed() - c_this).toFixed(4));
    c_this = Game.cpu.getUsed();
    defend.run(spawn.room);

    spawn.memory.stats.push("defend: " + (Game.cpu.getUsed() - c_this).toFixed(4));
    c_this = Game.cpu.getUsed();

    if (Game.time % 255 === 0 || Memory.up > 0) {
        Memory.up--;
        console.log('🈴: ' + Game.time);
        spawn.memory.init = spawn.room.controller.level;
        summoner.Init(spawn);
    }

    spawn.memory.stats.push('_count: ' + (Game.cpu.getUsed() - c_this).toFixed(4));

    c_this = Game.cpu.getUsed();
    summoner.Check(Game, spawn);

    spawn.memory.stats.push('spawner: ' + (Game.cpu.getUsed() - c_this).toFixed(4));
    //let s = require('action.' + SPAWNHELPER);
    //s.detectPos(undefined, spawn);
    //s.Build(undefined, spawn, true);

    ///Game.spawns['Spawn1'].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,ATTACK,CARRY], '_test', {memory: {action: 'ctf'}})
    //Game.spawns['Spawn1'].spawnCreep([MOVE,CARRY,WORK,ATTACK], '_test', {memory: {action: 'ctf'}})

    //Game.spawns['Spawn1'].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,HEAL], '_test'+ Game.time, {memory: {action: 'ctf'}})
    //Game.spawns['Spawn1'].spawnCreep([MOVE,MOVE,MOVE,CARRY,CARRY,CARRY], '_test'+ Game.time, {memory: {action: 'ctf'}})
    /*if (false) {
        Game.spawns['Spawn1'].createCreep([MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, WORK, WORK, WORK], '_claim', {
            global: {
                action: 'GBuildAt',
                memory: {pos: Game.flags['spawn'], struct: STRUCTURE_SPAWN}
            }
        });
    }*/

    let co = {
        miner: [0, 0],
        carry: [0, 0],
        upgrade: [0, 0],
        builder: [0, 0],
        lootcolector: [0, 0],
        repair: [0, 0],
        spawnhelper: [0, 0],
        attack: [0, 0],
        ctf: [0, 0],
        undefined: [0, 0]
    };
    let s_this = Game.cpu.getUsed();

    spawn.memory.stats.push('creeps: ' + (Game.cpu.getUsed() - s_this).toFixed(4));

    let log = '';
    for (let i in co) {
        log += '|' + co[i][1] + '| ' + ((2 - ('' + co[i][1]).length) === 1 ? ' ' : '') + i + ': ' + co[i][0] + "\n";
        //Memory.stats.push(i + ': ' + co[i]);
    }
    //console.log(log + Game.cpu.getUsed().toFixed(4));
    //if(Game.cpu.getUsed().toFixed(4) > 30){
    //    for (let x in Memory.stats){
    //        console.log(x + ': '+Memory.stats[x]+ "\n");
    //    }
    //}


    spawn.memory.stats.push("end: " + Game.cpu.getUsed().toFixed(4));
};