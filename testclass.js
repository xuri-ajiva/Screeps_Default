const G_MoveTo = 'GMoveTo';
const G_HandOver = 'GHandOver';
const G_BuildAt = 'GBuildAt';
const G_ClaimController = 'GClaimCo';
const G_Recycle = 'GRecycle';


let over_room = require('actions.room');
module.exports = {
    test1: function () {
        let ctf = 0;
        let c = 0;
        for (let c_name in Game.creeps) {
            let creep = Game.creeps[c_name];
            if (creep.memory.action === 'ctf') {
                ctf++;
            }
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
                            creep.say('energy: ' + creep.store[RESOURCE_ENERGY]);
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

        if (Memory.starte === 1 && c < 4 && l < 3) {
            Game.spawns['Spawn1'].createCreep([MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, WORK, WORK, WORK], 'claim' + Game.time, {
                global: {
                    action: 'GBuildAt',
                    memory: {pos: Game.flags['spawn'], struct: STRUCTURE_SPAWN}
                }
            });
        } else if (l === 2) {
            Memory.starte = 2;
        }
        if (ctf < 10) {
            //Game.spawns['Spawn1'].spawnCreep([CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, HEAL, HEAL, HEAL, HEAL], '_test' + Game.time, {memory: {action: 'ctf'}});
            // Game.spawns['Spawn1'].spawnCreep([MOVE,MOVE,MOVE,CARRY,CARRY], '_ctf'+ Game.time, {memory: {action: 'ctf'}});
        }
    },

    expald: function () {
        //delete Memory.starte;
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
                console.log(Game.spawns['Spawn1'].createCreep([MOVE, MOVE, CLAIM], 'claim' + Game.time, {
                    global: {
                        action: G_ClaimController,
                        memory: {pos: Game.flags['spawn'], struct: STRUCTURE_SPAWN}
                    }
                }));
                Memory.starte = 1;
            } else {
                //console.log('on da way');
            }
        } else {
            //console.log('nospawn')
        }
    },


    createWalls: function (room) {
        let b = Game.cpu.getUsed();
        let v = room.visual;
        const max = 49;
        let t = room.getTerrain();

        let wall_at = [];

        let skip = 7;

        let afdsw = 0, aefsf = 0;
        let begin = [];

        let xd = 0, yd = 0;
        for (let x = 0; x <= max; x += skip) {
            xd++;
            for (let y = 0; y <= max; y += skip) {
                if (x === 0 || y === 0 || x === max || y === max) {
                    let xadd = x === 0 ? 1 : x === (max) ? -1 : 0;
                    let yadd = y === 0 ? 1 : y === (max) ? -1 : 0;

                    //v.text('🟪', x, y, {font: 1});
                    if (Math.abs(xadd) === Math.abs(yadd)) continue;

                    let must = -1;
                    let empty = -1;

                    for (let z = 0; z < 3; z++) {
                        let px = x + (xadd * z);
                        let py = y + (yadd * z);
                        if (t.get(px, py) === TERRAIN_MASK_WALL) {
                            must = z;
                            v.text('🆗', px, py, {font: 0.5});
                            //v.text(px + ' : ' + py, px, py, {color: '#0fff00', font: 0.2});
                        } else {
                            if (empty === -1) empty = z;
                        }

                        //v.text((px - x) + ' : ' + (py - y), px, py, {color: '#0fff00', font: 0.2});
                    }

                    if (empty >= 0)
                        for (let q = -skip / 2; q < (skip / 2) - 1; q++) {
                            wall_at.push({x: x + yadd * q, y: y + xadd * q, xa: xadd, ya: yadd, q: STRUCTURE_WALL});
                        }

                    wall_at.push({
                        x: x + (yadd * (skip / 2 -1)),
                        y: y + (xadd * (skip / 2-1)),
                        xa: xadd,
                        ya: yadd,
                        q: STRUCTURE_RAMPART
                    });
                    for (let q = 0; q < 3; q++) {
                        wall_at.push({x: x - xadd * q, y: y - yadd * q, xa: xadd, ya: yadd, q: STRUCTURE_WALL});
                    }

                    //wall_at.push({x: x, y:y, xa: xadd, ya: yadd});
                    v.text(empty, x + (xadd * 2), y + (yadd * 2), {font: 0.4});

                }
            }
        }

        let unique = [...new Set(wall_at)];
        for (let w in unique) {
            let x = unique[w].x;
            let y = unique[w].y;
            let xadd = unique[w].xa;
            let yadd = unique[w].ya;
            let s = unique[w].q;
            let buildings = [];

            //room.find(FIND_STRUCTURES).forEach((g) => buildings.push(g.id));
            room.find(FIND_SOURCES).forEach((g) => buildings.push(g.id));
            room.find(FIND_MY_SPAWNS).forEach((g) => buildings.push(g.id));

            //console.log(buildings)

            let ct = '';
            let hizt = 0;
            for (let bui in buildings) {
                let structure = Game.getObjectById(buildings[bui]);
                if (structure)
                    if (structure.pos.getRangeTo(x, y) < 5) {
                        hizt++;
                    }
            }
            if (hizt !== 0) {
                s = STRUCTURE_RAMPART;
                ct = '🟢';
            } else {
                ct = '🟥';
            }

            if(s === STRUCTURE_RAMPART){
                ct = '🟢';
            }


            //place.push({x: x + (xadd * 2), y: y + (yadd * 2), p: ct});

            //room.createConstructionSite(x + (xadd * 2),y + (yadd * 2),s);
            //v.text(s, x + (xadd * 2), y + (yadd * 2), {font: 0.05});
            //v.text(Math.random() , x + (xadd * 2), y + (yadd * 2), {font: 1});
        }

        //console.log(JSON.stringify(begin));

        console.log((Game.cpu.getUsed() - b).toFixed(4));
    }
};