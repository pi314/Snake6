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
        state_machine.set_state('GAME_END');
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
