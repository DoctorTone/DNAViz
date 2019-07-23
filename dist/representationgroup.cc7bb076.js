// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"js/representationgroup.js":[function(require,module,exports) {
/**
 * Created by DrTone on 04/07/2017.
 */

/*************************
 * Representation groups API
 *
 * TODO: Use NGL.RepresentationCollection
 */
var RepresentationGroup = function RepresentationGroup(component, name, selection, representations, defaultParameters) {
  /* Representation Group
   *
   * Define a group of representations. The global visibility of this group
   * is controlled by the "visible" property.
   *
   * Arguments
   * ---------
   *
   * component	 The NGL.Component of the representations
   * name		 A string describing the group (used in GUI)
   * representations	 Optional list of representations to add
   * selection	 A selection of the subset of component atoms
   * 			 to which the representation is applied.
   * defaultParameters A dictionary of NGL.Representation parameters
   *			 to be applied to all representations.
   */
  selection = typeof selection === 'undefined' ? null : selection;
  representations = typeof representations === 'undefined' ? null : representations;
  defaultParameters = typeof defaultParameters === 'undefined' ? {} : defaultParameters;
  this.component = component;
  this.name = name;
  this.selection = selection;
  this.defaultParameters = defaultParameters;
  this.visible = false;
  this.reprList = [];
  var self = this;
  if (representations) representations.forEach(function (repr) {
    self.addRepresentation(null, repr);
  });
};

RepresentationGroup.prototype.addRepresentation = function (display_name, repr, selection) {
  /*
   * Add a representation to this group.
   *
   * Arguments
   * ---------
   *
   * display_name	 For GUI
   * repr		 The RepresentationComponent (as returned by e.g. StructureComponent.addRepresentation)
   */
  selection = typeof selection === 'undefined' ? null : selection;
  repr.display_name = display_name; // Apply default parameters

  repr.setParameters(this.defaultParameters); // Set selection if defined

  if (selection) repr.setSelection(selection);else if (this.selection) repr.setSelection(this.selection); // Hide initially

  repr.setVisibility(false);
  this.reprList.push(repr);
  return this;
};

RepresentationGroup.prototype.toggle = function () {
  // Toggle the visibility state of this group
  this.visible = !this.visible;
  this.update();
};

RepresentationGroup.prototype.setVisibility = function (what) {
  // Show/Hide all representations in group
  this.reprList.forEach(function (repr) {
    repr.setVisibility(what);
  });
};

RepresentationGroup.prototype.setParameters = function (what) {
  // Show/Hide all representations in group
  this.reprList.forEach(function (repr) {
    repr.setParameters(what);
  });
};

RepresentationGroup.prototype.setComponentParameters = function (index, what) {
  //Set parameters for this component
  if (index < 0 || index >= this.reprList.length) {
    console.log("Invalid index");
    return;
  }

  this.reprList[index].setParameters(what);
};

RepresentationGroup.prototype.setSelection = function (what) {
  // Show/Hide all representations in group
  this.reprList.forEach(function (repr) {
    repr.setSelection(what);
  });
};

RepresentationGroup.prototype.update = function () {
  // Update representation visilibity
  this.setVisibility(this.visible);
};

RepresentationGroup.prototype.all_empty = function () {
  // Check if all representations in group are empty
  return this.reprList.every(function (repr) {
    return repr.repr.structureView.atomCount == 0;
  });
};

RepresentationGroup.prototype.GUI = function (class_name, enabled) {
  /*
   * Write HTML to control the visibility of this group.
   *
   * "class_name" is the class used for the container DIV.
   */
  enabled = typeof enabled === 'undefined' ? false : enabled; // If all the representation are empty, return empty GUI

  if (this.all_empty()) return null;
  var self = this,
      c = $("<div/>", {
    "class": class_name
  }); // Enable first (only) representation

  this.enabled = 0;

  if (enabled) {
    this.toggle(true);
  }

  c.append($("<div/>").append($("<input/>", {
    "type": "checkbox",
    "id": class_name,
    "checked": enabled
  }).click(function (e) {
    self.toggle(this.checked);
  }), $("<label/>", {
    "for": class_name
  }).append(this.name)));

  if (this.reprList.length > 1) {
    var d = $("<div/>", {
      "class": "naradio"
    }),
        radioname = class_name + "radio";
    this.reprList.forEach(function (repr, i) {
      d.append($("<span/>").append($("<input/>", {
        "type": "radio",
        "name": radioname,
        "id": radioname + "_" + i,
        "checked": i == 0
      }).click(function (e) {
        self.enable(i);
      }), $("<label/>", {
        "for": radioname + "_" + i
      }).append(capitalize(repr.display_name)), "&nbsp;"));
    });
    c.append(d);
  }

  this.update();
  return c;
};
/*
 *
 */


var MutuallyExclusiveRepresentationGroup = function MutuallyExclusiveRepresentationGroup(component, name, selection, representations, defaultParameters) {
  /* Mutually exclusive Representation Group
   *
   * Define a group of mutually-exclusive representations, and enable writing
   * simple HTML GUI to control their visibility.  Which element is visible is
   * controlled by the "enabled" property. The global visibility of this group
   * is controlled by the "visible" property.
   *
   * Arguments
   * ---------
   *
   * component	 The NGL.Component of the representations
   * name		 A string describing the group (used in GUI)
   * representations	 Optional list of representations to add
   * selection	 A selection of the subset of component atoms
   * 			 to which the representation is applied.
   * defaultParameters A dictionary of NGL.Representation parameters
   *			 to be applied to all representations.
   */
  RepresentationGroup.call(this, component, name, selection, representations, defaultParameters);
  this.enabled = -1;
};

MutuallyExclusiveRepresentationGroup.prototype = Object.create(RepresentationGroup.prototype);

MutuallyExclusiveRepresentationGroup.prototype.enable = function (ci) {
  // Enable (only) one representation of the group, by index
  ci = typeof ci === 'undefined' ? -1 : ci;
  if (ci < this.reprList.length) this.enabled = ci;
  this.update();
};

MutuallyExclusiveRepresentationGroup.prototype.nenable = function (name) {
  /*
   * Enable a group by name
   */
  var i = this.reprList.findIndex(function (repr) {
    return repr.name == name;
  });
  this.enable(i);
  return i;
};

MutuallyExclusiveRepresentationGroup.prototype.update = function () {
  // Update representation visilibity
  this.setVisibility(false);
  if (this.visible && this.enabled >= 0) this.reprList[this.enabled].setVisibility(true);
};
},{}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "52906" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/representationgroup.js"], null)
//# sourceMappingURL=/representationgroup.cc7bb076.js.map