/* Game engine related functions and variables */
var MAP_WIDTH = 25;
var MAP_HEIGHT = 25;

var data2css_mapping = {
    'SY': 'yellow_head',
    'sY': 'yellow_body',
    'sy': 'yellow_body',
    'SG': 'green_head',
    'sG': 'green_body',
    'sg': 'green_body',
    '..': 'ground',
};

var set_map_raw_data = function (row, col, data) {
    if (0 <= row && row <= MAP_HEIGHT && 0 <= col && col <= MAP_WIDTH) {
        map[row][col] = data;
        $('#block_'+row+'_'+col).attr('class',
            'block '+data2css_mapping[ data[0]+data[1] ] );
    }
};

var map = [];
for (var a = 0; a < MAP_HEIGHT; a++) {
    map[a] = [];
    for (var b = 0; b < MAP_WIDTH; b++) {
        map[a][b] = '...';
    }
}
