## jAnimate - A Declarative and JS friendly animation framework for you Mobile Apps

[jAnimate.js](https://github.com/JustinWinthers/janimate) is an animation library that you can use
for basic or advanced animations in your projects.  The animation functions can build on top of
each other and create awesome visualizations.  Have fun experimenting.

## The low down

jAnimate is in it's infancy and I'd love for other developers to join and help out the project.  The
idea is that animations should be declarative without having to use a ton of CSS.  It looks and feels
a lot like web components or Angular directives in it's implementation but janimate does not have any
dependencies and uses pure javascript to manipulate element styles so the developer can leverage web
transitions and transforms in a fast and easy to understand way.

## How to install

It's simple:


```
bower install janimate
```

### How do I use it?
The most common example of how to use this tool follows.  Send in a
an object literal and path to an html template.  The default
tokens for finding a variable to replace are {{ and }}.  The object
property names must match the variable names in the template.  The object
can be an infinite number of levels deep.


```js
 var quickTemplate = require('./quickTemplate');
 var json = require('./scope.json');  //this can be a json file or any object literal

 quickTemplate(json, __dirname + '/partial.html', function(err, data){
 console.log (data);
 });
```

## Sending in an html string instead of file

You can send in an html string as well instead of a path to a file.
 If so, you must send in the options parm with 'string' set to true.
 Additionally, you can override the tokens used for variable replacement
 as part of the options object as well by substituting your preferred values
 for the tokenLeft and tokenRight properties.

```js
 quickTemplate(json, "<p>{{ foo  }}  <span> {{ bar }} </span></p>", {string:true}, function(err, data){
 console.log (data);
 });

```

in the above example the json object would look like:

```
 {"foo":"some value","bar":"some other value"}
```

## Customize your template tokens

Using the example above, you can use any delimiter you choose in your document.  quickTemplate defaults to
double mustaches, but you can use the tokenLeft and tokenRight options to customize the tokens used as
in this example....

```js
 quickTemplate(json, "<p><% foo  %>  <span> <% bar %> </span></p>", {string:true, tokenLeft:'<%', tokenRight:'%>'}, function(err, data){
 console.log (data);
 });

```

in the above example the json object would still look exactly the same:

```
 {"foo":"some value","bar":"some other value"}
```


## Authors

**Justin Winthers**

+ https://github.com/JustinWinthers


## License

Copyright 2014 Digital Advisors, LLC

Licensed under the Apache License, Version 2.0: http://www.apache.org/licenses/LICENSE-2.0