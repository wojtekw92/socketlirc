# socketlirc
nodejs socket lircd client. This module is ES6 class.


##how to use
```javascript
const Lirc = require('socketlirc');
let lirc = new Lirc('127.0.0.1', 8700);

lirc.connect().then(() => {
  lirc.setRemoteController('samsungTV');
  return lirc.sendCommand('KEY_POWER');
}).then((resp) => {
  console.log(resp);
  lirc.disconnect();
}).catch((err) => {
  console.log(err);
});
```

##API

`constructor(host, port)` class constructor

`connect()` connect to socket

`disconnect()`

`getRemoteControllers()`

`getRemoteControllerData(name)`

`getActiveRemoteController()`

`setRemoteController(name)`

`sendCommand(command)`


