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
    case 'GAME_PAUSE':
        $('#main_menu').css('display', 'none');
        $('#game_field').css('display', 'block');
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
    set_state('GAME_PAUSE');
    /* snake position initialize to map upper right and lower down*/
};

var back2menu = function () {
    set_state('MENU');
};

var vector2symbol = function (row, col) {
    if (row == 0) {
        return col == -1? 'L' : 'R';
    }
    return row == -1? 'U' : 'D';
};
