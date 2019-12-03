const size = 12;
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
                    let t_size = size / 2;
                    const terrain = spw.room.getTerrain();
                    const matrix = new PathFinder.CostMatrix;
                    const visual = spw.room.visual;

                    let px = 0;
                    let py = 0;
                    let end = 0;
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


                                // if (terrain.get(x + size, y) !== TERRAIN_MASK_WALL)
                                //     if (terrain.get(x + size, y + size) !== TERRAIN_MASK_WALL)
                                //         if (terrain.get(x, y + size) !== TERRAIN_MASK_WALL) {
                                let _break = false;
                                for (let i = x; i < x + size; i++) {
                                    for (let j = y; j < y + size; j++) {
                                        if (terrain.get(i, j) === TERRAIN_MASK_WALL) {
                                            _break = true;
                                            //visual.text('-', i, j);
                                        } else {
                                            // visual.text('#',i,j);
                                        }
                                    }
                                    if (_break) break;
                                }
                                if (!_break) {
                                    //visual.text('.', x + h_size, y + h_size);
                                    // visual.text('.', x, y);
                                    // visual.text('.', x + size, y);
                                    // visual.text('.', x + size, y + size);
                                    // visual.text('.', x, y + size);

                                    let dist_n = Math.sqrt(Math.pow(spw.pos.y - (y + t_size), 2) + Math.pow((spw.pos.x - (x + t_size)), 2));
                                    let s = spw.room.find(FIND_SOURCES);
                                    for (let t in s) {
                                        let dts = Math.sqrt(Math.pow(s[t].pos.y - (y + t_size), 2) + Math.pow((s[t].pos.x - (x + t_size)), 2));
                                        dist_n = dts < dist_n ? dts : dist_n;
                                    }
                                    //visual.text(dist_n.toFixed(0), (x+h_size), (y+h_size) );

                                    if (dist_n.toFixed(0) == 8) {
                                        Memory._extentions[1] = {x: x, y: y};
                                        Memory._extentions[0] = 2;

                                        creep.say('💥');
                                        return;
                                    } else if (dist_n > 8 && dist_n < dist && dist_n < 20) {
                                        dist = dist_n;
                                        px = x;
                                        py = y;
                                    }
                                }
                                //}

                            }

                            matrix.set(x, y, weight);
                            //visual.text(weight, x, y);
                        }
                    }
                    // for (let i = px; i < px + size; i++) {
                    //     for (let j = py; j < py + size; j++) {
                    //         if (terrain.get(i, j) === TERRAIN_MASK_WALL)
                    //             visual.text('-', i, j);
                    //         else visual.text('+', i, j);
                    //     }
                    // }

                    let dist_n = Math.sqrt(Math.pow(spw.pos.y - (py + t_size), 2) + Math.pow((spw.pos.x - (px + t_size)), 2));
                    //visual.text('x', px, py);
                    visual.text('x', px + size, py);
                    visual.text('x', px + size, py + size);
                    visual.text('x', px, py + size);
                    visual.text('H' + px + ':' + py + ":" + dist_n.toFixed(0), px, py);

                    console.log(' run');
                    creep.memory._tmp = end;
                    break;

                case 2:
                    let h_size = (size / 2);
                    let q_size = Math.floor(size / 4);
                    let x = Memory._extentions[1]['x'];
                    let y = Memory._extentions[1]['y'];
                    //creep.say(q_size);
                    creep.moveTo(x, y);
                    for (let i = x; i <= x + size; i++) {
                        for (let j = y; j <= y + size; j++) {

                            if (i == x + size || j == y + size || i == x || j == y) {
                                if (j == y + h_size || i == x + h_size)
                                    spw.room.visual.text('🔸', i, j);
                                else
                                    spw.room.visual.text('⬛', i, j);
                            } else {

                                if (j === y + h_size || i === x + h_size /*|| j === y + q_size*/ || i === x + q_size /*|| j === y + q_size * 3*/ || i === x + q_size * 3)
                                    spw.room.visual.text('🔸', i, j);
                                else {
                                    spw.room.visual.text('🟡', i, j);
                                }
                            }
                        }
                    }
                    spw.room.visual.text('🔲', x-1, y-1);
                    spw.room.visual.text('🔲', x+1+size, y+1+size);
                    spw.room.visual.text('🔲', x+1+size, y-1);
                    spw.room.visual.text('🔲', x-1, y+1+size);

                    //Memory._extentions[0] = 1;
                    break;

                // default:
                //     Memory._extentions[0] = 0;
                //     break
            }


        } else {
            Memory._extentions = [];
            Memory._extentions.push(0);
            Memory._extentions.push(0);
            Memory._extentions.push(0);
        }
    }
}
;