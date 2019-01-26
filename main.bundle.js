/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	var _styles = __webpack_require__(1);

	var _styles2 = _interopRequireDefault(_styles);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	$(".location-search-input").keyup(enableLocationSearchSubmit);

	function enableLocationSearchSubmit() {
	  if ($(".location-search-input").val()) {
	    $(".location-search-submit").prop("disabled", false);
	    // jQuery selector causes propagation issues below, patched with vanilla JS
	    // $(".location-search-submit").click(searchLocation)
	    document.querySelector(".location-search-submit").addEventListener("click", searchLocation);
	  } else {
	    $(".location-search-submit").prop("disabled", true);
	    $(".location-search-submit").off("click");
	  }
	}

	function searchLocation() {
	  event.preventDefault();
	  var location = $(".location-search-input").val();
	  var data = fetchWeather(location);
	}

	// refactor and move to fetch.js

	function fetchWeather(location) {
	  var params = location.replace(/\s/g, '');
	  var url = "https://mngatewood-weather-be.herokuapp.com/api/v1/forecast?location=" + params;

	  fetch(url).then(function (response) {
	    return response.json();
	  }).then(function (json) {
	    return apiCleaner(json.data);
	  }).then(function (weather) {
	    return renderWeather(weather);
	  }).catch(function (error) {
	    return console.error({ error: error });
	  });
	}

	// move to render.js

	function renderWeather(data) {
	  $("#landing-page-container").hide();
	  renderCurrentConditions(data);
	  renderLocationAndDateTime(data);
	  $(".current-conditions").hover(expandCurrentConditions, collapseCurrentConditions);
	}

	function renderCurrentConditions(data) {
	  var current = data.attributes.current;

	  $("#app-container").append("<section id=\"current-conditions-container\">\n      <section id=\"current-conditions-overview-container\">\n        <h3 class=\"current-overview\">" + current.summary + "</h3>\n        <div id=\"current-temp-container\">\n          <h2 class=\"current-temp\">" + current.temperature + "&deg;</h2>\n        </div>\n        <h3 class=\"feels-like\">Feels like " + current.apparentTemperature + "&deg;</h3>\n        <div class=\"expand-current-conditions\">\n          <h4 class=\"current-conditions\">Expand Current Conditions</h4>\n        </div>\n      </section>\n      <section id=\"current-conditions-detail-container\">\n        <div class=\"high-low-container\">\n          <h4 class=\"high-temp\"><strong>High: </strong>" + current.todayHigh + "</h4>\n          <h4 class=\"low-temp\"><strong>Low: </strong>" + current.todayLow + "</h4>\n        </div>\n        <h4 class=\"day-summary\"><strong>Today: </strong>" + data.attributes.summary + "</h4>\n        <div class=\"current-detail-container\">\n          <h4 class=\"current-detail-heading\"><strong>Humidity:</strong></h4>\n          <h4 class=\"current-detail-value\">" + current.humidity + "</h4>\n        </div>\n        <div class=\"current-detail-container\">\n          <h4 class=\"current-detail-heading\"><strong>Visibility:</strong></h4>\n          <h4 class=\"current-detail-value\">" + current.visibility + "</h4>\n        </div>\n        <div class=\"current-detail-container\">\n          <h4 class=\"current-detail-heading\"><strong>UV Index:</strong></h4>\n          <h4 class=\"current-detail-value\">" + current.uvIndex + "</h4>\n        </div>\n      </section>\n    </section>");
	}

	function renderLocationAndDateTime(data) {
	  var location = data.attributes;

	  $("#app-container").append("<section id=\"footer-container\">\n      <div id=\"location-date-container\">\n        <div id=\"location-container\">\n          <h2 class=\"city\">" + location.city + "</h2>\n          <h3 class=\"state-country\">" + location.state + ", " + location.country + "</h3>\n        </div>\n        <div id=\"date-time-container\">\n          <h3 class=\"date\">" + location.current.date + "</h3>\n          <h3 class=\"time\">" + location.current.time + "</h3>\n        </div>\n      </div>\n      <div class=\"links-container\">\n        <a href=\"#\">Change Location</a>\n        <a href=\"#\">Add Favorite</a>\n        <a href=\"#\">View Favorites</a>\n        <a href=\"#\">Refresh</a>\n      </div>\n    </section>");
	}

	function expandCurrentConditions() {
	  $("#current-conditions-container").height("auto");
	  $(".expand-current-conditions").css("background-color", "unset");
	  $(".current-conditions").text("Current Conditions");
	  $(".current-conditions").css("color", "rgba(19, 47, 71, 1)");
	}

	function collapseCurrentConditions() {
	  $("#current-conditions-container").height("278px");
	  $(".expand-current-conditions").css("background-color", "rgba(107, 146, 179, 1)");
	  $(".current-conditions").text("Expand Current Conditions");
	  $(".current-conditions").css("color", "rgba(242, 243, 247, 1)");
	}

	// move to apiHelper.js

	function apiCleaner(data) {
	  var current = data.attributes.current;
	  current.date = convertUnixTime(current.time).date;
	  current.time = convertUnixTime(current.time).time;
	  current.temperature = Math.round(current.temperature);
	  current.apparentTemperature = Math.round(current.apparentTemperature);
	  current.todayHigh = Math.round(data.attributes.daily[0].temperatureHigh);
	  current.todayLow = Math.round(data.attributes.daily[0].temperatureLow);
	  current.humidity = current.humidity * 100 + "%";
	  current.visibility = current.visibility + " miles";
	  current.uvIndex = getUvIndexLevel(current.uvIndex);
	  return data;
	}

	function convertUnixTime(time) {
	  var date = new Date(time * 1000);
	  var month = date.toLocaleString('en-us', { month: 'long' });
	  var hours = date.getHours();
	  var minutes = "0" + date.getMinutes();
	  return {
	    date: month + " " + date.getDate() + ", " + date.getFullYear(),
	    time: convert24HourTime(hours, minutes.substr(-2)) };
	}

	function convert24HourTime(hours, minutes) {
	  if (hours > 12) {
	    return hours - 12 + ":" + minutes + "PM";
	  } else {
	    return hours + ":" + minutes + "AM";
	  }
	}

	function getUvIndexLevel(uvIndex) {
	  switch (true) {
	    case uvIndex < 3:
	      return uvIndex + " (low)";
	    case uvIndex < 6:
	      return uvIndex + " (moderate)";
	    case uvIndex < 8:
	      return uvIndex + " (high)";
	    case uvIndex < 11:
	      return uvIndex + " (very high)";
	    case uvIndex >= 11:
	      return uvIndex + " (extreme)";
	  }
	}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(2);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(5)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!../node_modules/css-loader/index.js!./styles.css", function() {
				var newContent = require("!!../node_modules/css-loader/index.js!./styles.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, "body {\n  margin: 0;\n  padding: 0;\n  font-family: \"Open Sans\", sans-serif;\n  font-size: 24px;\n  text-align: center;\n  font-weight: 300;\n  background-color: rgba(107,146,179,1);\n  background: url(" + __webpack_require__(4) + ");\n  background-repeat: no-repeat;\n  background-size: auto 100vh;\n  color: rgba(19,47,71,1);\n}\n\nh1 {\n  position: relative;\n  top: 5vh;\n  font-size: 60px;\n  color: rgba(19,47,71,1)\n}\n\n.location-search-container {\n  position: absolute;\n  top: 30vh;\n  background-color: rgba(19,47,71,1);\n  height: 40vh;\n  width: 100vw;\n}\n\nform.location-search-form {\n  margin: 16vh;\n}\n\nform.location-search-form input {\n  background-color: rgba(242,243,247,1);\n}\n\nform.location-search-form input[type=\"text\"] {\n  padding: 12px;\n  height: 30px;\n  width: 20rem;\n  margin: 0 24px;\n  font-size: 24px;\n}\n\nform.location-search-form input::placeholder,\nform.location-search-form input[type=\"submit\"]:disabled {\n  color: rgba(107,146,179,1);\n}\n\nform.location-search-form input[type=\"submit\"] {\n  padding: 11px;\n  font-size: 24px;\n  margin: 9px 1rem;\n}\n\nh3.view-favorites-link {\n  position: absolute;\n  bottom: 15vh;\n  left: 50vw;\n  margin-left: -50vw;\n  width: 100vw;\n  color: rgba(19,47,71,1);  \n}\n\nsection#footer-container {\n  display: flex;\n  flex-direction: column;\n  position: absolute;\n  bottom: 0;\n  left: 50vw;\n  width: 90vw;\n  height: 200px;\n  margin-left: -45vw;\n  background-color: rgba(242,243,247,0.8);\n  border-radius: 24px 24px 0 0;\n}\n\ndiv#location-date-container {\n  display: flex;\n  flex-direction: row;\n}\n\ndiv#location-container,\ndiv#date-time-container {\n  width: 50%;\n}\n\ndiv#location-container {\n  text-align: left;\n}\n\ndiv#date-time-container {\n  text-align: right;\n} \n\nh2.city {\n  font-size: 80px;\n  margin: 0 0 0 24px;\n  padding-bottom: 0;\n}\n\nh3.state-country {\n  margin: 0 0 0 24px;\n}\n\nh3.date,\nh3.time {\n  margin: 16px 24px 0 0;\n  font-size: 36px;\n  font-weight: 200;\n}\n\nh3.date {\n  margin-top: 24px;\n}\n\nsection#current-conditions-container {\n  position: absolute;\n  top: 48px;\n  right: 0;\n  width: 300px;\n  height: 278px;\n  background-color: rgba(242,243,247,0.8);\n  border-radius: 24px 0 0 24px;\n  padding: 0 48px;\n  overflow: hidden;\n}\n\nsection#current-conditions-overview-container {\n  padding-top: 32px;\n}\n\nsection#current-conditions-detail-container {\n  padding-bottom: 12px;\n}\n\nh3.current-overview {\n  text-align: right;\n  font-size: 36px;\n  font-weight: 400;\n  margin: 0;\n}\n\ndiv#current-temp-container {\n  display: flex;\n  justify-content: flex-end;\n}\n\nh2.current-temp {\n  font-size: 100px;\n  margin: -16px 0;\n}\n\nh3.feels-like {\n  text-align: right;\n  font-size: 36px;\n  font-weight: 200;\n  margin: 0;\n}\n\ndiv.expand-current-conditions {\n  height: 36px;\n  margin: 0 -48px;\n  background-color: rgba(107,146,179,1);\n  border-radius: 0 0 0 24px;\n}\n\nh4 {\n  font-weight: 200;\n  margin: 8px -16px;\n}\n\nh4.current-conditions {\n  color: rgba(242, 243, 247, 1);\n  text-decoration: underline;\n}\n\ndiv.high-low-container {\n  display: flex;\n  flex-direction: row;\n  justify-content: center;\n}\n\ndiv.high-low-container h4 {\n  margin: 8px 24px;\n}\n\nh4.day-summary {\n  text-align: left;\n}\n\ndiv.current-detail-container {\n  display: flex;\n  justify-content: space-between;\n}\n\ndiv.links-container {\n  display: flex;\n  padding: 6px 24px;\n  justify-content: space-between;\n}\n", ""]);

	// exports


/***/ }),
/* 3 */
/***/ (function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "a06c72e7aed9ffcdd7f89314e2e5cf2e.jpg";

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(self.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ })
/******/ ]);