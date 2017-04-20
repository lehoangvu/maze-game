export default class Device {
    constructor() {
        this.ev = {};
        this.defaultEv = {
            gamma : 0,
            beta : 0,
            alpha : 0
        };

        if (!window.DeviceOrientationEvent) return false;

        this._windowOrientation = 0;

        let _this = this;

        window.addEventListener("deviceorientation", function(ev) {
            _this.ev = ev;
            // if(!_this.defaultEv) _this.defaultEv = _this.ev;
        }, false);

        window.addEventListener("orientationchange", function(ev) {
            _this._windowOrientation = window.orientation;
        }, false);

        // this.setDefault();

        this._windowOrientation = window.orientation;
    }

    setDefault() {
        this.defaultEv = false;
    }

    getX() {
        return this.ev.gamma - this.defaultEv.gamma;
    }

    getY() {
        return this.ev.beta - this.defaultEv.beta;
    }

    getOrientZ() {
        return this.ev.alpha - this.defaultEv.alpha;
    }

    getXDeg() {
        switch (this._windowOrientation) {
            case 90:
                return -this.getX();
                break;
            case 0:
                return this.getY();
                break;
            case -90:
                return this.getX();
                break;
            case 180:
                return this.getY();
                break;
        }
    }

    getYDeg() {
        switch (this._windowOrientation) {
            case 90:
                return -this.getY();
                break;
            case 0:
                return -this.getX();
                break;
            case -90:
                return this.getY();
                break;
            case 180:
                return this.getX();
                break;
        }
    }

    getZDeg() {
        return this.getOrientZ();
    }
}
