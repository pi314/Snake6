var timer = 0;
var time_unit = 300;

var start_timer = function () {
    timer = setInterval(function () {
        for (var a = 0; a < snake.length; a++) {
            move_tail(a);
        }

        for (var a = 0; a < snake.length; a++) {
            move_head(a);
        }
    }, time_unit);
};

var stop_timer = function () {
    clearInterval(timer);
}
