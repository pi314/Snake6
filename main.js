$(function () {
var interface_init = function () {
    panel_init();
    field_init();
};

var panel_init = function () {
   var s1 = gen_snake_info_panel("↑←↓→", 'green');
   var s2 = gen_snake_info_panel("wads", 'yellow');
   $('#snake_info_panel').html(s1 + s2);
};

var gen_snake_info_panel = function (dir, color) {
   var s = '';
   s += '<div class="snake_info">'
   s += '<div class="block ' + color + '_body"></div>';
   s += '<div class="block ' + color + '_body"></div>';
   s += '<div class="block ' + color + '_head"></div>';
   s += '<span class="number">3</span>';
   s += '<br>';
   s += '<div class="control_source_player">';
   s += '<div class="control"></div>';
   s += '<div class="control">' + dir[0] + '</div><br>';
   s += '<div class="control">' + dir[1] + '</div>';
   s += '<div class="control">' + dir[2] + '</div>';
   s += '<div class="control">' + dir[3] + '</div><br>';
   s += '</div>';
   s += '<div class="control_source_AI">';
   s += 'AI';
   s += '</div>';
   s += '<div class="control_source_none">';
   s += 'None';
   s += '</div>';
   s += '</div>';
   return s;
};

var MAP_WIDTH = 25;
var MAP_HEIGHT = 25;

var field_init = function () {
    var s = '';
    for (var a = 0; a < MAP_HEIGHT; a++) {
        for (var b = 0; b < MAP_WIDTH; b++) {
            s += '<div class="block ground" id="block_'+a+'_'+b+'"></div>';
        }
        s += '<br>';
    }
    $('#field').html(s);
};

/* General Used functions and variables */
var STATE = 'MENU';

var set_state = function (new_state) {
    /* states: MENU, GAME */
    STATE = new_state;
    switch (STATE) {
    case 'MENU':
        $('#main_menu').css('display', 'block');
        $('#game_field').css('display', 'none');
        break;
    case 'GAME':
        $('#main_menu').css('display', 'none');
        $('#game_field').css('display', 'block');
        break;
    }
};

var enter_game = function () {
    set_state('GAME');
    /* snake position initialize to map upper right and lower down*/
};

var back2menu = function () {
    set_state('MENU');
};
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
var get_snake = function (hx, hy, tx, ty) {
    var new_snake = {};
    new_snake.head = {};
    new_snake.head.x = hx;
    new_snake.head.y = hy;
    new_snake.tail = {};
    new_snake.tail.x = tx;
    new_snake.tail.y = ty;
    new_snake.control_source = 'PLAYER';
    new_snake.queue = [];
    return new_snake;
};

var snake = [
        get_snake(MAP_WIDTH-3, 0,  MAP_WIDTH-1, 0),
        get_snake(2, MAP_HEIGHT-1,  0, MAP_HEIGHT-1),
    ];

$(function () {
    // set yellow snake initial position
    set_map_raw_data(snake[0].head.y, snake[0].head.x  , 'SYL');
    set_map_raw_data(snake[0].head.y, snake[0].head.x+1, 'sYL');
    set_map_raw_data(snake[0].head.y, snake[0].head.x+2, 'syL');

    // set green snake initial position
    set_map_raw_data(snake[1].head.y, snake[1].head.x  , 'SGR');
    set_map_raw_data(snake[1].head.y, snake[1].head.x-1, 'sGR');
    set_map_raw_data(snake[1].head.y, snake[1].head.x-2, 'sgR');
});

var set_control_source = function () {
    console.log(this);
    var snake_index = $('.snake_info').index(this);
    console.log(snake_index);
    console.log(snake[snake_index].control_source);

    switch (snake[snake_index].control_source) {
    case 'PLAYER':
        $(this).children('.control_source_player').css('display', 'none');
        $(this).children('.control_source_AI').css('display', 'block');
        snake[snake_index].control_source = 'AI';
        break;
    case 'AI':
        $(this).children('.control_source_AI').css('display', 'none');
        $(this).children('.control_source_none').css('display', 'block');
        snake[snake_index].control_source = 'NONE';
        break;
    case 'NONE':
        $(this).children('.control_source_none').css('display', 'none');
        $(this).children('.control_source_player').css('display', 'block');
        snake[snake_index].control_source = 'PLAYER';
        break;
    }
}


    interface_init();

    set_state('GAME');

    $('#start_game.button').click(enter_game);
    $('#reset.button').click(function () {});
    $('#back2menu.button').click(back2menu);
    $('.snake_info').click(set_control_source);
});
