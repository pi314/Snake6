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
