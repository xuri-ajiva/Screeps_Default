let defend = require('spawn.defend');

let summoner = require('spawer');
let creep_call = require('callcreeps');

require('prototype.spawn')();

module.exports = function (spawn) {
    spawn.memory.stats = [];

    spawn.memory.stats.push("0: " + Game.cpu.getUsed().toFixed(4));
    //let s = require('action.spawnhelper' );
    //s.detectPos(undefined,spawn);
    //s.Build(undefined, spawn, false);

    let c_this = Game.cpu.getUsed();
    spawn.memory.stats.push("defend: " + (Game.cpu.getUsed() - c_this).toFixed(4));
    defend.run(spawn.room, spawn);

    c_this = Game.cpu.getUsed();
    spawn.memory.energy_sources = {};
    let sources = spawn.room.find(FIND_SOURCES);
    for (let x in sources)
        spawn.memory.energy_sources[sources[x].id] = 0;
    spawn.memory.stats.push("init: " + (Game.cpu.getUsed() - c_this).toFixed(4));


    c_this = Game.cpu.getUsed();
    if (Game.time % 255 === 0 || Memory.up > 0) {
        Memory.up--;
        console.log('🈴: ' + Game.time);
        spawn.memory.init = spawn.room.controller.level;
        summoner.Init(spawn);
    }
    spawn.memory.stats.push('mod: ' + (Game.cpu.getUsed() - c_this).toFixed(4));

    c_this = Game.cpu.getUsed();
    summoner.Check(Game, spawn);
    spawn.memory.stats.push('spawner: ' + (Game.cpu.getUsed() - c_this).toFixed(4));

    spawn.memory.stats.push("end: " + Game.cpu.getUsed().toFixed(4));
};