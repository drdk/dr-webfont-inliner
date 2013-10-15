var fs = require("fs"),
	path = require("path");

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

function inline (input, output) {
	input = input.replace(/\\/g, "/");
	output = output || input.replace(/(\.[^.]+)$/, "-inline$1");
	var root = input.replace(/(^|\/)[^\/]+$/, "$1"),
		css = fs.readFileSync(input, {encoding: "utf8"});
	css = css.replace(/(url\(["']?)([^"']+.(woff|ttf|eot|svg))(?:\??#[^"']+)?(["']?\))/g, function (m, cssPrefix, url, type, cssSuffix) {
		url = path.resolve(root, url);
		var data = fs.readFileSync(url),
			mime = {
				woff: "application/x-font-woff",
				ttf: "application/x-font-ttf",
				eot: "application/x-font-eot",
				svg: "image/svg+xml"
			}[type];
		return cssPrefix + "data:" + mime + ";base64," + data.toString('base64') + cssSuffix;
	});

	fs.writeFileSync(output, css);
}

module.exports = inline;