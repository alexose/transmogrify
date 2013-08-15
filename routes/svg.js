
/*
* GET users listing.
*/
var fs = require('fs'),
svg2png = require('svg2png');

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
