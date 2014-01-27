$(function () {
#_user_interface.js
#_utils.js
#_game_map.js
#_game_snake.js
#_game_engine.js

    init();
    //set_state('MENU');
    set_state('GAME_RESET');

    $('#start_game.button').click(enter_game);
    $('#reset.button').click(function () {
        set_state('GAME_RESET');
    });
    $('#back2menu.button').click(back2menu);
    $('.snake_info').click(set_control_source);

    bind_keys();
});
