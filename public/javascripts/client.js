// Client for SVG --> PNG
// Requires jQuery to already be loaded

(function(){
    var queue = [];

    $('svg').each(function(){
        queue.push({
            element : this,
            string  : new XMLSerializer().serializeToString(this)
        });
    });

    // Process one at a time
    (function process(queue){
        var item = queue.shift();

        // POST to converter, expect a png in response
        $.post('http://sharkfin.alex:3000/svg/png', item.string).success(function(response){
            $(item.element)
                .addClass('lol');
        });

        if (queue.length) process(queue);
    })(queue)
})()
