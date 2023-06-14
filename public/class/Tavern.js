const Tavern = new Proxy({ // For intermodule variables
    is_send_press: false,
    hordeCheck: false,
    mode: 'chat'
    }, {
  get(target, prop) {
    return target[prop];
  },
  set(target, prop, value) {
    target[prop] = value;
    return true;
  }
});

export {Tavern};