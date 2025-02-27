import { AmbientLight, DirectionalLight, Vector2 } from 'three';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import ThreeGlobe from 'three-globe';
import ThreeRenderObjects from 'three-render-objects';
import accessorFn from 'accessor-fn';
import Kapsule from 'kapsule';
import * as TWEEN from '@tweenjs/tween.js';

function styleInject(css, ref) {
  if (ref === void 0) ref = {};
  var insertAt = ref.insertAt;
  if (!css || typeof document === 'undefined') {
    return;
  }
  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';
  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }
  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z = ".scene-container .clickable {\n  cursor: pointer;\n}";
styleInject(css_248z);

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
      _defineProperty(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }
  return target;
}
function _defineProperty(obj, key, value) {
  key = _toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }
  return target;
}
function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};
  var target = _objectWithoutPropertiesLoose(source, excluded);
  var key, i;
  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }
  return target;
}
function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}
function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}
function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _toPrimitive(input, hint) {
  if (typeof input !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint || "default");
    if (typeof res !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}
function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, "string");
  return typeof key === "symbol" ? key : String(key);
}

function linkKapsule (kapsulePropName, kapsuleType) {
  var dummyK = new kapsuleType(); // To extract defaults
  dummyK._destructor && dummyK._destructor();
  return {
    linkProp: function linkProp(prop) {
      // link property config
      return {
        "default": dummyK[prop](),
        onChange: function onChange(v, state) {
          state[kapsulePropName][prop](v);
        },
        triggerUpdate: false
      };
    },
    linkMethod: function linkMethod(method) {
      // link method pass-through
      return function (state) {
        var kapsuleInstance = state[kapsulePropName];
        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }
        var returnVal = kapsuleInstance[method].apply(kapsuleInstance, args);
        return returnVal === kapsuleInstance ? this // chain based on the parent object, not the inner kapsule
        : returnVal;
      };
    }
  };
}

var _excluded = ["rendererConfig", "waitForGlobeReady"];
var THREE = _objectSpread2(_objectSpread2({}, window.THREE ? window.THREE // Prefer consumption from global THREE, if exists
: {
  AmbientLight: AmbientLight,
  DirectionalLight: DirectionalLight,
  Vector2: Vector2
}), {}, {
  CSS2DRenderer: CSS2DRenderer
});

//

// Expose config from ThreeGlobe
var bindGlobe = linkKapsule('globe', ThreeGlobe);
var linkedGlobeProps = Object.assign.apply(Object, _toConsumableArray(['globeImageUrl', 'bumpImageUrl', 'showGlobe', 'showGraticules', 'showAtmosphere', 'atmosphereColor', 'atmosphereAltitude', 'globeMaterial', 'onGlobeReady', 'pointsData', 'pointLat', 'pointLng', 'pointColor', 'pointAltitude', 'pointRadius', 'pointResolution', 'pointsMerge', 'pointsTransitionDuration', 'arcsData', 'arcStartLat', 'arcStartLng', 'arcEndLat', 'arcEndLng', 'arcColor', 'arcAltitude', 'arcAltitudeAutoScale', 'arcStroke', 'arcCurveResolution', 'arcCircularResolution', 'arcDashLength', 'arcDashGap', 'arcDashInitialGap', 'arcDashAnimateTime', 'arcsTransitionDuration', 'polygonsData', 'polygonGeoJsonGeometry', 'polygonCapColor', 'polygonCapMaterial', 'polygonSideColor', 'polygonSideMaterial', 'polygonStrokeColor', 'polygonAltitude', 'polygonCapCurvatureResolution', 'polygonsTransitionDuration', 'pathsData', 'pathPoints', 'pathPointLat', 'pathPointLng', 'pathPointAlt', 'pathResolution', 'pathColor', 'pathStroke', 'pathDashLength', 'pathDashGap', 'pathDashInitialGap', 'pathDashAnimateTime', 'pathTransitionDuration', 'hexBinPointsData', 'hexBinPointLat', 'hexBinPointLng', 'hexBinPointWeight', 'hexBinResolution', 'hexMargin', 'hexTopCurvatureResolution', 'hexTopColor', 'hexSideColor', 'hexAltitude', 'hexBinMerge', 'hexTransitionDuration', 'hexPolygonsData', 'hexPolygonGeoJsonGeometry', 'hexPolygonColor', 'hexPolygonAltitude', 'hexPolygonResolution', 'hexPolygonMargin', 'hexPolygonCurvatureResolution', 'hexPolygonsTransitionDuration', 'tilesData', 'tileLat', 'tileLng', 'tileAltitude', 'tileWidth', 'tileHeight', 'tileUseGlobeProjection', 'tileMaterial', 'tileCurvatureResolution', 'tilesTransitionDuration', 'ringsData', 'ringLat', 'ringLng', 'ringAltitude', 'ringColor', 'ringResolution', 'ringMaxRadius', 'ringPropagationSpeed', 'ringRepeatPeriod', 'labelsData', 'labelLat', 'labelLng', 'labelAltitude', 'labelRotation', 'labelText', 'labelSize', 'labelTypeFace', 'labelColor', 'labelResolution', 'labelIncludeDot', 'labelDotRadius', 'labelDotOrientation', 'labelsTransitionDuration', 'htmlElementsData', 'htmlLat', 'htmlLng', 'htmlAltitude', 'htmlElement', 'htmlTransitionDuration', 'objectsData', 'objectLat', 'objectLng', 'objectAltitude', 'objectRotation', 'objectFacesSurface', 'objectThreeObject', 'customLayerData', 'customThreeObject', 'customThreeObjectUpdate'].map(function (p) {
  return _defineProperty({}, p, bindGlobe.linkProp(p));
})));
var linkedGlobeMethods = Object.assign.apply(Object, _toConsumableArray(['getGlobeRadius', 'getCoords', 'toGeoCoords'].map(function (p) {
  return _defineProperty({}, p, bindGlobe.linkMethod(p));
})));

// Expose config from renderObjs
var bindRenderObjs = linkKapsule('renderObjs', ThreeRenderObjects);
var linkedRenderObjsProps = Object.assign.apply(Object, _toConsumableArray(['width', 'height', 'backgroundColor', 'backgroundImageUrl', 'enablePointerInteraction'].map(function (p) {
  return _defineProperty({}, p, bindRenderObjs.linkProp(p));
})));
var linkedRenderObjsMethods = Object.assign.apply(Object, _toConsumableArray(['postProcessingComposer'].map(function (p) {
  return _defineProperty({}, p, bindRenderObjs.linkMethod(p));
})));

//

var globe = Kapsule({
  props: _objectSpread2(_objectSpread2({
    onZoom: {
      triggerUpdate: false
    },
    onGlobeClick: {
      triggerUpdate: false
    },
    onGlobeRightClick: {
      triggerUpdate: false
    },
    pointLabel: {
      "default": 'name',
      triggerUpdate: false
    },
    onPointClick: {
      triggerUpdate: false
    },
    onPointRightClick: {
      triggerUpdate: false
    },
    onPointHover: {
      triggerUpdate: false
    },
    arcLabel: {
      "default": 'name',
      triggerUpdate: false
    },
    onArcClick: {
      triggerUpdate: false
    },
    onArcRightClick: {
      triggerUpdate: false
    },
    onArcHover: {
      triggerUpdate: false
    },
    polygonLabel: {
      "default": 'name',
      triggerUpdate: false
    },
    onPolygonClick: {
      triggerUpdate: false
    },
    onPolygonRightClick: {
      triggerUpdate: false
    },
    onPolygonHover: {
      triggerUpdate: false
    },
    pathLabel: {
      "default": 'name',
      triggerUpdate: false
    },
    onPathClick: {
      triggerUpdate: false
    },
    onPathRightClick: {
      triggerUpdate: false
    },
    onPathHover: {
      triggerUpdate: false
    },
    hexLabel: {
      triggerUpdate: false
    },
    onHexClick: {
      triggerUpdate: false
    },
    onHexRightClick: {
      triggerUpdate: false
    },
    onHexHover: {
      triggerUpdate: false
    },
    hexPolygonLabel: {
      triggerUpdate: false
    },
    onHexPolygonClick: {
      triggerUpdate: false
    },
    onHexPolygonRightClick: {
      triggerUpdate: false
    },
    onHexPolygonHover: {
      triggerUpdate: false
    },
    tileLabel: {
      "default": 'name',
      triggerUpdate: false
    },
    onTileClick: {
      triggerUpdate: false
    },
    onTileRightClick: {
      triggerUpdate: false
    },
    onTileHover: {
      triggerUpdate: false
    },
    labelLabel: {
      triggerUpdate: false
    },
    onLabelClick: {
      triggerUpdate: false
    },
    onLabelRightClick: {
      triggerUpdate: false
    },
    onLabelHover: {
      triggerUpdate: false
    },
    objectLabel: {
      "default": 'name',
      triggerUpdate: false
    },
    onObjectClick: {
      triggerUpdate: false
    },
    onObjectRightClick: {
      triggerUpdate: false
    },
    onObjectHover: {
      triggerUpdate: false
    },
    customLayerLabel: {
      "default": 'name',
      triggerUpdate: false
    },
    onCustomLayerClick: {
      triggerUpdate: false
    },
    onCustomLayerRightClick: {
      triggerUpdate: false
    },
    onCustomLayerHover: {
      triggerUpdate: false
    },
    pointerEventsFilter: {
      "default": function _default() {
        return true;
      },
      triggerUpdate: false,
      onChange: function onChange(filterFn, state) {
        return state.renderObjs.hoverFilter(function (obj) {
          return filterFn(obj, obj.__data);
        });
      }
    },
    lineHoverPrecision: {
      "default": 0.2,
      triggerUpdate: false,
      onChange: function onChange(val, state) {
        return state.renderObjs.lineHoverPrecision(val);
      }
    }
  }, linkedGlobeProps), linkedRenderObjsProps),
  methods: _objectSpread2(_objectSpread2({
    pauseAnimation: function pauseAnimation(state) {
      var _state$globe;
      if (state.animationFrameRequestId !== null) {
        cancelAnimationFrame(state.animationFrameRequestId);
        state.animationFrameRequestId = null;
      }
      (_state$globe = state.globe) === null || _state$globe === void 0 ? void 0 : _state$globe.pauseAnimation();
      return this;
    },
    resumeAnimation: function resumeAnimation(state) {
      var _state$globe2;
      if (state.animationFrameRequestId === null) {
        this._animationCycle();
      }
      (_state$globe2 = state.globe) === null || _state$globe2 === void 0 ? void 0 : _state$globe2.resumeAnimation();
      return this;
    },
    _animationCycle: function _animationCycle(state) {
      // Frame cycle
      state.renderObjs.tick();
      state.animationFrameRequestId = requestAnimationFrame(this._animationCycle);
    },
    pointOfView: function pointOfView(state) {
      var geoCoords = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var transitionDuration = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var curGeoCoords = getGeoCoords();

      // Getter
      if (geoCoords.lat === undefined && geoCoords.lng === undefined && geoCoords.altitude === undefined) {
        return curGeoCoords;
      } else {
        // Setter
        var finalGeoCoords = Object.assign({}, curGeoCoords, geoCoords);
        ['lat', 'lng', 'altitude'].forEach(function (p) {
          return finalGeoCoords[p] = +finalGeoCoords[p];
        }); // coerce coords to number

        if (!transitionDuration) {
          // no animation
          setCameraPos(finalGeoCoords);
        } else {
          // Avoid rotating more than 180deg longitude
          while (curGeoCoords.lng - finalGeoCoords.lng > 180) curGeoCoords.lng -= 360;
          while (curGeoCoords.lng - finalGeoCoords.lng < -180) curGeoCoords.lng += 360;
          new TWEEN.Tween(curGeoCoords).to(finalGeoCoords, transitionDuration).easing(TWEEN.Easing.Cubic.InOut).onUpdate(setCameraPos).start();
        }
        return this;
      }

      //

      function getGeoCoords() {
        return state.globe.toGeoCoords(state.renderObjs.cameraPosition());
      }
      function setCameraPos(_ref5) {
        var lat = _ref5.lat,
          lng = _ref5.lng,
          altitude = _ref5.altitude;
        state.renderObjs.cameraPosition(state.globe.getCoords(lat, lng, altitude));
      }
    },
    getScreenCoords: function getScreenCoords(state) {
      var _state$globe3;
      for (var _len = arguments.length, geoCoords = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        geoCoords[_key - 1] = arguments[_key];
      }
      var cartesianCoords = (_state$globe3 = state.globe).getCoords.apply(_state$globe3, geoCoords);
      return state.renderObjs.getScreenCoords(cartesianCoords.x, cartesianCoords.y, cartesianCoords.z);
    },
    toGlobeCoords: function toGlobeCoords(state, x, y) {
      var globeIntersects = state.renderObjs.intersectingObjects(x, y).find(function (d) {
        return d.object.__globeObjType === 'globe';
      });
      if (!globeIntersects) return null; // coords outside globe

      var _state$globe$toGeoCoo = state.globe.toGeoCoords(globeIntersects.point),
        lat = _state$globe$toGeoCoo.lat,
        lng = _state$globe$toGeoCoo.lng;
      return {
        lat: lat,
        lng: lng
      };
    },
    scene: function scene(state) {
      return state.renderObjs.scene();
    },
    // Expose scene
    camera: function camera(state) {
      return state.renderObjs.camera();
    },
    // Expose camera
    renderer: function renderer(state) {
      return state.renderObjs.renderer();
    },
    // Expose renderer
    controls: function controls(state) {
      return state.renderObjs.controls();
    },
    // Expose controls
    _destructor: function _destructor(state) {
      state.globe._destructor();
      this.pauseAnimation();
      this.pointsData([]);
      this.arcsData([]);
      this.polygonsData([]);
      this.pathsData([]);
      this.hexBinPointsData([]);
      this.hexPolygonsData([]);
      this.tilesData([]);
      this.labelsData([]);
      this.htmlElementsData([]);
      this.objectsData([]);
      this.customLayerData([]);
    }
  }, linkedGlobeMethods), linkedRenderObjsMethods),
  stateInit: function stateInit(_ref6) {
    var rendererConfig = _ref6.rendererConfig,
      _ref6$waitForGlobeRea = _ref6.waitForGlobeReady,
      waitForGlobeReady = _ref6$waitForGlobeRea === void 0 ? true : _ref6$waitForGlobeRea,
      globeInitConfig = _objectWithoutProperties(_ref6, _excluded);
    var globe = new ThreeGlobe(_objectSpread2({
      waitForGlobeReady: waitForGlobeReady
    }, globeInitConfig));
    return {
      globe: globe,
      renderObjs: ThreeRenderObjects({
        controlType: 'orbit',
        rendererConfig: rendererConfig,
        waitForLoadComplete: waitForGlobeReady,
        extraRenderers: [new THREE.CSS2DRenderer()] // Used in HTML elements layer
      }).skyRadius(globe.getGlobeRadius() * 500).showNavInfo(false)
    };
  },
  init: function init(domNode, state) {
    var _this = this;
    // Wipe DOM
    domNode.innerHTML = '';

    // Add relative container
    domNode.appendChild(state.container = document.createElement('div'));
    state.container.style.position = 'relative';

    // Add renderObjs
    var roDomNode = document.createElement('div');
    state.container.appendChild(roDomNode);
    state.renderObjs(roDomNode);

    // inject renderer size on three-globe
    state.globe.rendererSize(state.renderObjs.renderer().getSize(new THREE.Vector2()));

    // set initial distance
    this.pointOfView({
      altitude: 2.5
    });

    // calibrate orbit controls
    var globeR = state.globe.getGlobeRadius();
    var controls = state.renderObjs.controls();
    controls.minDistance = globeR * 1.01; // just above the surface
    controls.maxDistance = globeR * 100;
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.rotateSpeed = 0.3;
    controls.zoomSpeed = 0.3;
    controls.addEventListener('change', function () {
      // adjust controls speed based on altitude
      var pov = _this.pointOfView();
      controls.rotateSpeed = pov.altitude * 0.2; // Math.pow(pov.altitude + 1, 2) * 0.025;
      controls.zoomSpeed = (pov.altitude + 1) * 0.1; // Math.sqrt(pov.altitude) * 0.2;

      // Update three-globe pov when camera moves, for proper hiding of elements
      state.globe.setPointOfView(state.renderObjs.camera().position);
      state.onZoom && state.onZoom(pov);
    });

    // config renderObjs
    var getGlobeObj = function getGlobeObj(object) {
      var obj = object;
      // recurse up object chain until finding the globe object
      while (obj && !obj.hasOwnProperty('__globeObjType')) {
        obj = obj.parent;
      }
      return obj;
    };
    var dataAccessors = {
      point: function point(d) {
        return d;
      },
      arc: function arc(d) {
        return d;
      },
      polygon: function polygon(d) {
        return d.data;
      },
      path: function path(d) {
        return d;
      },
      hexbin: function hexbin(d) {
        return d;
      },
      hexPolygon: function hexPolygon(d) {
        return d;
      },
      tile: function tile(d) {
        return d;
      },
      label: function label(d) {
        return d;
      },
      object: function object(d) {
        return d;
      },
      custom: function custom(d) {
        return d;
      }
    };
    state.renderObjs.renderer().useLegacyLights = false; // force behavior of three < 155
    state.renderObjs.objects([
    // Populate scene
    new THREE.AmbientLight(0xcccccc, Math.PI), new THREE.DirectionalLight(0xffffff, 0.6 * Math.PI), state.globe]).hoverOrderComparator(function (a, b) {
      var aObj = getGlobeObj(a);
      var bObj = getGlobeObj(b);

      // de-prioritize background / non-globe objects
      var isBackground = function isBackground(o) {
        return !o;
      }; // || o.__globeObjType === 'globe' || o.__globeObjType === 'atmosphere';
      return isBackground(aObj) - isBackground(bObj);
    }).tooltipContent(function (obj) {
      var objAccessors = {
        point: state.pointLabel,
        arc: state.arcLabel,
        polygon: state.polygonLabel,
        path: state.pathLabel,
        hexbin: state.hexLabel,
        hexPolygon: state.hexPolygonLabel,
        tile: state.tileLabel,
        label: state.labelLabel,
        object: state.objectLabel,
        custom: state.customLayerLabel
      };
      var globeObj = getGlobeObj(obj);
      var objType = globeObj && globeObj.__globeObjType;
      return globeObj && objType && objAccessors.hasOwnProperty(objType) && dataAccessors.hasOwnProperty(objType) ? accessorFn(objAccessors[objType])(dataAccessors[objType](globeObj.__data)) || '' : '';
    }).onHover(function (obj) {
      // Update tooltip and trigger onHover events
      var hoverObjFns = {
        point: state.onPointHover,
        arc: state.onArcHover,
        polygon: state.onPolygonHover,
        path: state.onPathHover,
        hexbin: state.onHexHover,
        hexPolygon: state.onHexPolygonHover,
        tile: state.onTileHover,
        label: state.onLabelHover,
        object: state.onObjectHover,
        custom: state.onCustomLayerHover
      };
      var clickObjFns = {
        globe: state.onGlobeClick,
        point: state.onPointClick,
        arc: state.onArcClick,
        polygon: state.onPolygonClick,
        path: state.onPathClick,
        hexbin: state.onHexClick,
        hexPolygon: state.onHexPolygonClick,
        tile: state.onTileClick,
        label: state.onLabelClick,
        object: state.onObjectClick,
        custom: state.onCustomLayerClick
      };
      var hoverObj = getGlobeObj(obj);

      // ignore non-recognised obj types
      hoverObj && !hoverObjFns.hasOwnProperty(hoverObj.__globeObjType) && (hoverObj = null);
      if (hoverObj !== state.hoverObj) {
        var prevObjType = state.hoverObj ? state.hoverObj.__globeObjType : null;
        var prevObjData = state.hoverObj ? dataAccessors[prevObjType](state.hoverObj.__data) : null;
        var objType = hoverObj ? hoverObj.__globeObjType : null;
        var objData = hoverObj ? dataAccessors[objType](hoverObj.__data) : null;
        if (prevObjType && prevObjType !== objType) {
          // Hover out
          hoverObjFns[prevObjType] && hoverObjFns[prevObjType](null, prevObjData);
        }
        if (objType) {
          // Hover in
          hoverObjFns[objType] && hoverObjFns[objType](objData, prevObjType === objType ? prevObjData : null);
        }

        // set pointer if hovered object is clickable
        state.renderObjs.renderer().domElement.classList[objType && clickObjFns[objType] ? 'add' : 'remove']('clickable');
        state.hoverObj = hoverObj;
      }
    }).onClick(function (obj, ev, point) {
      if (!obj) return; // ignore background clicks

      // Handle click events on objects
      var objFns = {
        globe: state.onGlobeClick,
        point: state.onPointClick,
        arc: state.onArcClick,
        polygon: state.onPolygonClick,
        path: state.onPathClick,
        hexbin: state.onHexClick,
        hexPolygon: state.onHexPolygonClick,
        tile: state.onTileClick,
        label: state.onLabelClick,
        object: state.onObjectClick,
        custom: state.onCustomLayerClick
      };
      var globeObj = getGlobeObj(obj);
      var objType = globeObj.__globeObjType;
      if (globeObj && objFns.hasOwnProperty(objType) && objFns[objType]) {
        var args = [ev];

        // include click coords
        if (objType === 'globe') {
          var _this$toGeoCoords = _this.toGeoCoords(point),
            lat = _this$toGeoCoords.lat,
            lng = _this$toGeoCoords.lng;
          args.unshift({
            lat: lat,
            lng: lng
          });
        } else {
          args.push(_this.toGeoCoords(point));
        }
        dataAccessors.hasOwnProperty(objType) && args.unshift(dataAccessors[objType](globeObj.__data));
        objFns[objType].apply(objFns, args);
      }
    }).onRightClick(function (obj, ev, point) {
      if (!obj) return; // ignore background clicks

      // Handle right-click events
      var objFns = {
        globe: state.onGlobeRightClick,
        point: state.onPointRightClick,
        arc: state.onArcRightClick,
        polygon: state.onPolygonRightClick,
        path: state.onPathRightClick,
        hexbin: state.onHexRightClick,
        hexPolygon: state.onHexPolygonRightClick,
        tile: state.onTileRightClick,
        label: state.onLabelRightClick,
        object: state.onObjectRightClick,
        custom: state.onCustomLayerRightClick
      };
      var globeObj = getGlobeObj(obj);
      var objType = globeObj.__globeObjType;
      if (globeObj && objFns.hasOwnProperty(objType) && objFns[objType]) {
        var args = [ev];

        // include click coords
        if (objType === 'globe') {
          var _this$toGeoCoords2 = _this.toGeoCoords(point),
            lat = _this$toGeoCoords2.lat,
            lng = _this$toGeoCoords2.lng;
          args.unshift({
            lat: lat,
            lng: lng
          });
        } else {
          args.push(_this.toGeoCoords(point));
        }
        dataAccessors.hasOwnProperty(objType) && args.unshift(dataAccessors[objType](globeObj.__data));
        objFns[objType].apply(objFns, args);
      }
    });

    //

    // Kick-off renderer
    this._animationCycle();
  }
});

export { globe as default };
