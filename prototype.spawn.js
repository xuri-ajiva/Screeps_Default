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
    /**
     * @return {String} Name
     * @param {Number} energy
     * @param {String} action
     * @param {Map} _Memory
     **/
    StructureSpawn.prototype.SpawnCustomCreep = function (energy, action, _Memory) {
        if (energy < 200) return undefined;
        let newName = action + Game.time;
        let body = CreateBody2(energy, action);
        if (_Memory) {
            let memory = Object.assign({}, {action: action}, _Memory);
            console.log('*: ' + newName + ' =>' + this.spawnCreep(body, newName, {
                memory
            }));
            //let str = JSON.stringify(memory, null, 4); // (Optional) beautiful indented output.
            //console.log(str); // Logs output to dev tools console.
        } else {
            //let str = JSON.stringify(body, null, 4); // (Optional) beautiful indented output.
            //console.log(str); // Logs output to dev tools console.
            console.log('* -: ' + newName + ' =>' + this.spawnCreep(body, newName, {memory: {action: action}}));
        }
        console.log('Spawning: ' + newName);
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
                max = 400;
                return global(energy > max ? max : energy, [{b: CARRY, e: 50}, {b: MOVE, e: 50}]);
            case REPAIR:
                max = 400;
                return global(energy > max ? max : energy, [{b: WORK, e: 100}, {b: MOVE, e: 50}, {b: CARRY, e: 50}]);
            case LOOTER:
                max = 250;
                return global(energy > max ? max : energy, [{b: MOVE, e: 50}, {b: WORK, e: 100}, {
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

    let CreateBody2 = function (energy, action) {
        let max = energy;
        switch (action) {
            case MINER:
                return global2(150, 550, energy, [WORK, MOVE], energy > 300 ? [WORK] : undefined); //done
            case BUILDER:
                return global2(300, 600, energy, [WORK, CARRY, WORK, MOVE]); //done
            case UPGRADE:
                return global2(200, 400, energy, [WORK, MOVE, CARRY], energy > 300 ? [WORK] : undefined); //done
            case CARRYER:
                return global2(100, 400, energy, [MOVE, CARRY]); //done
            case REPAIR:
                return global2(200, 500, energy, [WORK, MOVE, CARRY], energy > 300 ? [WORK] : undefined); //done
            case LOOTER:
                return global2(200, 300, energy, [MOVE, CARRY], energy > 300 ? [MOVE] : undefined); //done
            case SPAWNHELPER:
                return global2(200, 800, energy, [MOVE, CARRY], [WORK]); //done
            case ATTACKE:
                return global2(200, 500, energy, [ATTACK, MOVE, TOUGH,TOUGH]); //done
            default:
                console.log('⚠: Unknown Action Pleas Configure: action.' + action);
                break;
        }
    };


    /**
     * @return {Array}
     * @description bodyS: [{e: energy, b: body},...] : energy == Number (50 / 100) , body == String (WORk / MOVE)
     * **/

    let get_cost = function (body_part) {
        return BODYPART_COST[body_part];
    };

    let global2 = function (min_energy, max_energy, energy, bodyS, add_final) {
        if (energy < min_energy) return [];
        if (energy > max_energy) energy = max_energy;

        let result = [];
        let final_cost = 0;

        if (add_final) {
            for (let b in add_final) {
                final_cost += get_cost(add_final[b]);
                result.push(add_final[b]);
            }
        }

        energy -= final_cost;
        if (energy <= 0) return [];


        let cost = 0;
        for (let s in bodyS) {
            cost += get_cost(bodyS[s]);
        }

        if (cost > energy) return;
        let parts = (energy / cost); //parts <- body parts all cost

        for (let s in bodyS) {
            for (let i = 0; i < parts; i++) {
                result.push(bodyS[s]);
            }
        }
        return result;
    };

    /**
     * @return {Array}
     * @description bodyS: [{e: energy, b: body},...] : energy == Number (50 / 100) , body == String (WORk / MOVE)
     * **/
    let global = function (energy, bodyS) {

        let final = [];
        let cost = 0;
        for (let s in bodyS) {
            cost += bodyS[s]['e'];
        }

        let parts = (energy / cost); //parts <- body parts all cost
        if (cost > energy) return;
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