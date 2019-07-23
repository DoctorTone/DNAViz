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
})({"js/pdiview.js":[function(require,module,exports) {
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Created by DrTone on 04/07/2017.
 */

/*
 * Copyright (C) 2015-2017 Marco Pasi <mf.pasi@gmail.com>
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 */

/**** PDIView
 * version 0.1
 ****/

/**** Changelog
 * v0.1		First draft
 ****/

/**** TODO
 * color unused DNA gray/transparent?
 * get "initial" orientation at the end of initial tranformations (catch some event? wait some time?)
 * fix rotateCamera* methods with new viewerControls
 * - remove Safari Hack for image download when Safari supports download file name setting (see webkit bug 102914).
 * look AT interactions, ideally from the interaction groove
 */

/* GLOBAL SETTINGS */
var AWF = 0.3,
    // radius for Axis
BWF = 0.3,
    // radius for Backbone
GWF = 0.3,
    // radius for Grooves
CWF = 0.3; // radius for Curvature vectors

var Aco = "midnightblue",
    Bco = "darkred",
    Cco = Aco,
    Gcos = ["mediumvioletred", "darkorange", "pink", "silver"],
    Ncw = "gray",
    Ncs = "khaki",
    Nso = 0.5,
    // opacity
Pcc = "steelblue",
    Pcs = "skyblue",
    Pco = 0.5,
    Pso = 0.5; // opacity

var BGCOLORS = ["lightgray", "white", "black", "powderblue"]; // NDB colors

var lowsaturation = //RGBYC
[0xE6BEBE, 0xBEE6BE, 0xBEBEE6, 0xE6E6AA, 0xBEE6E6];
var higsaturation = //RGBYC
[0xFF7070, 0xA0FFA0, 0xA0A0FF, 0xFFFF70, 0x70FFFF];
var logos = //RGBYC
[0x00720D, 0xFFCB00, 0x2AB400, 0xFF9200, 0x70FFFF];
var rgbyc = logos;
/*
var NDBColors = NGL.ColormakerRegistry.addSelectionScheme( [ // A red, T blue, C yellow, G green, and U cyan.
    [rgbyc[0],"DA or A"],
    [rgbyc[1],"DG or G"],
    [rgbyc[2],"DT"],
    [rgbyc[3],"DC or C"],
    [rgbyc[4],"U"],
    ["gray","*"]
], "DNA_Protein");
*/

var DEBUG = false;
/* GLOBALS */

var basePairReps = ["Wire", "Element", "Surface", "Cylinder", "Smooth", "Spacefill", "Slab"];
var appearanceConfig = {
  Back: '#000000',
  BBone: '#8b0000',
  A: DNA_HEX_COLOURS.MOLECULE_A,
  G: DNA_HEX_COLOURS.MOLECULE_G,
  T: DNA_HEX_COLOURS.MOLECULE_T,
  C: DNA_HEX_COLOURS.MOLECULE_C,
  Pairs: basePairReps,
  Protein: ["Cartoon", "Wire", "Surface", "Ribbon", "Rope", "Tube"]
};
var saveConfig = {
  Back: '#000000'
};
var dna_axis, orientation, zoom;
var reference_orientation_component = null;
var NDBColors;
var DEFAULT_X_ROT = -Math.PI / 4;
var DEFAULT_Y_ROT = 0;
var DEFAULT_Z_ROT = Math.PI / 2;

var DNAViz =
/*#__PURE__*/
function () {
  function DNAViz() {
    _classCallCheck(this, DNAViz);

    var moleculeColours = [DNA_COLOURS.MOLECULE_A, DNA_COLOURS.MOLECULE_G, DNA_COLOURS.MOLECULE_T, DNA_COLOURS.MOLECULE_C, DNA_COLOURS.MOLECULE_U];
    var moleculeHexColours = [DNA_HEX_COLOURS.MOLECULE_A, DNA_HEX_COLOURS.MOLECULE_G, DNA_HEX_COLOURS.MOLECULE_T, DNA_HEX_COLOURS.MOLECULE_C];
    this.basePairReps = basePairReps;
    this.basePairRepColours = [];

    for (var i = 0, numPairs = this.basePairReps.length; i < numPairs; ++i) {
      this.basePairRepColours.push(moleculeHexColours.slice(0));
    }

    this.currentRep = 0;
    this.moleculeColours = moleculeColours;
    this.baseName = "DNAVizConfig";
    this.messageTimer = 3 * 1000;
  }

  _createClass(DNAViz, [{
    key: "init",
    value: function init() {
      this.createColourScheme(); //Load any preferences

      var prefs = localStorage.getItem(this.baseName + "Saved");

      if (prefs) {
        var value;

        for (var prop in appearanceConfig) {
          value = localStorage.getItem(this.baseName + prop);

          if (value) {
            this.setGUI(prop, value);
          }
        }
      }
    }
  }, {
    key: "createColourScheme",
    value: function createColourScheme() {
      NDBColors = NGL.ColormakerRegistry.addSelectionScheme([[this.moleculeColours[0], "DA or A"], [this.moleculeColours[3], "DG or G"], [this.moleculeColours[2], "DT"], [this.moleculeColours[1], "DC or C"], [this.moleculeColours[4], "U"], ["gray", "*"]], "DNA_Protein");
    }
  }, {
    key: "getRepresentationColours",
    value: function getRepresentationColours(index) {
      return this.basePairRepColours[index];
    }
  }, {
    key: "changeColourScheme",
    value: function changeColourScheme(molecule, colour) {
      this.moleculeColours[molecule] = colour;
      this.createColourScheme();
    }
  }, {
    key: "changeBasePairColour",
    value: function changeBasePairColour(molecule, colour) {
      var base = this.basePairRepColours[this.currentRep];
      base[molecule] = colour; //DEBUG

      console.log("Rep = ", this.currentRep);
      console.log("Colour = ", colour);
    }
  }, {
    key: "createScene",
    value: function createScene(AXIS_PATH, BACKBONE_PATH, CRPATH, PROTEIN_PATH, PPATH, IPATH, SPATH) {
      var _this2 = this;

      this.stage = new NGL.Stage("viewport", {
        "cameraType": "perspective",
        "backgroundColor": appearanceConfig.Back
      }); // Create RepresentationGroups for the input PDB

      var pdbRG = this.stage.loadFile(PROTEIN_PATH).then(function (c) {
        var some = do_input(c); //DEBUG
        //$.extend(some, do_interactions(c, PPATH, IPATH, SPATH));//NEW

        return some;
      }, error);
      var axRG, bbRG, crRG; // Define dummy axis if we lack one

      if (AXIS_PATH != "") {
        // Create RepresentationGroups for the axis PDB
        axRG = this.stage.loadFile(AXIS_PATH).then(function (c) {
          // Get Axis approximate axis
          reference_orientation_component = c;
          return c;
        }).then(do_ax, error);
      } else {
        pdbRG.then(function (rg) {
          reference_orientation_component = rg["Nucleic Acid"].component;
          return rg;
        });
      }

      if (BACKBONE_PATH != "") {
        // Create RepresentationGroups for the backbone PDB
        bbRG = this.stage.loadFile(BACKBONE_PATH).then(do_bb, error);
      } // Wall: resolve all RepresentationGroups


      Promise.all([pdbRG, axRG, bbRG, crRG]).then(function (RG) {
        // Set initial orientation and zoom
        _this2.repData = {};
        reference_orientation_component.autoView(); // Aggregate RepresentationGroups in repdata

        RG.forEach(function (rep) {
          $.extend(_this2.repData, rep);
        });
      }).then(function () {
        // Write GUI for RepresentationGroups
        // in specific containers, in a specific order.
        var RGdata = _this2.repData;
        if (RGdata["Nucleic Acid"]) RGdata["Nucleic Acid"].GUI("nadisplay", true);
        if (RGdata["Axis"]) RGdata["Axis"].GUI("axdisplay", true);
        if (RGdata["Backbone"]) RGdata["Backbone"].GUI("bbdisplay", true);
        if (RGdata["MinorGroove"]) RGdata["MinorGroove"].GUI("gr1display", false);
        if (RGdata["MajorGroove"]) RGdata["MajorGroove"].GUI("gr2display", false);
        if (RGdata["Curvature"]) RGdata["Curvature"].GUI("crdisplay", true);
        if (RGdata["Protein"]) RGdata["Protein"].GUI("prodisplay", true); //Set initial orientation

        _this2.stage.setRotation(DEFAULT_X_ROT, DEFAULT_Y_ROT, DEFAULT_Z_ROT);
      });
      window.addEventListener("resize", function (event) {
        _this2.stage.handleResize();
      }, false);
    }
  }, {
    key: "rotateModel",
    value: function rotateModel(direction) {
      this.stage.rotateModel(direction);
    }
  }, {
    key: "zoomIn",
    value: function zoomIn(zoom) {
      this.stage.zoomInModel(zoom);
    }
  }, {
    key: "zoomOut",
    value: function zoomOut(zoom) {
      this.stage.zoomOutModel(zoom);
    }
  }, {
    key: "createGUI",
    value: function createGUI() {
      var _this3 = this;

      //Create GUI - controlKit
      window.addEventListener('load', function () {
        var visibilityConfig = {
          NAcid: true,
          BBone: true,
          Axis: true,
          Protein: true
        };
        var _this = _this3;
        var guiWidth = $('#guiWidth').css("width");
        guiWidth = parseInt(guiWidth, 10); //DEBUG

        console.log("Gui width = ", guiWidth);

        if (!guiWidth) {
          guiWidth = 10;
        }

        guiWidth /= 100;
        var controlKit = new ControlKit();
        controlKit.addPanel({
          label: "Configuration",
          width: window.innerWidth * guiWidth,
          enable: true
        }).addSubGroup({
          label: "Appearance",
          enable: false
        }).addColor(appearanceConfig, "Back", {
          colorMode: "hex",
          onChange: function onChange() {
            _this3.onBackgroundColourChanged(appearanceConfig.Back);
          }
        }).addColor(appearanceConfig, "BBone", {
          colorMode: "hex",
          onChange: function onChange() {
            _this3.onBackboneColourChanged(appearanceConfig.BBone);
          }
        }).addColor(appearanceConfig, "A", {
          colorMode: "hex",
          onChange: function onChange() {
            _this3.onMoleculeColourChanged(MOLECULES.A, appearanceConfig.A);
          }
        }).addColor(appearanceConfig, "G", {
          colorMode: "hex",
          onChange: function onChange() {
            _this3.onMoleculeColourChanged(MOLECULES.G, appearanceConfig.G);
          }
        }).addColor(appearanceConfig, "T", {
          colorMode: "hex",
          onChange: function onChange() {
            _this3.onMoleculeColourChanged(MOLECULES.T, appearanceConfig.T);
          }
        }).addColor(appearanceConfig, "C", {
          colorMode: "hex",
          onChange: function onChange() {
            _this3.onMoleculeColourChanged(MOLECULES.C, appearanceConfig.C);
          }
        }).addSelect(appearanceConfig, "Pairs", {
          selected: 0,
          onChange: function onChange(index) {
            _this3.onChangeBasePairRepresentation(index); //Update colour scheme


            var colours = _this.getRepresentationColours(index);

            appearanceConfig.A = colours[0];
            appearanceConfig.G = colours[1];
            appearanceConfig.T = colours[2];
            appearanceConfig.C = colours[3]; //Fixes update bug in control kit

            _this3.applyValue(); //DEBUG
            //console.log("Rep = ", index);
            //console.log("Colour = ", appearanceConfig.A);
            //controlKit.update();

          }
        }).addSelect(appearanceConfig, "Protein", {
          selected: 0,
          onChange: function onChange(index) {
            _this3.onChangeProteinRepresentation(index);
          }
        }).addSubGroup({
          label: "Visibility",
          enable: false
        }).addCheckbox(visibilityConfig, "NAcid", {
          onChange: function onChange() {
            _this3.toggleAcid();
          }
        }).addCheckbox(visibilityConfig, "BBone", {
          onChange: function onChange() {
            _this3.toggleBackbone();
          }
        }).addCheckbox(visibilityConfig, "Axis", {
          onChange: function onChange() {
            _this3.toggleAxis();
          }
        }).addCheckbox(visibilityConfig, "Protein", {
          onChange: function onChange() {
            _this3.toggleProtein();
          }
        }).addSubGroup({
          label: "Preferences"
        }).addButton("Save", function () {
          for (var prop in saveConfig) {
            if (prop in appearanceConfig) {
              saveConfig[prop] = appearanceConfig[prop];
            }
          }

          _this3.savePreferences(saveConfig);
        });
      });
    }
  }, {
    key: "onBackgroundColourChanged",
    value: function onBackgroundColourChanged(colour) {
      this.stage.setParameters({
        backgroundColor: colour
      });
    }
  }, {
    key: "onBackboneColourChanged",
    value: function onBackboneColourChanged(colour) {
      this.repData["Backbone"].setParameters({
        "colorScheme": "uniform",
        "colorValue": colour,
        "radius": 0.3
      });
    }
  }, {
    key: "onMoleculeColourChanged",
    value: function onMoleculeColourChanged(molecule, colour) {
      this.changeColourScheme(molecule, colour);
      this.repData["Nucleic Acid"].setComponentParameters(this.currentRep, {
        "colorScheme": NDBColors
      }); //Keep track of colours

      this.changeBasePairColour(molecule, colour);
    }
  }, {
    key: "onChangeBasePairRepresentation",
    value: function onChangeBasePairRepresentation(representation) {
      this.repData["Nucleic Acid"].enable(representation);
      this.currentRep = representation;
    }
  }, {
    key: "onChangeProteinRepresentation",
    value: function onChangeProteinRepresentation(representation) {
      this.repData["Protein"].enable(representation);
    }
  }, {
    key: "toggleAcid",
    value: function toggleAcid() {
      this.repData["Nucleic Acid"].toggle();
    }
  }, {
    key: "toggleBackbone",
    value: function toggleBackbone() {
      this.repData["Backbone"].toggle();
    }
  }, {
    key: "toggleAxis",
    value: function toggleAxis() {
      this.repData["Axis"].toggle();
    }
  }, {
    key: "toggleProtein",
    value: function toggleProtein() {
      this.repData["Protein"].toggle();
    }
  }, {
    key: "setGUI",
    value: function setGUI(prop, value) {
      var newValue = parseFloat(value);

      if (isNaN(newValue)) {
        appearanceConfig[prop] = value;
        return;
      }

      appearanceConfig[prop] = newValue;
    }
  }, {
    key: "stopNotifications",
    value: function stopNotifications(elemList) {
      for (var i = 0, numElems = elemList.length; i < numElems; ++i) {
        $('#' + elemList[i]).contextmenu(function () {
          return false;
        });
      }
    }
  }, {
    key: "savePreferences",
    value: function savePreferences(config) {
      for (var prop in config) {
        localStorage.setItem(this.baseName + prop, config[prop]);
      }

      localStorage.setItem(this.baseName + "Saved", "Saved");
      this.displayMessage("Preferences saved");
    }
  }, {
    key: "displayMessage",
    value: function displayMessage(msg) {
      $('#content').html(msg);
      $('#message').show();
      setTimeout(function () {
        $('#message').hide();
      }, this.messageTimer);
    }
  }]);

  return DNAViz;
}();

$(document).ready(function (e) {
  if (!Detector.webgl) {
    $("#notSupported").show();
    return;
  }

  $('#mainModal').modal();
  $('#hideDetails').on("click", function () {
    $('#graphs').addClass("d-none");
    $('#showInfo').removeClass("d-none");
  });
  $('#showDetails').on("click", function () {
    $('#graphs').removeClass("d-none");
    $('#showInfo').addClass("d-none");
  });
  $('#hideSequence').on("click", function () {
    $('#sequenceInfo').addClass("d-none");
    $('#toggleSequenceInfo').removeClass("d-none");
  });
  $('#showSequence').on("click", function () {
    $('#sequenceInfo').removeClass("d-none");
    $('#toggleSequenceInfo').addClass("d-none");
  });
  var app = new DNAViz();
  app.init();
  app.createScene("data/output_X.pdb", "data/output_B.pdb", "data/output_R.pdb", "data/output.pdb", "data/pairings.dat", "data/interactions.dat", "data/sequence.dat");
  app.createGUI();
  $('#rotateLeft').on("mousedown", function () {
    app.rotateModel(-1);
  });
  $('#rotateLeft').on("mouseup", function () {
    app.rotateModel(0);
  });
  $('#rotateRight').on("mousedown", function () {
    app.rotateModel(1);
  });
  $('#rotateRight').on("mouseup", function () {
    app.rotateModel(0);
  });
  $('#zoomIn').on("mousedown", function () {
    app.zoomIn(true);
  });
  $('#zoomIn').on("mouseup", function () {
    app.zoomIn(false);
  });
  $('#zoomOut').on("mousedown", function () {
    app.zoomOut(true);
  });
  $('#zoomOut').on("mouseup", function () {
    app.zoomOut(false);
  });
  $('#rotateLeft').on("touchstart", function () {
    app.rotateModel(-1);
  });
  $('#rotateLeft').on("touchend", function () {
    app.rotateModel(0);
  });
  $('#rotateRight').on("touchstart", function () {
    app.rotateModel(1);
  });
  $('#rotateRight').on("touchend", function () {
    app.rotateModel(0);
  });
  $('#zoomIn').on("touchstart", function () {
    app.zoomIn(true);
  });
  $('#zoomIn').on("touchend", function () {
    app.zoomIn(false);
  });
  $('#zoomOut').on("mousedown", function () {
    app.zoomOut(true);
  });
  $('#zoomOut').on("mouseup", function () {
    app.zoomOut(false);
  });
  var elemList = ["rotateControls", "zoomControls"];
  app.stopNotifications(elemList);
});

function safariw(data, target) {
  var url = URL.createObjectURL(data);
  target.location.href = url;
}
/*************************
 * Representation callbacks
 *
 * Configure representations here.
 * Each method creates a dictionary of RepresentationGroups, one
 * for each selection relevant for the specified component.
 * These are subsequently aggregated and used to design GUI.
 *
 */


function do_input(comp) {
  //Add some custom shapes

  /*
  let shape = new NGL.Shape( "shape" );
  shape.addCone([0, 2, 7], [0, 3, 3], [1, 1, 0], 1.5);
  let shapeComp = stage.addComponentFromObject(shape);
  shapeComp.addRepresentation("cone");
  */
  return {
    // Nucleic
    "Nucleic Acid": new MutuallyExclusiveRepresentationGroup(comp, "Nucleic Acid", "nucleic").addRepresentation("Wire", comp.addRepresentation("licorice", {
      "colorScheme": NDBColors
    })).addRepresentation("Element", comp.addRepresentation("ball+stick", {
      "colorScheme": "element"
    })).addRepresentation("Surface", comp.addRepresentation("surface", {
      "opacity": Nso,
      "colorScheme": "uniform",
      "colorValue": Ncs
    })).addRepresentation("Cylinder", comp.addRepresentation("base", {
      "colorScheme": NDBColors
    })).addRepresentation("Smooth", comp.addRepresentation("hyperball", {
      "colorScheme": NDBColors
    })).addRepresentation("Spacefill", comp.addRepresentation("spacefill", {
      "colorScheme": NDBColors
    })).addRepresentation("Slab", comp.addRepresentation("slab", {
      "colorScheme": NDBColors
    })),
    // Protein
    "Protein": new MutuallyExclusiveRepresentationGroup(comp, "Protein", "protein").addRepresentation("Cartoon", comp.addRepresentation("cartoon", {
      "colorScheme": "uniform",
      "colorValue": Pcc,
      "opacity": Pco
    })).addRepresentation("Wire", comp.addRepresentation("licorice", {
      "colorScheme": "element"
    })).addRepresentation("Surface", comp.addRepresentation("surface", {
      "opacity": Pso,
      "colorScheme": "uniform",
      "colorValue": Pcs
    })).addRepresentation("Ribbon", comp.addRepresentation("ribbon", {
      "colorScheme": "uniform",
      "colorValue": Pcc
    })).addRepresentation("Rope", comp.addRepresentation("rope", {
      "colorScheme": "uniform",
      "colorValue": Pcc
    })).addRepresentation("Tube", comp.addRepresentation("tube", {
      "colorScheme": "uniform",
      "colorValue": Pcc
    }))
  };
}

function do_ax(comp) {
  return {
    "Axis": new MutuallyExclusiveRepresentationGroup(comp, "Axis", null).addRepresentation(null, comp.addRepresentation("licorice", {
      "colorScheme": "uniform",
      "colorValue": Aco,
      "radius": AWF
    }))
  };
}

function do_bb(comp) {
  return {
    "Backbone": new MutuallyExclusiveRepresentationGroup(comp, "Backbone", "(:A or :B)").addRepresentation(null, comp.addRepresentation("licorice", {
      "colorScheme": "uniform",
      "colorValue": Bco,
      "radius": BWF
    })),
    "MinorGroove": new MutuallyExclusiveRepresentationGroup(comp, "MinorGroove", ":C").addRepresentation(null, comp.addRepresentation("licorice", {
      "colorScheme": "uniform",
      "colorValue": Gcos[0],
      "radius": GWF
    })),
    "MajorGroove": new MutuallyExclusiveRepresentationGroup(comp, "MajorGroove", ":D").addRepresentation(null, comp.addRepresentation("licorice", {
      "colorScheme": "uniform",
      "colorValue": Gcos[1],
      "radius": GWF
    }))
  };
}

function do_cr(comp) {
  return {
    "Curvature": new MutuallyExclusiveRepresentationGroup(comp, "Curvature", null).addRepresentation(null, comp.addRepresentation("licorice", {
      "colorScheme": "uniform",
      "colorValue": Cco,
      "radius": CWF
    }))
  };
}
/*************************
 *
 */


function read_file(fname, parser, done) {
  $.get(fname).done(function (data) {
    done(parser(data));
  });
}

function parse_pairings(data) {
  var pairings = {};
  var lines = data.split('\n');

  for (var i = 0; i < lines.length - 1; i++) {
    // resi1 resi2
    var values = lines[i].split('\t');
    pairings[values[1]] = values[0];
  }

  return pairings;
}

function invert_hash(hash) {
  var _hash = {};

  for (var key in hash) {
    if (hash.hasOwnProperty(key)) _hash[hash[key]] = key;
  }

  return _hash;
}

function parse_interactions(data, pairings) {
  var interactions = {};
  var lines = data.split('\n');

  for (var i = 0; i < lines.length - 1; i++) {
    // resi1 chain1 resn1 atom1 resi2 chain2 resn2 atom2 ?H
    var values = lines[i].split('\t');
    var key = values[0] + ":" + values[1];
    if (key in pairings) key = pairings[key];
    if (!(key in interactions)) interactions[key] = [];
    interactions[key].push(values);
  }

  return interactions;
}

function parse_sequence(data) {
  var sequence = [];
  var lines = data.split('\n');

  for (var i = 0; i < lines.length - 1; i++) {
    // resn1 resn2
    var values = lines[i].split('\t');
    sequence.push(values);
  }

  return sequence;
}

function vertical_sequence(sequence, group) {
  var c = $("<ol/>");
  sequence.forEach(function (basepair, i) {
    c.append($("<li/>").append($("<a/>").click(function (e) {
      group.nenable(basepair[2]);
    }).append(basepair[0] + "--" + basepair[1])));
  });
  return c;
}

function _normalize(name) {
  if (name[0] == "D") name = name.slice(1);
  return name;
}

function horizontal_sequence(sequence, group) {
  // var c = $("<table/>")
  // var fors = $("<tr/>");
  // var lins = $("<tr/>");
  // var revs = $("<tr/>");
  // sequence.forEach(function(basepair, i) {
  //     forb = _normalize(basepair[0]);
  //     revb = _normalize(basepair[1]);
  //     fors.append($("<td/>").append(
  //         $("<a/>").click(function(e) {
  //             group.nenable(basepair[2]);
  //         }).append(forb)));
  //     revs.append($("<td/>").append(
  //         $("<a/>").click(function(e) {
  //             group.nenable(basepair[2]);
  //         }).append(revb)));
  //     lins.append($("<td/>").append(
  //         $("<a/>").click(function(e) {
  //             group.nenable(basepair[2]);
  //         }).append("|")));
  // });
  // c.append(fors);
  // c.append(lins);
  // c.append(revs);
  // return c;
  var a = $("<div/>");
  var b = $("<table/>");
  var c = $("<tr/>");
  c.append($("<th/>", {
    "class": "seq_initial"
  }).append("5'-<br/><br/>3'-"));
  sequence.forEach(function (basepair, i) {
    forb = _normalize(basepair[0]);
    revb = _normalize(basepair[1]);
    c.append($("<td/>").click(function (e) {
      var tname = basepair[2];
      $(this).parent().children().each(function (i, td) {
        $(td).toggleClass('active', false);
      });

      if (group.enabled >= 0 && group.reprList[group.enabled].name == tname) {
        group.enable(-1);
      } else {
        group.nenable(tname);
        $(this).toggleClass('active');
      }
    }).append(forb + "<br/>|<br/>" + revb));
  });
  c.append($("<th/>", {
    "class": "seq_final"
  }).append("-3'<br/><br/>-5'"));
  b.append(c); // b.append($("<span/>")
  //         .click(function(e){
  //             group.enable(-1);
  //         }).append($("<a/>").append("hide")));

  a.append(b);
  return a;
}

function do_interactions(comp, pairings_file, interactions_file, sequence_file) {
  var group = new MutuallyExclusiveRepresentationGroup(comp, "Interactions", null);
  read_file(pairings_file, parse_pairings, function (pairings) {
    read_file(interactions_file, function (data) {
      return parse_interactions(data, pairings);
    }, function (interactions) {
      var rev_pairings = invert_hash(pairings);

      for (var res1 in interactions) {
        // resi1 chain1 resn1 atom1 resi2 chain2 resn2 atom2 ?H
        var allresidues = interactions[res1].map(function (values) {
          return values[4] + ":" + values[5];
        });
        allresidues.push(res1);
        if (res1 in rev_pairings) allresidues.push(rev_pairings[res1]);
        var interactiongroup = new InteractionGroup(comp, res1, "(" + allresidues.join(" or ") + ")").addRepresentation("Ball&Stick", comp.addRepresentation("ball+stick", {
          "colorScheme": "element",
          "colorValue": "#006b8f"
        }));
        interactions[res1].forEach(function (values) {
          interactiongroup.addInteraction(values[0] + ":" + values[1] + "." + values[3], values[4] + ":" + values[5] + "." + values[7], hydrophobic = values[8] == "H");
        });
        group.addRepresentation(res1, interactiongroup);
      }
    });
  });
  /* Hack in some GUI */

  read_file(sequence_file, parse_sequence, function (sequence) {
    // var c = vertical_sequence(sequence, group);
    var c = horizontal_sequence(sequence, group);
    $("#sequence").append(c);
  });
  group.toggle(true);
  return {
    "Interactions": group
  };
}
/*************************
 * Interaction representation group API
 */


function _autoView(component, sele, duration) {
  component.stage.animationControls.zoomMove(component.getCenter(sele), component.getZoom(sele) * 0.5, duration);
}

var InteractionGroup = function InteractionGroup(component, name, selection, representations, defaultParameters) {
  RepresentationGroup.call(this, component, name, selection, representations, defaultParameters);
};

InteractionGroup.prototype = Object.create(RepresentationGroup.prototype);

InteractionGroup.prototype.setVisibility = function (what) {
  // Show/Hide all representations in group, and focus/zoom
  this.reprList.forEach(function (repr) {
    repr.setVisibility(what);
  });

  if (what) {
    _autoView(this.component, this.selection, 1000); // var axis = get_axis(repr.repr.structure);
    // rotateCameraTo(axis);
    // rotateCameraAxisAngle(cc(new NGL.Vector3(1,0,0)), -Math.PI/2)

  }
};

InteractionGroup.prototype.all_empty = function () {};

InteractionGroup.prototype.GUI = function () {};

InteractionGroup.prototype.addInteraction = function (atom1, atom2, hydrophobic) {
  /*
   * Add an interaction to this group.
   */
  hydrophobic = typeof hydrophobic === 'undefined' ? false : hydrophobic;
  var parameters = {
    atomPair: [[atom1, atom2]],
    labelColor: "black",
    color: "blue",
    opacity: 0.5,
    scale: 0.25,
    labelUnit: "angstrom",
    labelSize: 0.75
  };

  if (hydrophobic) {
    parameters["labelSize"] = 0;
    parameters["color"] = "green";
  }

  this.addRepresentation("distance", this.component.addRepresentation("distance", parameters));
  return this;
};
/*************************
 * Promise functions
 */


function error(err) {
  console.log(err);
}
/*************************
 * Utilities
 */


function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function get_axis(structure) {
  var atoms = structure.atomStore,
      n = atoms.count - 1,
      x = atoms.x[0] - atoms.x[n],
      y = atoms.y[0] - atoms.y[n],
      z = atoms.z[0] - atoms.z[n];
  return new NGL.Vector3(x, y, z).normalize();
}
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
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/pdiview.js"], null)
//# sourceMappingURL=/pdiview.e2e60662.js.map