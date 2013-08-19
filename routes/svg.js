
/*
* GET users listing.
*/
var fs = require('fs'),
    svg2png = require('svg2png'),
    Spooky = require('spooky');

// Load an external page with spooky, save all the svgs as pngs, and serve out the images
exports.page = function(req, res){
    var args = req.body,
        url = args.url,
        spooky = new Spooky({}, capture);

    function capture(err){
        if (err) {
            e = new Error('Failed to initialize SpookyJS');
            e.details = err;
            throw e;
        }

        spooky.on('error', function (e) {
            console.error(e);
        });

        spooky.on('console', function (line) {
            console.log(line);
        });

        spooky.start(url);

        spooky.then(function () {

            // Determine number of svgs 
            var visible = this.evaluate(function() {
                var elements = __utils__.findAll('svg');
                return elements.length;
            });

            this.viewport(1024, 768);

            // Capture every svg
            for (var i=1; i <= visible; i++){
                this.captureSelector('svg-' + i + '.png', 'svg:nth-of-type(' + i + ')');
            }
            this.exit();
        });

        spooky.run();
    }
}


exports.png = function(req, res){
    var args = req.body
        , width = args.width
        , height = args.height
        , string = args.string
        , files = req.files;

    if (!string && files){
        var path = files.svg.path
            , source = path + '.svg'
            , dest = path + '.png';

        // Rename to .svg.  This is necessary for svg2png.
        fs.readFile(path, function (err, data){
            fs.writeFile(source, data, function(){
                
                // Convert svg to png.
                svg2png(source, dest, function(err){
                    
                    // Send resultant data to res
                    fs.readFile(dest, function(err, data){
                        res.writeHead(200, {'Content-Type': 'image/png' });
                        res.end(data);
                    });
                });
            });
        });
    }
    else if (string) {

        // Write a file and then pass it to svg2png 
        res.send('Nothing');
    } else {
        res.send('No SVG specified');
    }
};
