var ik = require('./lib/ite_keyboard.js')
var iks = require('./lib/ite_keyboard_state.js')

k = new ik.IteKeyboard(0x048d, 0xce00);
k.initialize(() => {
  state = new iks.IteKeyboardState();
  state.setKeyColor(0, 0, 'white');
  k.sendKeystate(state);
  
  //var argv = process.argv.slice(2);
  //cmd.setByte(parseInt(argv[0]), parseInt(argv[1]), 0xff);
  //k.send(cmd);
  //k.setMode(parseInt(argv[0]));
});
