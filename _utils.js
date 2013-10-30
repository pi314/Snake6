var interface_init = function () {
    panel_init();
    field_init();
};

var panel_init = function () {
   var s1 = gen_snake_info_panel("↑←↓→", 'green');
   var s2 = gen_snake_info_panel("wads", 'yellow');
   var game_mode_prompt = '<div class="game_mode">遊戲模式</div>';
   var game_mode_field  = '<div class="game_mode">[ <span id="game_mode">經典</span> ]</div>';
   var reset_button = '<div class="button">reset</div>';
   var main_menu_button = '<div class="button">主選單</div>';
   $('#info').html(s1 + s2 + game_mode_prompt + game_mode_field + reset_button + main_menu_button);
};

var gen_snake_info_panel = function (dir, color) {
   var s = '';
   s += '<div class="snake_info">'
   s += '<div class="block ' + color + '_body"></div>';
   s += '<div class="block ' + color + '_body"></div>';
   s += '<div class="block ' + color + '_head"></div>';
   s += '<span class="number">3</span>';
   s += '<br>';
   s += '<div class="control"></div>';
   s += '<div class="control">' + dir[0] + '</div><br>';
   s += '<div class="control">' + dir[1] + '</div>';
   s += '<div class="control">' + dir[2] + '</div>';
   s += '<div class="control">' + dir[3] + '</div><br>';
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
