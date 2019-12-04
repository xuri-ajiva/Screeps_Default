const MINER = 'miner';
const BUILDER = 'builder';
const UPGRADE = 'upgrade';
const CARRYER = 'carry';
const ARCHITECT = 'architect';
const REPAIR = 'repair';
const LOOTER = 'lootcolector';
const SPAWNHELPER = 'spawnhelper';
const ATTACKE = 'attack';

module.exports = function () {
    StructureSpawn.prototype.SpawnCustomCreep = function (energy, action, Memory) {
        let newName = action + Game.time;
        let body = CreateBody(energy, action);
        if (Memory) {
            let memory = Object.assign({}, {action: action}, Memory);
            console.log('*: ' + newName + ' =>' + this.spawnCreep(body, newName, {memory}));
        } else {
            console.log('*: ' + newName + ' =>' + this.spawnCreep(body, newName, {memory: {action: action}}));
        }
        return newName;
    };
    /**
     * @return {Array}
     * @param {Number} energy
     * @param {String} action
     **/
    let CreateBody = function (energy, action) {
        let max = energy;
        switch (action) {
            case MINER:
                max = 250;
                return global(energy > max ? max : energy, [{b: WORK, e: 100}, {b: WORK, e: 100}, {b: MOVE, e: 50}]); //done
            case BUILDER:
                max = 500;
                return global(energy > max ? max : energy, [{b: WORK, e: 100}, {b: CARRY, e: 50}, {
                    b: MOVE,
                    e: 50
                }, {b: WORK, e: 100}]);
            case UPGRADE:
                max = 400;
                return global(energy > max ? max : energy, [{b: WORK, e: 100}, {b: MOVE, e: 50}, {b: CARRY, e: 50}]);
            case CARRYER:
                max = 800;
                return global(energy > max ? max : energy, [{b: CARRY, e: 50}, {b: MOVE, e: 50}]);
            case REPAIR:
                max = 400;
                return global(energy > max ? max : energy, [{b: WORK, e: 100}, {b: MOVE, e: 50}, {b: CARRY, e: 50}]);
            case LOOTER:
                max = 250;
                return global(energy > max ? max : energy, [{b: MOVE, e: 50}, {b: WORK, e: 100}, {e: 50}, {
                    b: CARRY,
                    e: 50
                }]);
            case SPAWNHELPER:
                max = 800;
                let base = global((energy > max ? max : energy) - 200, [{b: CARRY, e: 50}, {b: MOVE, e: 50}]);
                base.push(WORK);
                return base;
            case ATTACKE:
                max = 500;
                return global(energy > max ? max : energy, [{b: ATTACK, e: 80}, {b: MOVE, e: 50}]);
            default:
                break;

        }
    };

    /**
     * @return {Array}
     * @description bodyS: [{e: energy, b: body},...] : energy == Number (50 / 100) , body == String (WORk / MOVE)
     * **/

    let global = function (energy, bodyS) {
        let final = [];
        let parts = 0;
        for (let s in bodyS) {
            parts += bodyS[s]['e'];
        }
        parts = Math.floor(energy / parts); //parts <- body parts all cost

        for (let s in bodyS) {
            for (let i = 0; i < parts; i++) {
                final.push(bodyS[s]['b']);
            }
        }
        return final;
    };
    /** @return {Array}
     * @param {Number} energy **/
    let BodyWork = function (energy, exclude) {

    };
    /**
     * @return {Array}
     * @param {Number} energy
     **/
    let BodyCarry = function (energy) {

    };
};