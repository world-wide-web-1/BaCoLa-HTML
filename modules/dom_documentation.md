# DOM Documentation

- [Creating and Modifying Elements](#creating_modifying)
  - [Creating Elements](#creating)
  - [Modifying Elements](#modifying)
- [Selecting Elements](#selecting)
  - [`document` and `documentElement`](#document_documentelement)
- [Getting Data From Elements](#getting_data)

# <p id="creating_modifying"></p>Creating and Modifying Elements
> ### <p id="creating"></p>Creating Elements
> > To create an element, you use the `createElement` function.
> > ```
> > createElement <type: string>
> > ```
> > Example:
> > ```
> > p = (createElement "p").
> ### <p id="modifying"></p>Modifying Elements
> > There are mny different ways to modify elements.
> > ```
> > setInnerText <element> = <value>.
> > ```
> > ```
> > setInnerHTML <element> = <value>.
> > ```
> > ```
> > setAttribute <element> = <attribute: string> <value>.
> > ```
> > ```
> > appendChild <element> <child>.
> > ```
# <p id="selecting"></p>Selecting Elements
> There is one way to get elements, and you can only select the first output (if there are multiple)
> ```
> CSSSelect <selector: string>
> ```
> Example:
> ```
> element = (CSSSelect "#p").
> ```
> ### <p id="document_documentelement"></p>`document` and `documentElement`
> > You can get the document from the `document` selector.\
> > You can also get the document element from the `documentElement` selector.
# <p id="getting_data"></p>Getting Data From Elements
> There also ways to read elements too.
> ```
> getInnerText <element>
> ```
> ```
> getInnerHTML <element>
> ```
> ```
> getAttribute <element> = <attribute: string>
> ```