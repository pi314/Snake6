$(function () {
#_user_interface.js
#_utils.js
#_game_map.js
#_game_snake.js
#_game_timer.js

    var init = function () {
        interface_init();
        construct_snake();
        construct_map();
        put_snake_on_map();

        //set_state('MENU');
        set_state('GAME_PAUSE');
    };

    init();

    $('#start_game.button').click(enter_game);
    $('#reset.button').click(init);
    $('#back2menu.button').click(back2menu);
    $('.snake_info').click(set_control_source);

    KeyManager.keydown('SPACE', function () {
        switch (get_state()) {
        case 'MENU': break;
        case 'GAME_PAUSE':
            set_state('GAME_ING');
            break;
        case 'GAME_ING':
            set_state('GAME_PAUSE');
            break;
        }
    });
});
