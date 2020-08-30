$(function () {
    var pane = $('#gameArea'),
    box = $('#player'),
    wh = pane.width() - box.width(),
    wv = pane.height() - box.height(),
    d = {},
    x = 5;
    
    function newh(v,a,b) {
        var n = parseInt(v, 10) - (d[a] ? x : 0) + (d[b] ? x : 0);
        return n < 0 ? 0 : n > wh ? wh : n;
    }
    
    function newv(v,a,b) {
        var n = parseInt(v, 10) - (d[a] ? x : 0) + (d[b] ? x : 0);
        return n < 0 ? 0 : n > wv ? wv : n;
    }
    
    $(window).keydown(function(e) { d[e.which] = true; });
    $(window).keyup(function(e) { d[e.which] = false; });
    
    setInterval(function() {
        box.css({
            left: function(i,v) { return newh(v, 65, 68); },
            top: function(i,v) { return newv(v, 87, 83); }
        });
    }, 20);
});