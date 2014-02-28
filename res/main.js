$(function () {
var interface_init = function () {
    main_menu_init();
    panel_init();
    field_init();
};

var main_menu_init = function () {
    $('#mode_name').html(mode_descriptions[MODE][0]);
    $('#mode_description').html(mode_descriptions[MODE][1]);
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
var STATE = 'MENU';

/* Modes: CLASSIC, SUPRISE, TRON, (BATTLE_FIELD?) */
var MODE_NAME = ['CLASSIC', 'SUPRISE', 'TRON'];

var MODE = 0;

var mode_descriptions = [
        ['經典模式', '經典的吃方塊模式<br>以不斷長大為最高目標!', '經典'],
        ['驚喜模式', '場上隨時會有傳送門<br>小心別在關門時進入!', '驚喜'],
        ['TRON', '???', 'TRON'],
    ];

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

var next_mode = function () {
    MODE = (MODE + 1) % MODE_NAME.length;
    $('#mode_name').html(mode_descriptions[MODE][0]);
    $('#mode_description').html(mode_descriptions[MODE][1]);
    $('#game_mode').html(mode_descriptions[MODE][2]);
};

var last_mode = function () {
    MODE = (MODE - 1 + MODE_NAME.length) % MODE_NAME.length;
    $('#mode_name').html(mode_descriptions[MODE][0]);
    $('#mode_description').html(mode_descriptions[MODE][1]);
    $('#game_mode').html(mode_descriptions[MODE][2]);
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
    new_snake.grow = 0;
    new_snake.in_portal = [];
    return new_snake;
};

var snake = [];
var dying_tail = [];

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
            row: dir_row,
            col: dir_col,
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
        {   type: 'head',
            color: color,
            row: dir_row,
            col: dir_col,
        });
    set_map_data(snake[1].head.row, snake[1].head.col-1,
        {   type: 'body',
            color: color,
            row: dir_row,
            col: dir_col,
        });
    set_map_data(snake[1].head.row, snake[1].head.col-2,
        {   type: 'tail',
            color: color,
            row: dir_row,
            col: dir_col,
        });
};

var iter_control_source = function () {
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
    if (snake[index].grow > 0) {
        snake[index].grow--;
        return;
    }
    var next_tail = get_next_block(snake[index].tail.row, snake[index].tail.col);
    var tr = next_tail.row;
    var tc = next_tail.col;
    
    var old_tr = snake[index].tail.row;
    var old_tc = snake[index].tail.col;
    if (map[old_tr][old_tc].type == 'body-jump') {
        close_wormhole(map[old_tr][old_tc].data);
        snake[index].in_portal.shift();
    }
    set_map_data(old_tr, old_tc, {type: 'ground'});
    snake[index].tail.row = tr;
    snake[index].tail.col = tc;
    if (map[tr][tc].type != 'body-jump') {
        set_map_data(snake[index].tail.row, snake[index].tail.col, {type: 'tail'});
    }
    snake[index].length -= 1;
};

var move_head = function (index) {
    var move_row = snake[index].dir.row;
    var move_col = snake[index].dir.col;

    if (snake[index].queue.length > 0) {
        var move_vector = parse_direction( snake[index].queue.shift() );
        move_row = move_vector.row;
        move_col = move_vector.col;

        if (move_row == -snake[index].dir.row &&
            move_col == -snake[index].dir.col) {
            move_row = snake[index].dir.row;
            move_col = snake[index].dir.col;
        }
    }

    var br = snake[index].head.row;
    var bc = snake[index].head.col;

    set_map_data(br, bc,
        {   type: 'body',
            row: move_row,
            col: move_col,
            });

    var hr = (br + move_row + MAP_HEIGHT) % MAP_HEIGHT;
    var hc = (bc + move_col + MAP_WIDTH ) % MAP_WIDTH;

    // encounter a portal, transport first, check collision later
    if (map[hr][hc].type == 'portal') {
        var another_portal_id = 1 - map[hr][hc].data;
        var another_portal_row = portal_pair[another_portal_id].row;
        var another_portal_col = portal_pair[another_portal_id].col;
        hr = (another_portal_row + move_row + MAP_HEIGHT) % MAP_HEIGHT;
        hc = (another_portal_col + move_col + MAP_WIDTH ) % MAP_WIDTH;
        var wormhole_id = get_wormhole(hr, hc);
        console.log('get wormhole id:', wormhole_id);
        set_map_data(br, bc,
            {   type: 'body-jump',
                data: wormhole_id
                });
        console.log(map[br][bc].type);
        console.log(map[br][bc].data);
        snake[index].in_portal = snake[index].in_portal.concat([wormhole_id]);
    }

    // check collision here
    switch (map[hr][hc].type) {
    case 'head':
    case 'body':
    case 'body-jump':
    case 'body-end':
    case 'tail':
    case 'wall':
        set_state('GAME_END');
        return;
        break;
    case 'cube':
        snake[index].grow += 1;
        $($('.snake_info > .number')[index]).text(snake[index].length + 2);
        put_cube();
        break;
    }

    snake[index].head.row = hr;
    snake[index].head.col = hc;

    snake[index].dir.row = move_row;
    snake[index].dir.col = move_col;

    set_map_data(snake[index].head.row, snake[index].head.col,
        {   type: 'head',
            color: snake[index].color,
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

var escape_tail = function (index) {
    // new tail row/col
    var ntr = snake[index].tail.row;
    var ntc = snake[index].tail.col;

    // iterator tail row/col
    var itr = ntr;
    var itc = ntc;

    // find a safe tail position
    while (true) {

        console.log(itr, itc, map[itr][itc].type);
        if (map[itr][itc].type == 'head') {
            break;
        } else if (map[itr][itc].type == 'body-jump') {

            var tmp_pos = get_next_block(itr, itc);

            if (wormhole[ map[itr][itc].data ].open == false) {
                // connection point broken
                add_dying_tail(ntr, ntc);
                delete_wormhole(map[itr][itc].data);
                set_map_data(itr, itc, {type: 'body-end'});
                ntr = tmp_pos.row;
                ntc = tmp_pos.col;
                itr = ntr;
                itc = ntc;
            } else {
                itr = tmp_pos.row;
                itc = tmp_pos.col;
            }

        } else {
            // nothing special, keep searching
            var tmp_pos = get_next_block(itr, itc);
            if (itr == tmp_pos.row && itc == tmp_pos.col) {
                console.log('Error: the next block of (', itr, ',', itc, ') is itself.');
            }
            itr = tmp_pos.row;
            itc = tmp_pos.col;
        }
    }
    snake[index].tail.row = ntr;
    snake[index].tail.col = ntc;
};

var add_dying_tail = function (row, col) {
    dying_tail.push({row: row, col: col});
};

var move_dying_tail = function () {
    var new_dying_tail = [];

    for (var a = 0; a < dying_tail.length; a++) {
        var dtr = dying_tail[a].row;
        var dtc = dying_tail[a].col;
        if (map[dtr][dtc].type == 'body-end') {
            set_map_data(dtr, dtc, {type: 'wall'});
        } else {
            var tmp_pos = get_next_block(dtr, dtc);
            set_map_data(dtr, dtc, {type: 'wall'});
            dtr = tmp_pos.row;
            dtc = tmp_pos.col;
            new_dying_tail.push( {row: dtr, col: dtc} );
        }
    }

    dying_tail = new_dying_tail;
};
var TIME_UNIT = 50;
var PORTAL_DURATION = 30;
var timer;
var snake_wait;
var portal_timer_wait;
var portal_timer;

var portal_exists = false;
var portal_pair = [
        {row: '', col: ''},
        {row: '', col: ''},
    ];

var wormhole = [];

var deleted_wormhole = [];

var init = function () {
    interface_init();
    reset();
};

var reset = function () {
    stop_timer();
    field_init();
    $('.snake_info > .number').text('3');

    timer = 0;
    snake_wait = 0;
    portal_timer_wait = 0;
    portal_timer = 5;
    portal_exists = false;

    construct_snake();
    construct_map();
    put_snake_on_map();
    put_cube();
};

var start_timer = function () {
    timer = setInterval(function () {

        if (snake_wait == 0) {
            move_dying_tail();

            for (var a = 0; a < snake.length; a++) {
                move_tail(a);
            }

            for (var a = 0; a < snake.length; a++) {
                move_head(a);
            }
        }

        if (MODE_NAME[MODE] == 'SUPRISE' && portal_timer_wait == 0) {
            portal_timer--;
            display_portal_remain_time();
            if (portal_timer <= 0) {
                portal_timer = PORTAL_DURATION;
                clean_portal();
                put_portal();
            }
        }

        snake_wait = (snake_wait + 1) % 6;

        if (MODE_NAME[MODE] == 'SUPRISE') {
            portal_timer_wait = (portal_timer_wait + 1) % (1000 / TIME_UNIT);
        }

    }, TIME_UNIT);
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

var clean_portal = function () {
    if (portal_exists == false) {
        return;
    }

    var check_dir_row = [-1, 0, 1, 0];
    var check_dir_col = [ 0, 1, 0,-1];

    // clean wormholes, not tested yet
    for (var b = 0; b < 2; b++) {
        var row = portal_pair[b].row;
        var col = portal_pair[b].col;
        for (var a = 0; a < 4; a++) {
            var tmp_row = (row + check_dir_row[a] + MAP_HEIGHT) % MAP_HEIGHT;
            var tmp_col = (col + check_dir_col[a] + MAP_WIDTH) % MAP_WIDTH;
            if (map[tmp_row][tmp_col].type == 'body-jump') {
                console.log('clean wormhole:', map[tmp_row][tmp_col].data);
                close_wormhole(map[tmp_row][tmp_col].data);
            }
        }
    }

    // cut snake here
    for (var a = 0; a < snake.length; a++) {
        console.log('escaping tail', a);
        escape_tail(a);
    }

    $('#block_' + portal_pair[0].row + '_' + portal_pair[0].col).text('');
    $('#block_' + portal_pair[1].row + '_' + portal_pair[1].col).text('');

    set_map_data(portal_pair[0].row, portal_pair[0].col, {type: 'ground'});
    set_map_data(portal_pair[1].row, portal_pair[1].col, {type: 'ground'});
};

var put_portal = function () {
    portal_exists = true;

    var row;
    var col;
    do {
        row = Math.floor(Math.random() * MAP_HEIGHT);
        col = Math.floor(Math.random() * MAP_WIDTH);
    } while (map[row][col].type != 'ground');

    portal_pair[0].row = row;
    portal_pair[0].col = col;

    do {
        row = Math.floor(Math.random() * MAP_HEIGHT);
        col = Math.floor(Math.random() * MAP_WIDTH);
    } while (map[row][col].type != 'ground');

    portal_pair[1].row = row;
    portal_pair[1].col = col;

    set_map_data(portal_pair[0].row, portal_pair[0].col, {type: 'portal', data: 0});
    set_map_data(portal_pair[1].row, portal_pair[1].col, {type: 'portal', data: 1});
    display_portal_remain_time();
};

var close_wormhole = function (wormhole_id) {
    wormhole[wormhole_id].open = false;
};

var delete_wormhole = function (wormhole_id) {
    delete wormhole[wormhole_id];
};

var get_wormhole = function (row, col) {
    var a = 0;
    while (wormhole[a] != undefined) {
        a++;
    }
    wormhole[a] = {row: row, col: col, open: true};
    return a;
};

var display_portal_remain_time = function () {
    if (portal_exists) {
        $('#block_' + portal_pair[0].row + '_' + portal_pair[0].col).text(portal_timer);
        $('#block_' + portal_pair[1].row + '_' + portal_pair[1].col).text(portal_timer);
    }
};

    init();
    set_state('MENU');

    $('#start_game.button').click(enter_game);
    $('#reset.button').click(function () {
        set_state('GAME_RESET');
    });

    $('#back2menu.button').click(back2menu);
    $('.snake_info').click(iter_control_source);

    $('#next_mode').click(next_mode);
    $('#last_mode').click(last_mode);

    bind_keys();
});
