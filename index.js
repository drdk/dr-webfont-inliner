var fs = require("fs");
var path = require("path");
var async = require("async");

if (require.main === module) {
	var optimist = require("optimist")
		.usage("Inlines webfonts in stylesheets.\nUsage: node ./index.js -o [file] input")
		.alias('o', 'output')
		.check(function(argv){
			if (!("_" in argv) || !argv._.length) {
				throw "Input param missing!";
			}
		}),
	argv = optimist.argv;
	inline(argv._[0], argv.output || null);
}

function inline (input, output, callback) {
	
	if (typeof output === "function") {
		callback = output;
		output = null;
	}

	input = input.replace(/\\/g, "/");
	if (!callback) {
		output = output || input.replace(/(\.[^.]+)$/, "-inline$1");
	}

	var root = input.replace(/(^|\/)[^\/]+$/, "$1");
	fs.readFile(input, {encoding: "utf8"}, function (err, css) {

		if (err) {
			throw(err);
		}

		var hash = {};
		
		css.match(/(url\(["']?)([^"']+.(woff[2]?|ttf|eot|svg))(?:\??#[^"']+)?(["']?\))/g).forEach(function (url) {
			url = url.replace(/(^url\(["']?)|(["']?\)$)/g, "");
			hash[url] = function (callback) {
				url = path.resolve(root, url);
				fs.readFile(url, callback);
			}
		});

		async.parallel(hash, function (err, result) {
			var url, content, type;
			var mimes = {
				".woff2": "application/x-font-woff2",
				".woff": "application/x-font-woff",
				".ttf": "application/x-font-ttf",
				".eot": "application/x-font-eot",
				".svg": "image/svg+xml"
			};

			for (url in result) {
				type = path.extname(url);
				content = "data:" + mimes[type] + ";base64," + result[url].toString('base64');
				css = css.replace(url, content);
			}

			if (typeof callback === "function") {
				if (output) {
					fs.writeFile(output, css, function () {
						callback(css);
					});
				}
				else {
					callback(css);
				}
			}
			else {
				fs.writeFile(output, css);
			}

		});

	});
}

module.exports = inline;