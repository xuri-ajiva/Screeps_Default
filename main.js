const G_MoveTo = 'GMoveTo';
const G_HandOver = 'GHandOver';
const G_BuildAt = 'GBuildAt';


let sM = require('MainPerSpawn');
let over_room = require('actions.room');

module.exports.loop = function () {

    function reset_mem(creep) {

    }

    let c = false;
    for (let c_name in Game.creeps) {
        let creep = Game.creeps[c_name];
        //creep.suicide();

        if (creep) {
            if (creep.name == '_claim') {
                c = true;
            }
            if (creep.memory.global !== undefined) {
                creep.say('l')
                let global_action = creep.memory.global['action'];
                let global_memory = creep.memory.global['memory'];
                let pos = global_memory['pos'];
                //if (global_memory['pos'])
                //   pos = new RoomPosition(global_memory['pos'].x, global_memory['pos'].y, global_memory['pos'].room);

                switch (global_action) {
                    case G_HandOver:
                        creep.moveTo(pos);
                        if (creep.pos.room === pos.pos.room)
                            reset_mem(creep);
                        break;
                    case G_MoveTo:
                        creep.moveTo(pos);
                        if (creep.pos.getRangeTo(pos.pos) < 3)
                            reset_mem(creep);
                        break;
                    case G_BuildAt:
                        //go in room and claim controller
                        creep.say('1');
                        if (over_room.move_in_room(creep, global_memory['pos'].pos.roomName, pos) === ERR_NOT_IN_RANGE) break;
                        creep.say('2');
                        if (over_room.claim_controller(creep) === ERR_NOT_IN_RANGE) break;
                        creep.say('3');
                        //if (over_room.create_construction_site(global_memory['struct'], pos,creep) === ERR_NOT_IN_RANGE) break;
                        creep.say('4');

                        switch (global_memory.state) {
                            case 0:
                                if (creep.store[RESOURCE_ENERGY] === 0) {
                                    global_memory.state = 1;
                                } else {
                                    global_memory.state = 2;
                                }
                                break;
                            case 1:
                                let mine = require('action.miner');
                                mine.run(creep, Game.spawns['Spawn1'], false);
                                if (creep.store.getFreeCapacity() === 0) {
                                    global_memory.state = 2;
                                }
                                break;
                            case 2:
                                let build = require('action.builder');
                                build.run(creep, Game.spawns['Spawn1']);
                                if (creep.store.getUsedCapacity() === 0) {
                                    global_memory.state = 1;
                                }
                                break;
                            default:
                                global_memory.state = 0;
                                break;
                        }

                        //creep.say('5');
                        break;
                    default:
                        console.log('⚠: Global Action Unknown!');
                        break;
                }


            }
        }
    }

let l = 0;
    for (let sp in Game.spawns) {
        sM(Game.spawns[sp]);
        l++;
    }


    if (!c && l < 2) Game.spawns['Spawn1'].createCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, WORK, WORK, WORK], '_claim', {
        global: {
            action: 'GBuildAt',
            memory: {pos: Game.flags['spawn'], struct: STRUCTURE_SPAWN}
        }
    });

};

