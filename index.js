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
		var id = 0;

		css = css.replace(/(url\(["']?)([^"']+.(woff[2]?|ttf|eot|svg))(?:\??#[^"']+)?(["']?\))/g, function (url) {
			url = url.replace(/(^url\(["']?)|(["']?\)$)/g, "");
			var token = "<!-- " + (id++) + " -->";
			hash[token] = function (callback) {
				url = path.resolve(root, url);
				fs.readFile(url, function (err, data) {
					callback(null, {
						type: path.extname(url),
						data: data
					});
				});
			}; 
			return token;
		});

		async.parallel(hash, function (err, results) {
			var token, result, content, type;
			var mimes = {
				".woff2": "font/woff2",
				".woff": "font/woff",
				".ttf": "font/ttf",
				".eot": "font/eot",
				".svg": "image/svg+xml"
			};

			for (token in results) {
				result = results[token];
				content = "data:" + mimes[result.type] + ";base64," + result.data.toString('base64');
				css = css.replace(token, "url(" + content + ")");
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