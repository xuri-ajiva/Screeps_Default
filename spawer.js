const MINER = 'miner';
const BUILDER = 'builder';
const UPGRADE = 'upgrade';
const CARRYER = 'carry';

var spawnner = {
    Check: function (game) {
        function spawn(obj, ls) {
            var newName = obj + Game.time;
            console.log('Spawning new ' + obj + 'er: ' + newName + "  => " + Memory.Spw.spawnCreep(ls, newName, {memory: {action: obj}}));
        }


        for (let name in Memory.creeps) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
            }
        }

        let miners = _.filter(Game.creeps, (creep) => creep.memory.action == MINER);
        let carryers = _.filter(Game.creeps, (creep) => creep.memory.action == CARRYER);
        let upgraderes = _.filter(Game.creeps, (creep) => creep.memory.action == UPGRADE);

        //console.log(MINER + "s: " + miners.length + "          " + CARRYER + "ers: " + carryers.length);

        Memory.ftee_carry = carryers.filter(function (s) {
            return s.memory._owner == undefined
        });
        //console.log("unTaken: " + Memory.ftee_carry.length);
        //Spawner
        if (Memory.Spw.store[RESOURCE_ENERGY] > 250 && !Memory.Spw.spawning) {
            if (miners.length < 1) {

                /*var newName = MINER + Game.time;
                console.log('Spawning new ' + MINER + ': ' + newName);
                Memory.Spw.spawnCreep([WORK, MOVE, WORK], newName, {memory: {action: MINER}});*/
                spawn(MINER, [WORK, MOVE, WORK])
            } else if (carryers.length < 1) {
                /*var newName = CARRYER + Game.time;
                console.log('Spawning new ' + CARRYER + 'er: ' + newName);
                Memory.Spw.spawnCreep([MOVE, MOVE, CARRY, CARRY], newName, {memory: {action: CARRYER}});*/
                spawn(CARRYER, [MOVE, MOVE, CARRY, CARRY])
            } else if (miners.length < 2) {
                spawn(MINER, [WORK, MOVE, WORK])
            } else if (carryers.length < 5) {
                spawn(CARRYER, [MOVE, MOVE, CARRY, CARRY])
            } else if (upgraderes.length < 4) {
                spawn(UPGRADE,[MOVE, CARRY, WORK])
                /*var newName = UPGRADE + Game.time;
                console.log('Spawning new ' + UPGRADE + ': ' + newName);
                Memory.Spw.spawnCreep([MOVE, CARRY, WORK], newName, {memory: {action: UPGRADE}});*/
            }
        }

    }

};

module.exports = spawnner;