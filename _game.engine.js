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
