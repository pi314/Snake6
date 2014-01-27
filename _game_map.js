/* Game engine related functions and variables */
var MAP_WIDTH = 25;
var MAP_HEIGHT = 25;
var map = [];

var data2css_mapping = {
    'SY': 'yellow_head',
    'sY': 'yellow_body',
    'sy': 'yellow_body',
    'SG': 'green_head',
    'sG': 'green_body',
    'sg': 'green_body',
    '..': 'ground',
};

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
        case 'ground':
            target_element.attr('class', 'block ground');
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
