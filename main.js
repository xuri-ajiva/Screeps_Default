let sM = require('MainPerSpawn');

module.exports.loop = function () {

    for (let sp in Game.spawns)
        sM(Game.spawns[sp]);

    for (var c_name in Game.creeps) {
        var creep = Game.creeps[c_name];
        //creep.suicide();

        if (creep) {
            c_this = Game.cpu.getUsed();

            switch (creep.memory.action) {

            }
        }
    }
};

