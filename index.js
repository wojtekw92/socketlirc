'use strict';
const net = require('net');


class Lirc {
  constructor(host, port) {
    this.host = host;
    this.port = port;
    this.data = '';
  }

  connect() {
    return new Promise((resolve, reject )=> {
      this.client = net.connect({host: this.host, port: this.port});
      this.client.on('data', (data) => {
        if(/^BEGIN\n?/gm.test(data.toString())) {
          this.data = '';
        }
        this.data += data.toString();
        if(/END\n?$/gm.test(data.toString())) {
          let arr = this.data.split(/\r?\n/);
          let out = {
            status: arr[2],
            command: arr[1],
            data: null,
          };
          if (arr[3] === 'DATA') {
            out.data = arr.slice(5, 5 + parseInt(arr[4], 10));
          }
          if (this.cb) this.cb(out);
        }
      });
      resolve();

    });
  }

  disconnect() {
    if (this.client) {
      this.client.end();
    }
  }

  getRemoteControllers() {
    this.client.write('LIST\n');
    return new Promise((resolve, reject) => {
        this.cb = (data) => {
          resolve(data);
          this.cb = undefined;
        }
    });
  }

  getRemoteControllerData(name) {
    this.client.write('LIST ' + name + '\n');
    return new Promise((resolve, reject) => {
        this.cb = (data) => {
          resolve(data);
          this.cb = undefined;
        }
    });
  }

  getActiveRemoteController() {
    return this.rcu;
  }

  setRemoteController(name) {
    this.rcu = name;
  }

  sendCommand(command) {
    this.client.write('SEND_ONCE ' + this.rcu + ' ' + command + '\n');
    return new Promise((resolve, reject) => {
        this.cb = (data) => {
          resolve(data);
          this.cb = undefined;
        }
    });
  }
};

module.exports = Lirc;
