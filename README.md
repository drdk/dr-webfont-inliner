dr-inline-webfont
=================

Inline webfonts in stylesheets.


## Usage:

```
phantomjs index.js <file> [options]
```

#### Options:

* `-o, --output [string]` - Path to write output to. Defaults to appending `-inline` to input name.

##### Examples:

Output stylesheet with inlined fonts at the same location as the source:
```
phantomjs index.js style.css
```

Output stylesheet with inlined fonts in another location:
```
phantomjs index.js my/path/style.css -o my/other/path/style.css
```
