var state_machine = {};

state_machine.STATE = 'MENU';
/* Modes: CLASSIC, SUPRISE, TRON, (BATTLE_FIELD?) */
state_machine.MODE_NAME = ['CLASSIC', 'SUPRISE', 'TRON'];
state_machine.mode_descriptions = [
    ['經典模式', '經典的吃方塊模式<br>以不斷長大為最高目標!', '經典'],
    ['驚喜模式', '場上隨時會有傳送門<br>小心別在關門時進入!', '驚喜'],
    ['TRON', '???', 'TRON'],
];
state_machine.MODE = 0;

state_machine.get_mode_name = function () {
    return state_machine.MODE_NAME[state_machine.MODE];
};

state_machine.get_mode_description = function () {
    return state_machine.mode_descriptions[state_machine.MODE];
};

state_machine.get_state = function () {
    return state_machine.STATE;
};

state_machine.set_state = function (new_state) {
    /* states: MENU, GAME_PAUSE, GAME_ING */
    state_machine.STATE = new_state;
    switch (state_machine.STATE) {
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

state_machine.enter_game = function () {
    state_machine.set_state('GAME_RESET');
    /* snake position initialize to map upper right and lower down*/
};

state_machine.back2menu = function () {
    state_machine.set_state('MENU');
};

state_machine.next_mode = function () {
    state_machine.MODE = (state_machine.MODE + 1) % state_machine.MODE_NAME.length;
    $('#mode_name').html(state_machine.mode_descriptions[state_machine.MODE][0]);
    $('#mode_description').html(state_machine.mode_descriptions[state_machine.MODE][1]);
    $('#game_mode').html(state_machine.mode_descriptions[state_machine.MODE][2]);
};

state_machine.last_mode = function () {
    state_machine.MODE = (state_machine.MODE - 1 + state_machine.MODE_NAME.length) % state_machine.MODE_NAME.length;
    $('#mode_name').html(state_machine.mode_descriptions[state_machine.MODE][0]);
    $('#mode_description').html(state_machine.mode_descriptions[state_machine.MODE][1]);
    $('#game_mode').html(state_machine.mode_descriptions[state_machine.MODE][2]);
};

