'use strict'

var usb = require('usb');

class IteKeyboard {
  constructor(vendorId, productId) {
    this.vendorId = vendorId;
    this.productId = productId;

    this.setupCommand = [
      0x08, 0x02, 0x33, 0x00, 0x24, 0x00, 0x00, 0x00
    ];

    this.modes = {
      off: [0x08, 0x02, 0x03, 0x05, 0x00, 0x08, 0x01, 0x00], // off
      fade: [0x08, 0x02, 0x02, 0x05, 0x32, 0x08, 0x00, 0x00], // fade
      wave: [0x08, 0x02, 0x03, 0x05, 0x32, 0x08, 0x00, 0x00], // wave
      dots: [0x08, 0x02, 0x04, 0x05, 0x32, 0x08, 0x00, 0x00], // dots
      rainbow: [0x08, 0x02, 0x05, 0x05, 0x32, 0x08, 0x00, 0x00], // rainbow
      explosion: [0x08, 0x02, 0x06, 0x05, 0x32, 0x08, 0x00, 0x00], // explosion
      snake: [0x08, 0x02, 0x09, 0x05, 0x32, 0x08, 0x00, 0x00], // snake
      raindrops: [0x08, 0x02, 0x0a, 0x05, 0x32, 0x08, 0x00, 0x00]  // raindrops
    }
      // these two don't seem to activate always. probably need to understand something 
      // else with the protocol. I don't know what most of the fields mean
      //[0x08, 0x02, 0x07, 0x05, 0x32, 0x08, 0x00, 0x00], // explosion_typed?
      //[0x08, 0x02, 0x08, 0x05, 0x32, 0x08, 0x00, 0x00], // trails?
    ;

    this.device = usb.findByIds(vendorId, productId);
    this.initialized = false;

    if (!this.device) {
      throw `Couldn't find USB device ${this.vendorId}:${this.productId}.`
    }
  }

  initialize(callback) {
    this.device.open();
    this.device.controlTransfer(0x21, 9, 0x300, 1, Buffer.from(this.setupCommand), (data, error) => {
      if (error) {
        throw error;
      }
      console.log("Sent initilization packet.");

      this.interface = this.getInterface(this.device);
      this.endpoint = this.getEndpoint(this.interface);

      callback();
    });
  }

  getInterface(device) {
    var interfaces = device.interfaces;
    var iface = null;

    for (var i = 0; i < interfaces.length; i++) {
      if (interfaces[i].endpoints.length > 0) {
        iface = interfaces[i];
      }
    }

    if (iface) {
      if (iface.isKernelDriverActive()) {
        console.warn("Kernel driver is attached, detaching");
        iface.detachKernelDriver();
      }
      iface.claim();
      console.debug("Claimed interface");
    }

    return iface;
  }

  setMode(mode, callback) {
    var ctrlbuf = this.modes[mode];
    this.device.controlTransfer(0x21, 9, 0x300, 1, Buffer.from(ctrlbuf), (error, data) => {
      if (error) {
        throw error;
      }

      if (callback) {
        callback();
      }
    });
  }

  getEndpoint(iface) {
    var endpoint = null;

    for (var i = 0; i < iface.endpoints.length; i++) {
      if (iface.endpoints[i].direction == "out") {
        endpoint = iface.endpoints[i];
        break;
      }
    }

    return endpoint;
  }

  sendKeystate(state, callback) {
    state.sendToEndpoint(this.endpoint, callback);
  }
};

module.exports.IteKeyboard = IteKeyboard;
