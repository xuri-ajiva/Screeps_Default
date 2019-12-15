const act = 'action.';
const MINER = 'miner';
const BUILDER = 'builder';
const UPGRADE = 'upgrade';
const CARRYER = 'carry';
const ARCHITECT = 'architect';
const REPAIR = 'repair';
const LOOTER = 'lootcolector';
const SPAWNHELPER = 'spawnhelper';
const ATTACKE = 'attack';
const CTF = 'ctf';
const CLAIMER = 'claim';
const RENEW = 'renew';

module.exports = {
    Init: function (spw) {
        // spw.memory.VIP = [];
        // let towers = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
        // towers.forEach(tower => spw.memory.VIP.push(tower.id));
        let architect = require('special.architect');
        architect.run(spw.memory.init, spw);

        spw.memory.paths = [];
        let pathsSeg = architect.findPath(spw.memory.init, spw, true);
        for (let ps in pathsSeg) {
            for (let psx in pathsSeg[ps]) {
                spw.memory.paths.push(pathsSeg[ps][psx]);
            }
        }


        if (spw.memory.need_energy === undefined)
            spw.memory.need_energy = [];
        if (spw.memory.query === undefined)
            spw.memory.query = [];

        spw.memory.creeps_count_by_action = {
            miner: 0,
            carry: 0,
            upgrade: 0,
            builder: 0,
            lootcolector: 0,
            repair: 0,
            spawnhelper: 0,
            attack: 0
        };

        let creeps = spw.room.find(FIND_MY_CREEPS);
        for (let it in creeps) {
            let creep = creeps[it];
            spw.memory.creeps_count_by_action[creep.memory.action] += 1;
        }
        //console.log(spw.memory.creeps_count_by_action[SPAWNHELPER]);

        for (let r in spw.energy_sources) {
            for (let s in spw.energy_sources) {
                if (spw.energy_sources[r] < 1) {
                }
            }
        }

        let carryers = _.filter(Game.creeps, (creep) => creep.memory.action === 'carry' && creep.memory.pet != null);
        let pets = [];
        for (let c in carryers) {
            let ca = carryers[c];
            if (pets.includes(ca.memory.pet)) {
                console.log('removing duplicate: ' + ca.memory.pet);
                delete ca.memory.pet;
            } else {
                pets.push(ca.memory.pet);
            }
        }

        if (spw.memory._extentions && spw.memory._extentions[0] === 4) {
            let s = require('action.' + SPAWNHELPER);
            s.Build(undefined, spw, false, ++spw.memory._extentions[2], spw.memory._extentions[2]);
            if (spw.memory._extentions[2] > 12) {
                spw.memory._extentions[2] = -1;
            }
        }

        switch (spw.memory.init) {
            case -1:
                break;
            case 0:
                let s = require('action.' + SPAWNHELPER);
                s.detectPos(undefined, spw);
                break;
            case 1:
                break;
            case 2:
                break;
            case 3:
                break;
            case 4:
                break;
            case 5:
                break;
            case 6:
                break;
            case 7:
                break;
            default:
                spw.memory.init = 0;
        }
    }
}