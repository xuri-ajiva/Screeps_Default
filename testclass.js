const G_MoveTo = 'GMoveTo';
const G_HandOver = 'GHandOver';
const G_BuildAt = 'GBuildAt';
const G_ClaimController = 'GClaimCo';
const G_Recycle = 'GRecycle';


let over_room = require('actions.room');
module.exports = {


    test1: function () {
        let c = 0;
        for (let c_name in Game.creeps) {
            let creep = Game.creeps[c_name];
            //creep.suicide();
            let spawn = undefined;
            if (creep.memory.spawn)
                spawn = Game.getObjectById(creep.memory.spawn);
            else {
                spawn = creep.pos.findClosestByPath(FIND_MY_SPAWNS);
                creep.memory.spawn = spawn.id;
            }


            if (creep) {
                if (creep.name.includes('claim')) {
                    c++;

                }
                if (creep.memory.global !== undefined) {
                    if (Memory.starte === 2) {
                        delete creep.memory.global;
                    }
                    creep.say('l')
                    let global_action = creep.memory.global['action'];
                    let global_memory = creep.memory.global['memory'];
                    let pos = global_memory['pos'];
                    //if (global_memory['pos'])
                    //   pos = new RoomPosition(global_memory['pos'].x, global_memory['pos'].y, global_memory['pos'].room);

                    switch (global_action) {
                        case G_HandOver:
                            creep.moveTo(pos);
                            //if (creep.pos.room === pos.pos.room)
                            //    reset_mem(creep);
                            break;
                        case G_MoveTo:
                            creep.moveTo(pos);
                            if (creep.pos.getRangeTo(pos.pos) < 3)
                                reset_mem(creep);
                            break;
                        case G_BuildAt:
                            //go in room and claim controller
                            creep.say('1');
                            if (over_room.move_in_room(creep, pos.pos.roomName, pos) === ERR_NOT_IN_RANGE) break;
                            creep.say('2');
                            over_room.create_construction_site(global_memory['struct'], pos, creep);
                            creep.say('energy: '+creep.store[RESOURCE_ENERGY]);
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
                                    mine.run(creep, spawn, false);
                                    if (creep.store.getFreeCapacity() === 0) {
                                        global_memory.state = 2;
                                    }
                                    break;
                                case 2:
                                    let build = require('action.builder');
                                    build.run(creep, spawn);
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

                        case G_ClaimController:
                            if (over_room.move_in_room(creep, pos.pos.roomName, pos) === ERR_NOT_IN_RANGE) break;
                            if (over_room.claim_controller(creep) === ERR_NOT_IN_RANGE) break;
                            creep.memory.global['action'] = G_Recycle;
                            break;
                        case G_Recycle:
                            let renewer = require('special.renew');
                            renewer.recycle(creep, spawn);
                            break;
                        default:
                            console.log('⚠: Global Action Unknown!');
                            break;
                    }


                }
            }
        }
        //check my invation
        let l = 0;
        for (let spawnsKey in Game.spawns) {
            l++;
        }

        if (Memory.starte === 1 && c < 4 && l < 2) {
            Game.spawns['Spawn1'].createCreep([MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, WORK, WORK, WORK], 'claim' + Game.time, {
                global: {
                    action: 'GBuildAt',
                    memory: {pos: Game.flags['spawn'], struct: STRUCTURE_SPAWN}
                }
            });
        } else if (l === 2) {
            Memory.starte = 2;
        }

    },

    expald: function () {
        let t = false;
        for (let x in Game.flags) {
            if (x === 'spawn') {
                t = true;
                break;
            }
        }
        if (t) {
            //console.log('test : '+Memory.starte);
            //console.log('spawn init go')
            if (Memory.starte === undefined) {
                Game.spawns['Spawn1'].createCreep([MOVE, MOVE, CLAIM], 'claim' + Game.time, {
                    global: {
                        action: G_ClaimController,
                        memory: {pos: Game.flags['spawn'], struct: STRUCTURE_SPAWN}
                    }
                });
                Memory.starte = 1;
            }else{
                //console.log('on da way');
            }
        } else {
            //console.log('nospawn')
        }
    }
};