# BaCoLa HTML
### Note: This programming language doesn't work on Windows as the site host for some reason, I am trying to fix it.
- [About BaCoLa HTML](#about)
  - [Differences](#differences)
  - [Documentations](#documentations)

# <p id="about"></p>About BaCoLa HTML
> BaCoLa HTML is based off of my [original project](https://github.com/world-wide-web-1/BaCoLa), but I had realized that because I built the interpreter in JavaScript, I could possibly write the language to support HTML pages.\
> And, here we are, it's written in basically all the same way.\
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
> > BaCoLa scripts and modules are ran using the `<script>` tag:
> > ```
> > <script is="bacola-module" src="[path]"></script>
> > <script is="bacola-script" src="[path]"></script>
> > ```
> > And, because of this, you can also run it inside the script tag as shown:
> > ```
> > <script is="bacola-module">
> >   print = "Hello, BaCoLa Module!".
> > </script>
> >
> > <script is="bacola-script">
> >   print = "Hello, BaCoLa!".
> > </script>
> > ```
> > [arrays_documentation.md](modules/arrays_documentation.md)\
> > [math_documentation.md](modules/math_documentation.md)\
> > [dom_documentation.md](modules/dom_documentation.md)
# Remember this, it is **very** bad to plagiarize.
###### The original repository lives [here](https://github.com/world-wide-web-1/BaCoLa-HTML)
