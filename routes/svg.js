
/*
* GET users listing.
*/
var fs = require('fs'),
    svg2png = require('svg2png'),
    Spooky = require('spooky');

function getAll(url, cb){
    var spooky = new Spooky({}, capture);

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

        spooky.then([{ url : url, cb : cb }, function () {

            url = url.replace('http://', '').replace('https://', '');

            // Determine number of svgs 
            var visible = this.evaluate(function() {
                var elements = __utils__.findAll('svg');
                return elements.length;
            });

            this.viewport(1024, 768);

            // Capture every svg
            for (var i=1; i <= visible; i++){
                var path = '/tmp/' + url + '/svg-' + i + '.png',
                    selector = 'svg:nth-of-type(' + i + ')';

                this.captureSelector(path, selector);
            }
            if (typeof(cb) === 'function'){
                this.run(cb);
            }
            this.exit();
        }]);
        spooky.run();

        return;
    }
}

function getOne(res, url, num){
    var stripped = url.replace('http://', '').replace('https://', ''),
        path = '/tmp/' + stripped + 'svg-' + num + '.png';

    console.log(path);

    fs.readFile(path, function(err, data){
        if (err){
            console.log(url, num);
            // Could not read data.  Let's get the svgs from the page and try again.
            getAll(url, function(){
                getOne(url, num);
            });
        } else {
            res.writeHead(200, {'Content-Type': 'image/png' });
            res.end(data);
        }
    });
}

// Get all SVGs on a page and put them in the memory store
exports.getAll = function(req, res){
    var args = req.body,
        url = args.url;

    getAll(url);
};

exports.getOne = function(req, res){
    var args = req.params,
        url = args.url,
        num = args.num;

    getOne(res, url, num);
};

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
