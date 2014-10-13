dr-webfont-inliner
==================

Inline webfonts in stylesheets.


## Usage:

### Command:

```
webfont-inliner <file> [options]
```

#### Options:

* `-o, --output [string]` - Path to write output to. Defaults to appending `-inline` to input name, eg `style.css` will result in `style-inline.css`.

##### Examples:

Output stylesheet with inlined fonts at the same location as the source:
```
webfont-inliner style.css
```

Output stylesheet with inlined fonts in another location:
```
webfont-inliner my/path/style.css -o my/other/path/style.css
```

### Module:

#### Arguments

* `input` - Path to the stylesheet that needs to get webfonts inlined.
* `output` - Optional. Path to write output to. Defaults to appending `-inline` to input name (unless `callback` is defined).
* `callback` - Optional. A callback to receive inlined css.

##### Examples:

Output stylesheet with inlined fonts at the same location as the source:

```javascript
var inline = require("dr-webfont-inliner");

inline("style.css", function (css) {
	console.log("inlined css:", css);
});
```

Output stylesheet with inlined fonts in another location:

```javascript
var inline = require("dr-webfont-inliner");

inline("my/path/style.css", "my/other/path/style.css")
```

---

## Changelog

### 0.4.0

Changes:

* Now fully async.

Features:

* Added `callback` argument.

### 0.3.0

Features:

* woff2 added.