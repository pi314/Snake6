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

