$(function () {
    init();
    state_machine.set_state('MENU');

    $('#start_game.button').click(state_machine.enter_game);
    $('#reset.button').click(function () {
        state_machine.set_state('GAME_RESET');
    });

    $('#back2menu.button').click(state_machine.back2menu);
    $('.snake_info').click(iter_control_source);

    $('#next_mode').click(state_machine.next_mode);
    $('#last_mode').click(state_machine.last_mode);

    bind_keys();
});
