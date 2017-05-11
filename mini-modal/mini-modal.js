var minimodal = (function () {
    function minimodal(conf) {
        var self = this;

        this.conf = conf;        
        this.modals = [];                

        try {
            this.defaultSettings();
            this.init();
        } 
        catch (e) {
            self.onerror(e.message);
        }
    }

    minimodal.prototype.onclick = function () {

    }

    minimodal.prototype.defaultSettings = function () {
        if (typeof(this.conf) == 'undefined')
            this.conf = {};
        
        if (typeof (this.conf.maxHeight) == 'undefined')
            this.conf.height = 250;

        if (typeof (this.conf.padding) == 'undefined')
            this.conf.padding = 50;
    }

    minimodal.prototype.init = function () {
        var self = this;
        this.createItems();
        this.addEventListener(window, 'resize', function () { self.modalResize(); });
        this.modalResize();
    }

    minimodal.prototype.createItems = function() {
        var elModals = minimodal.getElementsByClassName('mini-modal');
        if (elModals) {
            for (var ii = 0; ii < elModals.length; ii++) {
                this.modals.push(this.itemFab(elModals[ii]));
            }
        }
    }

    minimodal.prototype.itemFab = function(el) {
        var self = this;
        var item = new minimodalitem(this.conf, el);

        this.addEventListener(item.elModal, 'click', function (e) {
            self.clickHandler(e, item.elModal);
        });

        return item;
    }

    minimodal.prototype.modalResize = function () {
        for (var ii = 0; ii < this.modals.length; ii++) {
            this.modals[ii].modalResize();
        }
    }

    minimodal.prototype.clickHandler = function (e, elModal) {
        if (typeof (this.onclick) != 'function')
            return;

        if (typeof (e) == 'undefined')
            return;

        e.modal = elModal;
        this.onclick.call(elModal, e);
    }

    minimodal.prototype.show = function(id) {
        if (typeof(id) == 'undefined')
            return;

        var modal = this.findModalById(id);
        if (typeof (modal) == 'undefined')
            return;
        
        modal.show();
    }

    minimodal.prototype.hide = function (id) {
        if (typeof (id) == 'undefined')
            return;

        var modal = this.findModalById(id);
        if (typeof (modal) == 'undefined')
            return;

        modal.hide();
    }

    minimodal.prototype.findModalById = function (id) {
        if (typeof(id) == undefined || id.length == 0)
            return;

        if (!minimodal.isArray(this.modals))
            return;

        for (var ii = 0; ii < this.modals.length; ii++) {
            if (this.modals[ii].elModal.id == id)
                return this.modals[ii];
        }

        return;
    }

    minimodal.prototype.addEventListener = function (o, e, f) {
        if ('addEventListener' in window)
            o.addEventListener(e, f, false);
        else if ('attachEvent' in window) //IE
            o.attachEvent('on' + e, f);
    }
    
    minimodal.prototype.onerror = function (msg) {
        console.error(msg);
    }

    // static functions
    minimodal.isArray = function (o) {
        if (!o)
            return false;

        if (typeof (Array.isArray) !== "undefined")
            return Array.isArray;

        if (typeof (o) === 'object')
            return (Object.prototype.toString.call(o) == '[object Array]');

        return false;
    }

    minimodal.getElementsByClassName = function (className) {
        var found = [];
        var elements = document.getElementsByTagName("*");
        for (var i = 0; i < elements.length; i++) {
            var names = elements[i].className.split(' ');
            for (var j = 0; j < names.length; j++) {
                if (names[j] == className) found.push(elements[i]);
            }
        }

        return found;
    }    

    return minimodal;
})();

var minimodalitem = (function () {
    function minimodalitem(conf, el) {
        var self = this;
        this.elModal = el;
        this.elModalHeader = minimodal.getElementsByClassName('mini-modal-header')[0];
        this.elModalBody = minimodal.getElementsByClassName('mini-modal-body')[0];
        this.elModalFooter = minimodal.getElementsByClassName('mini-modal-footer')[0];       
        this.conf = conf;
        
        this.hide();
    }    

    minimodalitem.prototype.show = function() {
        this.elModal.style.display = '';
    }

    minimodalitem.prototype.hide = function () {
        this.elModal.style.display = 'none';
    }

    minimodalitem.prototype.modalResize = function (e) {
        var vp = new viewport();

        this.elModal.style.left = this.conf.padding + 'px';
        this.elModal.style.top = this.conf.padding + 'px';
        this.elModal.style.width = (vp.viewportwidth - this.conf.padding * 2).toString() + 'px';
        this.elModal.style.maxHeight = this.conf.maxHeight + 'px';
    }    

    minimodalitem.prototype.getElementsByClassName = function (className) {
        if (typeof(className) == 'undefined' || className.length == 0)
            throw new Error('Class name is empty');

        var elements = minimodal.getElementsByClassName(className);
        if (!minimodal.isArray(elements) || elements.length == 0)
            throw new Error('Element by class name ' + className + ' not found');

        return elements;
    }
        
    return minimodalitem;
})();

var viewport = (function () {    

    function viewport() {
        this.viewportwidth = 0;
        this.viewportheight = 0;

        this.calc();
    }

    viewport.prototype.calc = function () {
        if (typeof window.innerWidth != 'undefined') {
            this.viewportwidth = window.innerWidth,
            this.viewportheight = window.innerHeight
        }
        // IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
        else if (typeof document.documentElement != 'undefined'
            && typeof document.documentElement.clientWidth !=
            'undefined' && document.documentElement.clientWidth != 0) {
            this.viewportwidth = document.documentElement.clientWidth,
            this.viewportheight = document.documentElement.clientHeight
        }
        // older versions of IE
        else {
            this.viewportwidth = document.getElementsByTagName('body')[0].clientWidth,
            this.viewportheight = document.getElementsByTagName('body')[0].clientHeight
        }
    }

    return viewport;
})();