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
