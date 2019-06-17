var ik = require('./lib/ite_keyboard.js')
var iks = require('./lib/ite_keyboard_state.js')

var argv = process.argv.slice(2);
if (argv.length == 0) {
  console.log("usage: node index.js [cmd] [args]");
  console.log("where 'cmd' and 'args' can be:");
  console.log("  mode [off | fade | wave | dots | rainbow | explosion | snake | raindrops]");
  console.log("  color [row[-row]] [col[-col]] [color name]");
  console.log("\nExamples:");
  console.log("  # node index.js mode snake                     starts snake mode");
  console.log("  # node index.js color 0 ALL red                red on all row 0 keys");
  console.log("  # node index.js color 0,5 ALL red \\            red on rows 0 and 5");
  console.log("       color 2-4 ALL white                       and white on rows 2 to 4");
  console.log("  # node index.js color 1,4-5 0-1,18-19 yellow   yellow for the first and");
  console.log("                                                 last 2 keys of rows 1, 4 and 5");
  process.exit(0);
}

function getrange(s, max) {
  let r = [];
  let l = s.split(',');
  for (let i = 0; i < l.length; i++) {
    let x = l[i].split('-');
    if (x.length === 1) {
      if (x[0] === 'ALL') {
        for (let j = 0; j <= max; j++) {
          r.push(j);
        }
      } else {
        r.push(parseInt(x[0]));
      }
    } else {
      for (let j = parseInt(x[0]); j <= parseInt(x[1]); j++) {
        r.push(j);
      }
    }
  }
  return r;
}

k = new ik.IteKeyboard(0x048d, 0xce00);
k.initialize(() => {
  state = new iks.IteKeyboardState();

  for (var c = 0; c < argv.length; c++) {
    if (argv[c] === 'mode') {
      k.setMode(argv[++c]);

    } else if (argv[c] === 'color') {

      let rows = getrange(argv[++c], 5);
      let cols = getrange(argv[++c], 21);
      let color = argv[++c];
      //console.debug("set '" + color + "' on rows " + rows + " and columns " + cols);
      for (let row in rows) {
        let r = rows[row];
        for (let col in cols) {
          let c = cols[col];
          state.setKeyColor(r, c, color);
        }
      }
    }
  }

  k.sendKeystate(state);
});