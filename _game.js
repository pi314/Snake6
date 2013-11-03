/* Game engine related functions and variables */
var control_source = ['PLAYER', 'PLAYER'];

var enter_game = function () {
    set_state('GAME');
    /* snake position initialize to map upper right and lower down*/
};

var set_control_source = function () {
    console.log(this);
    var snake_index = $('.snake_info').index(this);
    console.log(snake_index);
    console.log(control_source[snake_index]);

    switch (control_source[snake_index]) {
    case 'PLAYER':
        $(this).children('.control_source_player').css('display', 'none');
        $(this).children('.control_source_AI').css('display', 'block');
        control_source[snake_index] = 'AI';
        break;
    case 'AI':
        $(this).children('.control_source_AI').css('display', 'none');
        $(this).children('.control_source_none').css('display', 'block');
        control_source[snake_index] = 'NONE';
        break;
    case 'NONE':
        $(this).children('.control_source_none').css('display', 'none');
        $(this).children('.control_source_player').css('display', 'block');
        control_source[snake_index] = 'PLAYER';
        break;
    }
}
