$(function () {
#_utils.js
#_game.js
    interface_init();

    set_state('GAME');

    $('#start_game.button').click(enter_game);
    $('#reset.button').click(function () {});
    $('#back2menu.button').click(back2menu);
    $('.snake_info').click(set_control_source);
});
