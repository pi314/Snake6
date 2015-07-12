$(function () {
    init();
    state_manager.set_state('MENU');

    $('#start_game.button').click(state_manager.enter_game);
    $('#reset.button').click(function () {
        state_manager.set_state('GAME_RESET');
    });

    $('#back2menu.button').click(state_manager.back2menu);
    $('.snake_info').click(iter_control_source);

    $('#next_mode').click(state_manager.next_mode);
    $('#last_mode').click(state_manager.last_mode);

    bind_keys();
});
