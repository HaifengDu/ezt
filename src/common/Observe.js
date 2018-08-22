var VueMixinObserve = (function () {
    function VueMixinObserve(context) {
        this.context = context;
        this.observerList = [];
    }
    VueMixinObserve.prototype.addObserver = function (observer) {
        if (this.observerList.indexOf(observer) === -1) {
            this.observerList.push(observer);
        }
    };
    VueMixinObserve.prototype.removeObserver = function (observer) {
        var index = this.observerList.indexOf(observer);
        if (index > -1) {
            this.observerList.splice(index, 1);
        }
    };
    VueMixinObserve.prototype.publish = function (type) {
        var _this = this;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        this.observerList.forEach(function (item) {
            var eventTypes = item.$$SubscribeEventTypes;
            if (eventTypes && eventTypes[type] && eventTypes[type].length) {
                eventTypes[type].forEach(function (item) {
                    item.apply(_this.context, args);
                });
            }
        });
    };
    return VueMixinObserve;
}());
export var observerableMixin = {
    created: function () {
        if (!this.$cusOberverable) {
            this.$cusOberverable = new VueMixinObserve(this);
            this.$IS_OBERVERABLE = true;
        }
    },
    methods: {
        publish: function (type, args) {
            this.$cusOberverable.publish(type, args);
        }
    }
};
export var observerMixin = {
    created: function () {
        var $parent = this.$parent || this.$root;
        this.$$SubscribeEventTypes = {};
        while ($parent) {
            if ($parent.$IS_OBERVERABLE) {
                var observerable = $parent.$cusOberverable;
                observerable.addObserver(this);
            }
            var temp = $parent;
            $parent = $parent.$parent || $parent.$root;
            if ($parent === temp) {
                $parent = null;
            }
        }
    },
    methods: {
        subscribe: function (type, cb) {
            var current = this.$$SubscribeEventTypes[type];
            if (!current) {
                this.$$SubscribeEventTypes[type] = current = [];
            }
            current.push(cb);
        }
    }
};
