export class EventEmitter {
    parent;

    eventListeners = {};
    eventListenersOnce = {};

    constructor(options) {
        if(!options) { return this; }
        this.parent = options.parent;
    }

    on(eventName, callback) {
        this.eventListeners[eventName] = this.eventListeners[eventName] || [];
        this.eventListeners[eventName].push(callback);
    }

    once(eventName, callback) {
        this.eventListenersOnce[eventName] = this.eventListenersOnce[eventName] || [];
        this.eventListenersOnce[eventName].push(callback);
    }

    off(eventName, callback) {
        if(!callback) {
            if(!eventName) {
                for(let key in this.eventListeners) {
                    delete this.eventListeners[key];
                }
                for(let key in this.eventListenersOnce) {
                    delete this.eventListenersOnce[key];
                }
            } else {
                delete this.eventListeners[eventName];
            }
        } else {
            this.eventListeners[eventName] = this.eventListeners[eventName] || [];
            this.eventListenersOnce[eventName] = this.eventListenersOnce[eventName] || [];
            for(let i = 0; i < this.eventListeners[eventName].length; i++) {
                if(this.eventListeners[eventName][i] == callback) {
                    this.eventListeners[eventName].splice(i, 1);
                    i--;
                }
            }
            for(let i = 0; i < this.eventListenersOnce[eventName].length; i++) {
                if(this.eventListenersOnce[eventName][i] == callback) {
                    this.eventListenersOnce[eventName].splice(i, 1);
                    i--;
                }
            }
        }
    }

    emit(eventName, event) {
        event = event || {};
        if(!event.target) {
            event.target = this;
            event.emitter = this;
        }

        this.eventListeners[eventName] = this.eventListeners[eventName] || [];
        this.eventListenersOnce[eventName] = this.eventListenersOnce[eventName] || [];

        this.eventListeners[eventName].forEach(callback => {
            if(event) { callback(event); } else { callback(); }
        });
        this.eventListenersOnce[eventName].forEach(callback => {
            if(event) { callback(event); } else { callback(); }
        });
        delete this.eventListenersOnce[eventName];

        if(this.parent instanceof EventEmitter && event.propagate) {
            event.emitter = this;
            this.parent.emit(eventName, event);
        }
    }

    destroy() {

    }
}