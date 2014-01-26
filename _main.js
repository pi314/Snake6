$(function () {
#_user_interface.js
#_utils.js
#_game_map.js
#_game_snake.js

    interface_init();

    //set_state('MENU');
    set_state('GAME_PAUSE');

    $('#start_game.button').click(enter_game);
    $('#reset.button').click(function () {});
    $('#back2menu.button').click(back2menu);
    $('.snake_info').click(set_control_source);
});
