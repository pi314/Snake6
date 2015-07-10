var interface_init = function () {
    main_menu_init();
    panel_init();
    field_init();
};

var main_menu_init = function () {
    var md = state_machine.get_mode_description();
    $('#mode_name').html(md[0]);
    $('#mode_description').html(md[1]);
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

var MAP_WIDTH = 25;
var MAP_HEIGHT = 25;

var field_init = function () {
    var s = '';
    for (var a = 0; a < MAP_HEIGHT; a++) {
        for (var b = 0; b < MAP_WIDTH; b++) {
            s += '<div class="block ground" id="block_'+a+'_'+b+'"></div>';
        }
        s += '<br>';
    }
    $('#field').html(s);
};

var message_row = 8;
var show_pause_message = function () {
    var message = '請按空白鍵開始遊戲';
    var padding_left = (MAP_WIDTH - message.length) / 2;
    for (var a = 0; a < message.length; a++) {
        $('#block_'+message_row+'_'+(a+padding_left)).text(message[a]);
    }
};

var clear_pause_message = function () {
    for (var a = 0; a < MAP_WIDTH; a++) {
        $('#block_'+message_row+'_'+a).text('');
    }
}
