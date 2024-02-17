# BaCoLa HTML

- [About BaCoLa HTML](#about)
  - [Differences](#differences)
  - [Documentations](#documentations)

# <p id="about"></p>About BaCoLa HTML
> BaCoLa HTML is based off of my [original project](https://github.com/world-wide-web-1/BaCoLa), but I had realized that because I built the interpreter in JavaScript, I could possibly write the language to support HTML pages.\
> And, here we are, it's written in basically all the same way.
> [GitHub Website](https://world-wide-web-1.github.io/BaCoLa-HTML/)
> ### <p id="differences"></p>Differences
> > There are some functions compared to the original version,\
> > but it is basically the same. This version removes some functions\
> > for things like filesystems, etc.\
> > This also disables most (all?) module commands.\
> > If you want to load a module, you should use `<bacola_module src="[path]"></bacola_module>`
> ### <p id="documentations"></p>Documentations
> > Whenever you want to manually run a file, use the JavaScript `executeBaCoLa` function.
> > ```
> > executeBaCoLa(src);
> > ```
> > If you want to load a module manually, use this:
> > ```
> > executeBaCoLa(src, 1);
> > ```
> > By default, all `<bacola_module>` and `<bacola>` tags are ran in order when the window loads.
> > ```
> > <bacola_module src="[path]"></bacola_module>
> > <bacola src="[path]"></bacola>
> > ```
> > [arrays_documentation.md](modules/arrays_documentation.md)\
> > [math_documentation.md](modules/math_documentation.md)\
> > [dom_documentation.md](modules/dom_documentation.md)
