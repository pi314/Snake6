$(function () {
    init();
    set_state('MENU');
    //set_state('GAME_RESET');

    $('#start_game.button').click(enter_game);
    $('#reset.button').click(function () {
        set_state('GAME_RESET');
    });

    $('#back2menu.button').click(back2menu);
    $('.snake_info').click(iter_control_source);

    $('#next_mode').click(next_mode);
    $('#last_mode').click(last_mode);

    bind_keys();
});
