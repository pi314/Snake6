$(function () {
/* General Used functions and variables */
var STATE = 'MENU';

var interface_init = function () {
    panel_init();
    field_init();
};

var panel_init = function () {
   var s1 = gen_snake_info_panel("↑←↓→", 'green');
   var s2 = gen_snake_info_panel("wads", 'yellow');
   $('#snake_info_panel').html(s1 + s2);
};

var gen_snake_info_panel = function (dir, color) {
   var s = '';
   s += '<div class="snake_info">'
   s += '<div class="block ' + color + '_body"></div>';
   s += '<div class="block ' + color + '_body"></div>';
   s += '<div class="block ' + color + '_head"></div>';
   s += '<span class="number">3</span>';
   s += '<br>';
   s += '<div class="control_source_player">';
   s += '<div class="control"></div>';
   s += '<div class="control">' + dir[0] + '</div><br>';
   s += '<div class="control">' + dir[1] + '</div>';
   s += '<div class="control">' + dir[2] + '</div>';
   s += '<div class="control">' + dir[3] + '</div><br>';
   s += '</div>';
   s += '<div class="control_source_AI">';
   s += 'AI';
   s += '</div>';
   s += '<div class="control_source_none">';
   s += 'None';
   s += '</div>';
   s += '</div>';
   return s;
};

var field_init = function () {
    var s = '';
    for (var a = 0; a < 25; a++) {
        s += '<div class="block ground"></div>';
    }
    s += '<br>';
    var ss = '';
    for (var a = 0; a < 25; a++) {
        ss += s;
    }
    $('#field').html(ss);
};

var set_state = function (new_state) {
    STATE = new_state;
    switch (STATE) {
    case 'MENU':
        $('#main_menu').css('display', 'block');
        $('#game_field').css('display', 'none');
        break;
    case 'GAME':
        $('#main_menu').css('display', 'none');
        $('#game_field').css('display', 'block');
        break;
    }
}
/* Game engine related functions and variables */
var control_source = ['PLAYER', 'PLAYER'];

var enter_game = function () {
    set_state('GAME');
    /* snake position initialize to map upper right and lower down*/
};

var set_control_source = function () {
    console.log(this);
    var snake_index = $('.snake_info').index(this);
    console.log(snake_index);
    console.log(control_source[snake_index]);

    switch (control_source[snake_index]) {
    case 'PLAYER':
        $(this).children('.control_source_player').css('display', 'none');
        $(this).children('.control_source_AI').css('display', 'block');
        control_source[snake_index] = 'AI';
        break;
    case 'AI':
        $(this).children('.control_source_AI').css('display', 'none');
        $(this).children('.control_source_none').css('display', 'block');
        control_source[snake_index] = 'NONE';
        break;
    case 'NONE':
        $(this).children('.control_source_none').css('display', 'none');
        $(this).children('.control_source_player').css('display', 'block');
        control_source[snake_index] = 'PLAYER';
        break;
    }
}
    interface_init();

    set_state('GAME');

    $('#start_game_button').click(enter_game);
    $('.snake_info').click(set_control_source);
});
