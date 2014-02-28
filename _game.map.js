/* Game engine related functions and variables */
var MAP_WIDTH = 25;
var MAP_HEIGHT = 25;
var map = [];

var set_map_data = function (row, col, data) {
    if (0 <= row && row <= MAP_HEIGHT && 0 <= col && col <= MAP_WIDTH) {
        for (i in data) {
            map[row][col][i] = data[i];
        }
        var target_element = $('#block_'+row+'_'+col);
        switch (data.type) {
        case 'head':
        case 'body':
        case 'tail':
            target_element.attr('class', 'block '+ map[row][col].color + '_' + map[row][col].type);
            break;
        case 'body-jump':
        case 'body-end':
            target_element.attr('class', 'block '+ map[row][col].color + '_' + 'body');
            break;
        case 'ground':
            target_element.attr('class', 'block ground');
            break;
        case 'cube':
            target_element.attr('class', 'block cube');
            break;
        case 'portal':
            target_element.attr('class', 'block portal');
            break;
        case 'wall':
            target_element.attr('class', 'block wall');
            break;
        }
    }
};

var construct_map = function () {
    for (var a = 0; a < MAP_HEIGHT; a++) {
        map[a] = [];
        for (var b = 0; b < MAP_WIDTH; b++) {
            map[a][b] = {
                    type: 'ground',
                };
        }
    }
};

var get_next_block = function (row, col) {
    var nr;
    var nc;
    switch (map[row][col].type) {
    case 'body-jump':
        var wormhole_id = map[row][col].data;
        var connect_point = wormhole[wormhole_id];
        console.log('wormhole_id:', wormhole_id);
        console.log('connect point:', connect_point);
        nr = connect_point.row;
        nc = connect_point.col;
        break;
    case 'body':
    case 'tail':
        var dir_row = map[row][col].row;
        var dir_col = map[row][col].col;
        nr = (row + dir_row + MAP_HEIGHT) % MAP_HEIGHT;
        nc = (col + dir_col + MAP_WIDTH ) % MAP_WIDTH;
        break;
    case 'head':
    case 'body-end':
    case 'wall':
    case 'cube':
    case 'portal':
    case 'ground':
        nr = row;
        nc = col;
        break;
    }
    return {row: nr, col: nc};
};

