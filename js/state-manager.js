var state_manager = {};

state_manager.STATE = 'MENU';
/* Modes: CLASSIC, SUPRISE, TRON, (BATTLE_FIELD?) */
state_manager.MODE_NAME = ['CLASSIC', 'SUPRISE', 'TRON'];
state_manager.mode_descriptions = [
    ['經典模式', '經典的吃方塊模式<br>以不斷長大為最高目標!', '經典'],
    ['驚喜模式', '場上隨時會有傳送門<br>小心別在關門時進入!', '驚喜'],
    ['TRON', '???', 'TRON'],
];
state_manager.MODE = 0;

state_manager.get_mode_name = function () {
    return state_manager.MODE_NAME[state_manager.MODE];
};

state_manager.get_mode_description = function () {
    return state_manager.mode_descriptions[state_manager.MODE];
};

state_manager.get_state = function () {
    return state_manager.STATE;
};

state_manager.set_state = function (new_state) {
    /* states: MENU, GAME_PAUSE, GAME_ING */
    state_manager.STATE = new_state;
    switch (state_manager.STATE) {
    case 'MENU':
        $('#main_menu').css('display', 'block');
        $('#game_field').css('display', 'none');
        stop_timer();
        break;
    case 'GAME_RESET':
        $('#main_menu').css('display', 'none');
        $('#game_field').css('display', 'block');
        reset();
    case 'GAME_PAUSE':
    case 'GAME_END':
        stop_timer();
        show_pause_message();
        break;
    case 'GAME_ING':
        start_timer();
        clear_pause_message();
        break;
    }
};

state_manager.enter_game = function () {
    /* snake position initialize to map upper right and lower down*/
    state_manager.set_state('GAME_RESET');
};

state_manager.back2menu = function () {
    state_manager.set_state('MENU');
};

state_manager.next_mode = function () {
    state_manager.MODE = (state_manager.MODE + 1) % state_manager.MODE_NAME.length;
    $('#mode_name').html(state_manager.mode_descriptions[state_manager.MODE][0]);
    $('#mode_description').html(state_manager.mode_descriptions[state_manager.MODE][1]);
    $('#game_mode').html(state_manager.mode_descriptions[state_manager.MODE][2]);
};

state_manager.last_mode = function () {
    state_manager.MODE = (state_manager.MODE - 1 + state_manager.MODE_NAME.length) % state_manager.MODE_NAME.length;
    $('#mode_name').html(state_manager.mode_descriptions[state_manager.MODE][0]);
    $('#mode_description').html(state_manager.mode_descriptions[state_manager.MODE][1]);
    $('#game_mode').html(state_manager.mode_descriptions[state_manager.MODE][2]);
};

