$(function () {
#_utils.js
#_game.js
    interface_init();

    set_state('GAME');

    $('#start_game_button').click(enter_game);
    $('.snake_info').click(set_control_source);
});
