/* General Used functions and variables */
var STATE = 'MENU';

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
        break;
    case 'GAME_ING':
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
