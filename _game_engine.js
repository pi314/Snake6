var timer = 0;
var time_unit = 50;
var snake_wait = 0;

var init = function () {
    interface_init();
    reset();
};

var reset = function () {
    field_init();
    $('.snake_info > .number').text('3');
    construct_snake();
    construct_map();
    put_snake_on_map();
    put_cube();
};

var start_timer = function () {
    timer = setInterval(function () {
        if (snake_wait == 0) {
            for (var a = 0; a < snake.length; a++) {
                move_tail(a);
            }

            for (var a = 0; a < snake.length; a++) {
                move_head(a);
            }
        }
        snake_wait = (snake_wait + 1) % 6;
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
