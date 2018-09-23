var rgbcolor = require('rgb-color');

class IteKeyboardState {
  constructor() {
    this.msg = Array.from(Array(6), () => Array.from(Array(64), () => { return 0; }));
  }

  sendToEndpoint(endpoint, callback) {
    this.sendFragment(endpoint, 0, callback);
  }

  setKeyColor(row, column, color) {
    var c = rgbcolor(color).channels();
    console.debug(c);
    this.msg[row][column + 0] = c.b;
    this.msg[row][column + 22] = c.g;
    this.msg[row][column + 42] = c.r;
    console.debug(this.msg[row].length);
  }

  bufferString(row) {
    var r = "";
    for (var i = 0; i < this.msg[row].length; i++) {
      r += String.fromCharCode(this.msg[row][i]);
    }
    return r;
  }

  sendFragment(endpoint, index, callback) {
    var ctrlbuf = [0x16, 0, index, 0, 0, 0, 0, 0];
    endpoint.device.controlTransfer(0x21, 9, 0x300, 1, Buffer.from(ctrlbuf), (error, data) => {
      if (error) {
        throw error;
      }

      endpoint.transfer(this.bufferString(index), (error) => {
        if (error) {
          throw error;
        }

        if (index + 1 < this.msg.length) {
          this.sendFragment(endpoint, index + 1);
        } else {
          if (callback) {
            callback();
          }
        }
      });
    });
  }
}

module.exports.IteKeyboardState = IteKeyboardState;
