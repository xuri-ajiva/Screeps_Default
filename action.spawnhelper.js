const size = 9;
const min = 5;
const max = 50 - min;

module.exports = {
    /** @param {Creep} creep
     *  @param {Spawn} spw
     **/
    run: function (creep, spw) {
        creep.say('💚');
        if (Memory._extentions !== undefined) {
            switch (Memory._extentions[0]) {
                case 0:
                    Memory._extentions[1] = spw.room.find(FIND_STRUCTURES, {filter: (s) => s.structureType === STRUCTURE_EXTENSION});
                    Memory._extentions[0] = 1;
                    break;
                case 1:
                    this.detectPos(creep, spw);

                    Memory._extentions[0] = 2;
                    break;
                case 2:
                    let x = Memory._extentions[1]['x'];
                    let y = Memory._extentions[1]['y'];
                    for (let i = x; i <= x + size; i++) {
                        for (let j = y; j <= y + size; j++) {
                            let rp = spw.room.getPositionAt(i, j);
                            if (rp.lookFor(LOOK_STRUCTURES)[0]) {
                                creep.say('💢');
                                spw.room.visual.text('💥', rp.x, rp.y);
                                //console.log(rp)
                                //if (creep.dismantle(rp.lookFor(LOOK_STRUCTURES)[0]) === ERR_NOT_IN_RANGE) {
                                //creep.moveTo(rp);
                                return;
                                //}
                            }
                        }
                    }
                    Memory._extentions[0] = 3;

                    //Memory._extentions[0] = 1;
                    break;
                case 3:
                    //for (let i = 0; i <= 2 + size; i++)
                    this.build(creep, spw, false);
                    Memory._extentions[0] = 4;
                    break;
                case 4:

                    creep.say('☯');
                    let carry = require('action.carry');

                    if (creep.store.getFreeCapacity() !== 0) {
                        if (carry.GetEnergy(creep, spw, true)) {

                        }
                    } else if(spw.room.energyAvailable < spw.room.energyCapacityAvailable) {
                        let struct = spw.room.find(FIND_STRUCTURES,{filter: (s) => s.structureType === STRUCTURE_EXTENSION && s.store[RESOURCE_ENERGY] !== 50 })
                        if(creep.transfer(struct[0],RESOURCE_ENERGY) === ERR_NOT_IN_RANGE){
                            creep.moveTo(struct[0]);
                        }

                    }

                    break;

                // default:
                //     Memory._extentions[0] = 0;
                //     break
            }

            //let t = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
            //for (const i in t) {
            //    t[i].remove();
            //}
        } else {
            Memory._extentions = [];
            Memory._extentions.push(0);
            Memory._extentions.push(0);
            Memory._extentions.push(0);
        }
    },

    /** @param {Creep} creep
     *  @param {Spawn} spw
     **/
    detectPos: function (creep, spw) {
        let t_size = size / 2;
        let h_size = (size / 2);
        const terrain = spw.room.getTerrain();
        const matrix = new PathFinder.CostMatrix;
        const visual = spw.room.visual;
        visual.text(' test ', 1, 0);

        let px = 0;
        let py = 0;
        let dist = 1000;


        for (let y = min; y < max; y++) {
            for (let x = min; x < max; x++) {
                const tile = terrain.get(x, y);
                const weight =
                    tile === TERRAIN_MASK_WALL ? 255 : // wall  => unwalkable
                        tile === TERRAIN_MASK_SWAMP ? 5 : // swamp => weight:  5
                            1; // plain => weight:  1
                //console.log(weight);

                if (tile !== TERRAIN_MASK_WALL && x + size < max && y + size < max) {


                    if (terrain.get(x + size, y) !== TERRAIN_MASK_WALL)
                        if (terrain.get(x + size, y + size) !== TERRAIN_MASK_WALL)
                            if (terrain.get(x, y + size) !== TERRAIN_MASK_WALL) {
                                let _break = false;
                                for (let i = x; i < x + size; i++) {
                                    for (let j = y; j < y + size; j++) {
                                        if (terrain.get(i, j) === TERRAIN_MASK_WALL) {
                                            _break = true;
                                            visual.text('-', i, j);
                                        }
                                        //else {visual.text('#',i,j);}
                                    }
                                    if (_break) break;
                                }
                                if (!_break) {
                                    let dist_n = Math.sqrt(Math.pow(spw.pos.y - (y + t_size), 2) + Math.pow((spw.pos.x - (x + t_size)), 2));
                                    let s = spw.room.find(FIND_SOURCES);
                                    for (let t in s) {
                                        let dts = Math.sqrt(Math.pow(s[t].pos.y - (y + t_size), 2) + Math.pow((s[t].pos.x - (x + t_size)), 2));
                                        dist_n = dts < dist_n ? dts : dist_n;
                                    }
                                    //visual.text(dist_n.toFixed(0), (x+h_size), (y+h_size) );


                                    if (dist_n.toFixed(0) == 7) {
                                        Memory._extentions[1] = {x: px, y: py};
                                        console.log('placing spawnHelp at [' + px + '/' + py + ']');

                                        visual.rect(px, py, size, size, {
                                            strokeWidth: .8,
                                            fill: '#ffdb00',
                                            stroke: '#000000'
                                        });
                                        visual.rect(px - 1, py - 1, size + 2, size + 2, {
                                            strokeWidth: .5,
                                            fill: 'transparent',
                                            stroke: '#00ff1e'
                                        });

                                        visual.text('x', px + size, py);
                                        visual.text('x', px + size, py + size);
                                        visual.text('x', px, py + size);
                                        visual.text('H' + px + ':' + py + ":" + dist_n.toFixed(0), px, py);

                                        //console.log('ret');
                                        return;
                                    } else if (dist_n > 7 && dist_n < dist && dist_n < 20) {
                                        dist = dist_n;
                                        px = x;
                                        py = y;
                                    }
                                }

                            }
                }

                matrix.set(x, y, weight);
            }
        }
    },

    /** @param {Creep} creep
     *  @param {Spawn} spw
     *  @param {Boolean} prew
     **/
    build: function (creep, spw, prew) {

        let h_size = (size / 2);
        let q_size = Math.floor(size / 3);
        let x = Memory._extentions[1]['x'];
        let y = Memory._extentions[1]['y'];
        //creep.say(q_size);
        //creep.moveTo(x, y);
        for (let i = x; i <= x + size; i++) {
            for (let j = y; j <= y + size; j++) {

                if (i == x + size || j == y + size || i == x || j == y) {
                    if (i === x + q_size || i === x + q_size * 2) if (prew)
                        spw.room.visual.text('🟩', i, j);
                    else spw.room.createConstructionSite(i, j, STRUCTURE_RAMPART);
                    else if (prew)
                        spw.room.visual.text('⬛', i, j);
                    else
                        spw.room.createConstructionSite(i, j, STRUCTURE_WALL);
                } else {

                    if (i === x + q_size || i === x + q_size * 2)
                        if (prew)
                            spw.room.visual.text('🔸', i, j);
                        else spw.room.createConstructionSite(i, j, STRUCTURE_ROAD);
                    else {
                        if (prew)
                            spw.room.visual.text('🟡', i, j);
                        else
                            spw.room.createConstructionSite(i, j, STRUCTURE_EXTENSION);
                    }
                }
            }
        }
        if (prew) {
            spw.room.visual.text('🔲', x - 1, y - 1);
            spw.room.visual.text('🔲', x + 1 + size, y + 1 + size);
            spw.room.visual.text('🔲', x + 1 + size, y - 1);
            spw.room.visual.text('🔲', x - 1, y + 1 + size);

        } else {
            spw.room.createConstructionSite(x - 1, y - 1, STRUCTURE_CONTAINER);
            spw.room.createConstructionSite(x + 1 + size, y + 1 + size, STRUCTURE_CONTAINER);
            spw.room.createConstructionSite(x + 1 + size, y - 1, STRUCTURE_CONTAINER);
            spw.room.createConstructionSite(x - 1, y + 1 + size, STRUCTURE_CONTAINER);
        }
        spw.room.visual.text('🔰', x, y);
    },

};