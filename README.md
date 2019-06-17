## ITE Per-Key RGB Keyboard Control

A node.js program to manage the per-key RGB backlight for keyboards on ITE
laptops. (In particular, mine is an 'ITE 8291')

These keyboards are very popular on TongFang machines and derivates (like Avell, Monster, Schenker and many other gamer's notebooks).

### Install:
````console
$ git clone https://github.com/fsanti68/ite-rgb-keyboard.git
````

Be sure to check out the 'features' branch.

````console
$ git checkout features
````


### How to use:


````console
$ node index.js 
usage: node index.js [cmd] [args]
where 'cmd' and 'args' can be:
  mode [off | fade | wave | dots | rainbow | explosion | snake | raindrops]
  color [row[-row]] [col[-col]] [color name]

Examples:
  # node index.js mode snake                     starts snake mode
  # node index.js color 0 ALL red                red on all row 0 keys
  # node index.js color 0,5 ALL red \            red on rows 0 and 5
       color 2-4 ALL white                       and white on rows 2 to 4
  # node index.js color 1,4-5 0-1,18-19 yellow   yellow for the first and
                                                 last 2 keys of rows 1, 4 and 5
````
