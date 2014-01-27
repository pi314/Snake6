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

var message_row = 8;
var show_pause_message = function () {
    var message = '請按空白鍵開始遊戲';
    var padding_left = (MAP_WIDTH - message.length) / 2;
    for (var a = 0; a < message.length; a++) {
        $('#block_'+message_row+'_'+(a+padding_left)).text(message[a]);
    }
};

var clear_pause_message = function () {
    for (var a = 0; a < MAP_WIDTH; a++) {
        $('#block_'+message_row+'_'+a).text('');
    }
}
/* General Used functions and variables */
var STATE = 'MENU';

var get_state = function () {
    return STATE;
};

var set_state = function (new_state) {
    /* states: MENU, GAME_PAUSE, GAME_ING */
    STATE = new_state;
    switch (STATE) {
    case 'MENU':
        $('#main_menu').css('display', 'block');
        $('#game_field').css('display', 'none');
        break;
    case 'GAME_RESET':
        $('#main_menu').css('display', 'none');
        $('#game_field').css('display', 'block');
        reset();
    case 'GAME_PAUSE':
    case 'GAME_END':
        show_pause_message();
        stop_timer();
        break;
    case 'GAME_ING':
        clear_pause_message();
        start_timer();
        break;
    }
};

var enter_game = function () {
    set_state('GAME_RESET');
    /* snake position initialize to map upper right and lower down*/
};

var back2menu = function () {
    set_state('MENU');
};
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
        case 'ground':
            target_element.attr('class', 'block ground');
            break;
        case 'cube':
            target_element.attr('class', 'block cube');
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
var get_snake = function (color, hr, hc, tr, tc, dr, dc) {
    var new_snake = {};
    new_snake.color = color;
    new_snake.head = {};
    new_snake.head.col = hc;
    new_snake.head.row = hr;
    new_snake.tail = {};
    new_snake.tail.col = tc;
    new_snake.tail.row = tr;
    new_snake.control_source = 'PLAYER';
    new_snake.queue = [];
    new_snake.length = Math.abs(hr - tr) + Math.abs(hc - tc) + 1;
    new_snake.dir = {};
    new_snake.dir.col = dc;
    new_snake.dir.row = dr;
    new_snake.grow = false;
    return new_snake;
};

snake = [];

var construct_snake = function () {
    snake = [
        // param  color     head row/col      tail row/col      head dir row/col
        get_snake('green',  0, MAP_WIDTH-3,   0, MAP_WIDTH-1,   0, -1),
        get_snake('yellow', MAP_HEIGHT-1, 2,  MAP_HEIGHT-1, 0,  0, 1),
    ];
};

var put_snake_on_map = function () {
    // set green snake initial position
    var color = 'green';
    var dir_row = 0;
    var dir_col = -1;
    set_map_data(snake[0].head.row, snake[0].head.col  ,
        {   type: 'head',
            color: color,
            row:  dir_row,
            col:  dir_col,
        });
    set_map_data(snake[0].head.row, snake[0].head.col+1,
        {   type: 'body',
            color: color,
            row: dir_row,
            col: dir_col,
        });
    set_map_data(snake[0].head.row, snake[0].head.col+2,
        {   type: 'tail',
            color: color,
            row: dir_row,
            col: dir_col,
        });

    // set green snake initial position
    color = 'yellow';
    dir_row = 0;
    dir_col = 1;
    set_map_data(snake[1].head.row, snake[1].head.col  ,
        {   type:  'head',
            color: color,
            row: dir_row,
            col: dir_col,
        });
    set_map_data(snake[1].head.row, snake[1].head.col-1,
        {   type: 'body',
            color: color,
            row:dir_row,
            col: dir_col,
        });
    set_map_data(snake[1].head.row, snake[1].head.col-2,
        {   type: 'tail',
            color: color,
            row: dir_row,
            col: dir_col,
        });
};

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
};

var move_tail = function (index) {
    if (snake[index].grow) {
        snake[index].grow = false;
        return;
    }
    var tr = snake[index].tail.row;
    var tc = snake[index].tail.col;

    var dir_row = map[tr][tc].row;
    var dir_col = map[tr][tc].col;

    if (index == 0)
        console.log(dir_row, dir_col);

    tr = (tr + dir_row + MAP_HEIGHT) % MAP_HEIGHT;
    tc = (tc + dir_col + MAP_WIDTH ) % MAP_WIDTH;

    set_map_data(snake[index].tail.row, snake[index].tail.col, {type: 'ground'});
    snake[index].tail.row = tr;
    snake[index].tail.col = tc;
    set_map_data(snake[index].tail.row, snake[index].tail.col, {type: 'tail'});
    snake[index].length -= 1;
};

var move_head = function (index) {
    var move_row = snake[index].dir.row;
    var move_col = snake[index].dir.col;

    if (snake[index].queue.length > 0) {
        var move_vector = parse_direction( snake[index].queue.shift() );
        move_row = move_vector.row;
        move_col = move_vector.col;
    }

    var hr = snake[index].head.row;
    var hc = snake[index].head.col;

    set_map_data(snake[index].head.row, snake[index].head.col,
        {   type: 'body',
            row:    move_row,
            col:    move_col,
            });

    hr = (hr + move_row + MAP_HEIGHT) % MAP_HEIGHT;
    hc = (hc + move_col + MAP_WIDTH ) % MAP_WIDTH;

    // check collision here
    switch (map[hr][hc].type) {
    case 'head':
    case 'body':
    case 'body_jump':
    case 'tail':
    case 'wall':
        set_state('GAME_END');
        return;
        break;
    case 'cube':
        snake[index].grow = true;
        put_cube();
        break;
    }

    snake[index].head.row = hr;
    snake[index].head.col = hc;

    snake[index].dir.row = move_row;
    snake[index].dir.col = move_col;

    set_map_data(snake[index].head.row, snake[index].head.col,
        {   type:   'head',
            color:  snake[index].color,
            });
    snake[index].length += 1;
};

var parse_direction = function (key) {
    switch (key) {
    case 'UP':      return {row: -1, col:  0};
    case 'LEFT':    return {row:  0, col: -1};
    case 'RIGHT':   return {row:  0, col:  1};
    case 'DOWN':    return {row:  1, col:  0};
    }
};

var enqueue = function (index, key) {
    snake[index].queue.push(key);
};
var timer = 0;
var time_unit = 300;

var init = function () {
    interface_init();
    reset();
};

var reset = function () {
    field_init();
    construct_snake();
    construct_map();
    put_snake_on_map();
    put_cube();
};

var start_timer = function () {
    timer = setInterval(function () {
        for (var a = 0; a < snake.length; a++) {
            move_tail(a);
        }

        for (var a = 0; a < snake.length; a++) {
            move_head(a);
        }
    }, time_unit);
};

var stop_timer = function () {
    clearInterval(timer);
}

var wasd2arrow = {
    'w': 'UP',
    'a': 'LEFT',
    'd': 'RIGHT',
    's': 'DOWN'
};

var bind_keys = function () {
    KeyManager.keydown('SPACE', function () {
        switch (get_state()) {
        case 'MENU':
            break;
        case 'GAME_RESET':
            set_state('GAME_ING');
            break;
        case 'GAME_PAUSE':
            set_state('GAME_ING');
            break;
        case 'GAME_ING':
            set_state('GAME_PAUSE');
            break;
        case 'GAME_END':
            set_state('GAME_RESET');
        }
    }).keydown(['UP', 'LEFT', 'RIGHT', 'DOWN'], function (i) {
        enqueue(0, i);
    }).keydown(['wasd'], function (i) {
        enqueue(1, wasd2arrow[i]);
    });
};

var put_cube = function () {
    var row = 0, col = 0;
    do {
        row = Math.floor(Math.random() * MAP_HEIGHT);
        col = Math.floor(Math.random() * MAP_WIDTH);
    } while (map[row][col].type != 'ground');
    set_map_data(row, col, {type: 'cube'});
};

    init();
    set_state('GAME_RESET');

    $('#start_game.button').click(enter_game);
    $('#reset.button').click(function () {
        set_state('GAME_RESET');
    });
    $('#back2menu.button').click(back2menu);
    $('.snake_info').click(set_control_source);

    bind_keys();
});
