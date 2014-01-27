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
