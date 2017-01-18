module.exports =
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
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _webtaskTools = __webpack_require__(1);

	var _webtaskTools2 = _interopRequireDefault(_webtaskTools);

	var _index = __webpack_require__(2);

	var _index2 = _interopRequireDefault(_index);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// This is the entry-point for the Webpack build. We need to convert our module
	// (which is a simple Express server) into a Webtask-compatible function.
	module.exports = _webtaskTools2.default.fromExpress(_index2.default);

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = require("webtask-tools");

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _express = __webpack_require__(3);

	var _express2 = _interopRequireDefault(_express);

	var _webtask = __webpack_require__(4);

	var _webtask2 = _interopRequireDefault(_webtask);

	var _routes = __webpack_require__(5);

	var _routes2 = _interopRequireDefault(_routes);

	var _hooks = __webpack_require__(18);

	var _hooks2 = _interopRequireDefault(_hooks);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var app = (0, _express2.default)();

	app.use('/.extensions', _hooks2.default);
	app.use(_routes2.default);

	app.use(function (err, req, res, next) {
	  console.log(err);
	  console.log(req.path);
	  return res.status(501).end('Internal Server Error');
	});

	exports.default = app;

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("express");

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";

	module.exports = {
		"title": "Captcha Extension",
		"name": "captcha-extension",
		"version": "1.0.0",
		"author": "abhishek.hingikar@auth0.com",
		"description": "An extension that uses Google's reCaptcha",
		"type": "application",
		"keywords": ["auth0"],
		"auth0": {
			"createClient": true,
			"scopes": "create:rules read:rules delete:rules read:logs read:users",
			"onInstallPath": "/.extensions/on-install",
			"onUninstallPath": "/.extensions/on-uninstall",
			"onUpdatePath": "/.extensions/on-update"
		},
		"secrets": {
			"CAPTCHA_SITEKEY": {
				"description": "The google recaptcha sitekey, If you don't have one please generate one at https://www.google.com/recaptcha/"
			},
			"CAPTCHA_SECRET": {
				"description": "The google recaptcha api secret, If you don't have one please generate one at https://www.google.com/recaptcha/",
				"type": "password"
			},
			"STYLES": {
				"description": "Any custom styles you to be added to the head of the page use this to customize the look and feel of your website, if you want to use external stylesheets please consider using `@import` instead",
				"default": "html{}"
			},
			"CAPTCHA_MESSAGE": {
				"description": "The message you want to be displayed to the user on captcha page",
				"default": "Please verify that you are a human being."
			},
			"MAX_ALLOWED_FAILED_ATTEMPTS": {
				"description": "Maximum allowed failed login attempts, beyond this the captcha will start showing, 0 means the dialog will always popup",
				"type": "text",
				"default": "3"
			},
			"CAPTCHA_TITLE": {
				"description": "The title you want to be displayed on the user captcha page",
				"default": "Humanity Verification Required"
			}
		}
	};

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _express = __webpack_require__(3);

	var _express2 = _interopRequireDefault(_express);

	var _jsonwebtoken = __webpack_require__(6);

	var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

	var _urlJoin = __webpack_require__(7);

	var _urlJoin2 = _interopRequireDefault(_urlJoin);

	var _index = __webpack_require__(8);

	var _index2 = _interopRequireDefault(_index);

	var _bodyParser = __webpack_require__(11);

	var _bodyParser2 = _interopRequireDefault(_bodyParser);

	var _requestPromise = __webpack_require__(12);

	var _requestPromise2 = _interopRequireDefault(_requestPromise);

	var _verifyCaptcha = __webpack_require__(13);

	var _verifyCaptcha2 = _interopRequireDefault(_verifyCaptcha);

	var _createRuleResponse = __webpack_require__(15);

	var _createRuleResponse2 = _interopRequireDefault(_createRuleResponse);

	var _addAuth = __webpack_require__(16);

	var _addAuth2 = _interopRequireDefault(_addAuth);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function redirectBackToContinue(req, res, token) {
	  var ctx = req.webtaskContext.data;
	  var domain = ctx.AUTH0_DOMAIN;
	  var state = req.state;

	  res.redirect('https://' + domain + '/continue?state=' + state + '&token=' + token);
	}

	function renderPage(req, res, ctx) {
	  res.header("Content-Type", 'text/html');
	  res.status(200).send((0, _index2.default)(Object.assign({
	    style: ctx.STYLES,
	    message: ctx.CAPTCHA_MESSAGE,
	    apiKey: ctx.CAPTCHA_SITEKEY,
	    title: ctx.CAPTCHA_TITLE,
	    target: ctx.WT_URL,
	    token: req.token,
	    state: req.state
	  }, req.payload)));
	}

	var router = _express2.default.Router();

	router.use(_bodyParser2.default.urlencoded({
	  extended: true
	}));

	router.use(function decodeAndValidateToken(req, res, next) {

	  var params = req.body && req.body.token ? req.body : req.query;
	  var token = params.token;
	  var state = params.state;

	  var ctx = req.webtaskContext.data;
	  var secret = ctx.EXTENSION_SECRET;
	  var domain = 'https://' + ctx.AUTH0_DOMAIN;
	  var issuer = (0, _urlJoin2.default)(domain, 'captcha/rule');
	  var audience = (0, _urlJoin2.default)(domain, 'captcha/webtask');

	  _jsonwebtoken2.default.verify(token, secret, { issuer: issuer, audience: audience }, function (err, decoded) {

	    if (err) {
	      return (0, _createRuleResponse2.default)('Invalid token: ' + err.message, secret, null, issuer, audience).then(function (token) {
	        res.redirect(domain + '/continue?state=' + state + '&token=' + token);
	      });
	    }

	    req.payload = decoded;
	    req.state = state;
	    req.token = token;
	    next();
	  });
	});

	router.use(_addAuth2.default);

	router.get('/', function (req, res) {

	  var ctx = req.webtaskContext.data;
	  var state = req.state,
	      payload = req.payload;

	  var captchaSecret = ctx.CAPTCHA_SECRET;
	  var sharedSecret = ctx.EXTENSION_SECRET;
	  var domain = 'https://' + ctx.AUTH0_DOMAIN;
	  var issuer = (0, _urlJoin2.default)(domain, 'captcha/rule');
	  var audience = (0, _urlJoin2.default)(domain, 'captcha/webtask');
	  var maxAllowedFailedAttempts = parseInt(ctx.MAX_ALLOWED_FAILED_ATTEMPTS, 10);

	  /* @TODO: Refactor this mess */
	  if (maxAllowedFailedAttempts) {
	    console.log("Searching for", payload.sub);
	    return req.auth0.users.get({
	      id: payload.sub
	    }).then(function (user) {
	      console.log("Querying logs matching", 'date: [' + (user.last_login || '*') + ' TO *] AND type: ("f" OR "fp" OR "fu") AND user_id: "' + user.user_id + '"');
	      return req.auth0.logs.getAll({
	        q: 'date: [' + (user.last_login || '*') + ' TO *] AND type: ("f" OR "fp" OR "fu") AND user_id: "' + user.user_id + '"'
	      });
	    }).then(function (logs) {
	      console.log(logs.length + ' logs were found');
	      console.log('Allowed Failed Attempts: <int>' + maxAllowedFailedAttempts);
	      console.log('ctx.MAX_ALLOWED_FAILED_ATTEMPTS ' + ctx.MAX_ALLOWED_FAILED_ATTEMPTS);

	      if (logs.length > maxAllowedFailedAttempts) {
	        console.log("Too many failed logins, rendering captcha");
	        renderPage(req, res, ctx);
	        return false;
	      }
	      console.log("Acceptable number of failed attempts");
	      return (0, _createRuleResponse2.default)(null, sharedSecret, payload.sub, issuer, audience);
	    }).catch(function (e) {
	      console.log("Error occured", e);
	      return (0, _createRuleResponse2.default)(e.message, sharedSecret, payload.sub, issuer, audience);
	    }).then(function (token) {
	      return token ? redirectBackToContinue(req, res, token) : '';
	    });
	  }

	  // Use it every time mode
	  console.log("Check captcha for all mode, thus rendering captcha");
	  renderPage(req, res, ctx);
	});

	router.post('/', function (req, res) {
	  console.log("Recieved post");
	  var ip = req.ip,
	      state = req.state,
	      payload = req.payload;

	  var ctx = req.webtaskContext.data;
	  var captchaSecret = ctx.CAPTCHA_SECRET;
	  var sharedSecret = ctx.EXTENSION_SECRET;
	  var domain = 'https://' + ctx.AUTH0_DOMAIN;
	  var captchaResponse = req.body["g-recaptcha-response"];
	  var issuer = (0, _urlJoin2.default)(domain, 'captcha/rule');
	  var audience = (0, _urlJoin2.default)(domain, 'captcha/webtask');

	  (0, _verifyCaptcha2.default)(captchaResponse, captchaSecret, ip).then(function () {
	    return (0, _createRuleResponse2.default)(null, sharedSecret, payload.sub, issuer, audience);
	  }, function (err) {
	    return (0, _createRuleResponse2.default)(err.message, sharedSecret, payload.sub, issuer, audience);
	  }).then(function (token) {
	    return redirectBackToContinue(req, res, token);
	  }).catch(function (err) {
	    console.log(err);
	    res.status(500).end('Internal Server Error while validating Captcha. Please try again later');
	  });
	});

	exports.default = router;

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = require("jsonwebtoken@7.1.9");

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	(function (name, context, definition) {
	  if (typeof module !== 'undefined' && module.exports) module.exports = definition();else if (true) !(__WEBPACK_AMD_DEFINE_FACTORY__ = (definition), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));else context[name] = definition();
	})('urljoin', undefined, function () {

	  function normalize(str, options) {

	    // make sure protocol is followed by two slashes
	    str = str.replace(/:\//g, '://');

	    // remove consecutive slashes
	    str = str.replace(/([^:\s])\/+/g, '$1/');

	    // remove trailing slash before parameters or hash
	    str = str.replace(/\/(\?|&|#[^!])/g, '$1');

	    // replace ? in parameters with &
	    str = str.replace(/(\?.+)\?/g, '$1&');

	    return str;
	  }

	  return function () {
	    var input = arguments;
	    var options = {};

	    if (_typeof(arguments[0]) === 'object') {
	      // new syntax with array and options
	      input = arguments[0];
	      options = arguments[1] || {};
	    }

	    var joined = [].slice.call(input, 0).join('/');
	    return normalize(joined, options);
	  };
	});

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var jade = __webpack_require__(9);

	module.exports = function template(locals) {
	var buf = [];
	var jade_mixins = {};
	var jade_interp;
	;var locals_for_with = (locals || {});(function (apiKey, message, state, style, target, title, token) {
	buf.push("<!DOCTYPE html><html><head><meta charset=\"utf-8\"><meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"><style type=\"text/css\">" + (jade.escape(null == (jade_interp = style) ? "" : jade_interp)) + "</style><title>" + (jade.escape(null == (jade_interp = title) ? "" : jade_interp)) + "</title><!-- Latest compiled and minified CSS--><script src=\"https://www.google.com/recaptcha/api.js\"></script></head><body><script type=\"text/javascript\">var submitform = function() {\n  document.getElementById(\"captchaform\").submit();\n};</script><div class=\"container\"><form id=\"captchaform\"" + (jade.attr("action", target, true, true)) + " method=\"POST\" class=\"form-signin\"><h1>" + (jade.escape(null == (jade_interp = title) ? "" : jade_interp)) + "</h1><p>" + (jade.escape(null == (jade_interp = message) ? "" : jade_interp)) + "</p><input type=\"hidden\"" + (jade.attr("value", state, true, true)) + " name=\"state\"><input type=\"hidden\"" + (jade.attr("value", token, true, true)) + " name=\"token\"><div" + (jade.attr("data-sitekey", apiKey, true, true)) + " data-callback=\"submitform\" class=\"g-recaptcha\"></div></form></div></body></html>");}.call(this,"apiKey" in locals_for_with?locals_for_with.apiKey:typeof apiKey!=="undefined"?apiKey:undefined,"message" in locals_for_with?locals_for_with.message:typeof message!=="undefined"?message:undefined,"state" in locals_for_with?locals_for_with.state:typeof state!=="undefined"?state:undefined,"style" in locals_for_with?locals_for_with.style:typeof style!=="undefined"?style:undefined,"target" in locals_for_with?locals_for_with.target:typeof target!=="undefined"?target:undefined,"title" in locals_for_with?locals_for_with.title:typeof title!=="undefined"?title:undefined,"token" in locals_for_with?locals_for_with.token:typeof token!=="undefined"?token:undefined));;return buf.join("");
	}

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Merge two attribute objects giving precedence
	 * to values in object `b`. Classes are special-cased
	 * allowing for arrays and merging/joining appropriately
	 * resulting in a string.
	 *
	 * @param {Object} a
	 * @param {Object} b
	 * @return {Object} a
	 * @api private
	 */

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	exports.merge = function merge(a, b) {
	  if (arguments.length === 1) {
	    var attrs = a[0];
	    for (var i = 1; i < a.length; i++) {
	      attrs = merge(attrs, a[i]);
	    }
	    return attrs;
	  }
	  var ac = a['class'];
	  var bc = b['class'];

	  if (ac || bc) {
	    ac = ac || [];
	    bc = bc || [];
	    if (!Array.isArray(ac)) ac = [ac];
	    if (!Array.isArray(bc)) bc = [bc];
	    a['class'] = ac.concat(bc).filter(nulls);
	  }

	  for (var key in b) {
	    if (key != 'class') {
	      a[key] = b[key];
	    }
	  }

	  return a;
	};

	/**
	 * Filter null `val`s.
	 *
	 * @param {*} val
	 * @return {Boolean}
	 * @api private
	 */

	function nulls(val) {
	  return val != null && val !== '';
	}

	/**
	 * join array as classes.
	 *
	 * @param {*} val
	 * @return {String}
	 */
	exports.joinClasses = joinClasses;
	function joinClasses(val) {
	  return (Array.isArray(val) ? val.map(joinClasses) : val && (typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object' ? Object.keys(val).filter(function (key) {
	    return val[key];
	  }) : [val]).filter(nulls).join(' ');
	}

	/**
	 * Render the given classes.
	 *
	 * @param {Array} classes
	 * @param {Array.<Boolean>} escaped
	 * @return {String}
	 */
	exports.cls = function cls(classes, escaped) {
	  var buf = [];
	  for (var i = 0; i < classes.length; i++) {
	    if (escaped && escaped[i]) {
	      buf.push(exports.escape(joinClasses([classes[i]])));
	    } else {
	      buf.push(joinClasses(classes[i]));
	    }
	  }
	  var text = joinClasses(buf);
	  if (text.length) {
	    return ' class="' + text + '"';
	  } else {
	    return '';
	  }
	};

	exports.style = function (val) {
	  if (val && (typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object') {
	    return Object.keys(val).map(function (style) {
	      return style + ':' + val[style];
	    }).join(';');
	  } else {
	    return val;
	  }
	};
	/**
	 * Render the given attribute.
	 *
	 * @param {String} key
	 * @param {String} val
	 * @param {Boolean} escaped
	 * @param {Boolean} terse
	 * @return {String}
	 */
	exports.attr = function attr(key, val, escaped, terse) {
	  if (key === 'style') {
	    val = exports.style(val);
	  }
	  if ('boolean' == typeof val || null == val) {
	    if (val) {
	      return ' ' + (terse ? key : key + '="' + key + '"');
	    } else {
	      return '';
	    }
	  } else if (0 == key.indexOf('data') && 'string' != typeof val) {
	    if (JSON.stringify(val).indexOf('&') !== -1) {
	      console.warn('Since Jade 2.0.0, ampersands (`&`) in data attributes ' + 'will be escaped to `&amp;`');
	    };
	    if (val && typeof val.toISOString === 'function') {
	      console.warn('Jade will eliminate the double quotes around dates in ' + 'ISO form after 2.0.0');
	    }
	    return ' ' + key + "='" + JSON.stringify(val).replace(/'/g, '&apos;') + "'";
	  } else if (escaped) {
	    if (val && typeof val.toISOString === 'function') {
	      console.warn('Jade will stringify dates in ISO form after 2.0.0');
	    }
	    return ' ' + key + '="' + exports.escape(val) + '"';
	  } else {
	    if (val && typeof val.toISOString === 'function') {
	      console.warn('Jade will stringify dates in ISO form after 2.0.0');
	    }
	    return ' ' + key + '="' + val + '"';
	  }
	};

	/**
	 * Render the given attributes object.
	 *
	 * @param {Object} obj
	 * @param {Object} escaped
	 * @return {String}
	 */
	exports.attrs = function attrs(obj, terse) {
	  var buf = [];

	  var keys = Object.keys(obj);

	  if (keys.length) {
	    for (var i = 0; i < keys.length; ++i) {
	      var key = keys[i],
	          val = obj[key];

	      if ('class' == key) {
	        if (val = joinClasses(val)) {
	          buf.push(' ' + key + '="' + val + '"');
	        }
	      } else {
	        buf.push(exports.attr(key, val, false, terse));
	      }
	    }
	  }

	  return buf.join('');
	};

	/**
	 * Escape the given string of `html`.
	 *
	 * @param {String} html
	 * @return {String}
	 * @api private
	 */

	exports.escape = function escape(html) {
	  var result = String(html).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
	  if (result === '' + html) return html;else return result;
	};

	/**
	 * Re-throw the given `err` in context to the
	 * the jade in `filename` at the given `lineno`.
	 *
	 * @param {Error} err
	 * @param {String} filename
	 * @param {String} lineno
	 * @api private
	 */

	exports.rethrow = function rethrow(err, filename, lineno, str) {
	  if (!(err instanceof Error)) throw err;
	  if ((typeof window != 'undefined' || !filename) && !str) {
	    err.message += ' on line ' + lineno;
	    throw err;
	  }
	  try {
	    str = str || __webpack_require__(10).readFileSync(filename, 'utf8');
	  } catch (ex) {
	    rethrow(err, null, lineno);
	  }
	  var context = 3,
	      lines = str.split('\n'),
	      start = Math.max(lineno - context, 0),
	      end = Math.min(lines.length, lineno + context);

	  // Error context
	  var context = lines.slice(start, end).map(function (line, i) {
	    var curr = i + start + 1;
	    return (curr == lineno ? '  > ' : '    ') + curr + '| ' + line;
	  }).join('\n');

	  // Alter exception message
	  err.path = filename;
	  err.message = (filename || 'Jade') + ':' + lineno + '\n' + context + '\n\n' + err.message;
	  throw err;
	};

	exports.DebugItem = function DebugItem(lineno, filename) {
	  this.lineno = lineno;
	  this.filename = filename;
	};

/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = require("fs");

/***/ },
/* 11 */
/***/ function(module, exports) {

	module.exports = require("body-parser");

/***/ },
/* 12 */
/***/ function(module, exports) {

	module.exports = require("request-promise");

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = verifyCaptcha;

	var _request = __webpack_require__(14);

	var _request2 = _interopRequireDefault(_request);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function verifyCaptcha(captchaResponse, secret, ip) {

	  return new Promise(function (resolve, reject) {

	    function handleResponse(error, response, body) {
	      if (error) {
	        reject(error);
	      }

	      if (response.statusCode !== 200) {
	        reject(new Error('Error validating captcha: ' + response.statusCode));
	      }

	      var data = JSON.parse(body);

	      if (data.success) {
	        resolve(true);
	      } else {
	        reject(new Error("Error from reCaptcha: " + JSON.stringify(data)));
	      }
	    }
	    var config = {
	      form: {
	        response: captchaResponse,
	        secret: secret,
	        remoteip: ip
	      }
	    };
	    _request2.default.post('https://www.google.com/recaptcha/api/siteverify', config, handleResponse);
	  });
	}

/***/ },
/* 14 */
/***/ function(module, exports) {

	module.exports = require("request");

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = createRuleResponse;

	var _jsonwebtoken = __webpack_require__(6);

	var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function createRuleResponse(err, secret, subject, audience, issuer) {
	  return new Promise(function (resolve, reject) {
	    var payload = {
	      captchaOk: err === null,
	      sub: subject,
	      errorMessage: err
	    };

	    var header = {
	      expiresIn: "5m",
	      audience: audience,
	      issuer: issuer
	    };

	    _jsonwebtoken2.default.sign(payload, secret, header, function (err, token) {
	      if (err) return reject(err);
	      resolve(token);
	    });
	  });
	}

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = addAuth0ManagementClient;

	var _auth0ExtensionTools = __webpack_require__(17);

	var _auth0ExtensionTools2 = _interopRequireDefault(_auth0ExtensionTools);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function addAuth0ManagementClient(req, res, next) {
	  var ctx = req.webtaskContext.data;
	  var domain = ctx.AUTH0_DOMAIN;
	  var clientSecret = ctx.AUTH0_CLIENT_SECRET;
	  var clientId = ctx.AUTH0_CLIENT_ID;
	  var opts = { domain: domain, clientId: clientId, clientSecret: clientSecret };
	  _auth0ExtensionTools2.default.managementApi.getClient(opts).then(function (client) {
	    req.auth0 = client;
	    next();
	  });
	}

/***/ },
/* 17 */
/***/ function(module, exports) {

	module.exports = require("auth0-extension-tools");

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _express = __webpack_require__(3);

	var _express2 = _interopRequireDefault(_express);

	var _request = __webpack_require__(14);

	var _request2 = _interopRequireDefault(_request);

	var _auth = __webpack_require__(19);

	var _auth2 = _interopRequireDefault(_auth);

	var _jsonwebtoken = __webpack_require__(6);

	var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

	var _urlJoin = __webpack_require__(7);

	var _urlJoin2 = _interopRequireDefault(_urlJoin);

	var _checkCaptcha = __webpack_require__(20);

	var _checkCaptcha2 = _interopRequireDefault(_checkCaptcha);

	var _addAuth = __webpack_require__(16);

	var _addAuth2 = _interopRequireDefault(_addAuth);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function findRule(rules, name) {
	  return rules.filter(function (rule) {
	    return rule.name === name;
	  })[0];
	}

	var ManagementClient = _auth2.default.ManagementClient;
	var hooks = _express2.default.Router();

	/*
	 * Accepts a string path and returns an Express.Middleware
	 * which verifies if the audience for jwt included that path
	 * along with the issuer etc.
	 */
	function createRuleValidator(path) {
	  return function (req, res, next) {

	    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
	      var token = req.headers.authorization.split(' ')[1];
	      return _jsonwebtoken2.default.verify(token, req.webtaskContext.data.EXTENSION_SECRET, {
	        audience: (0, _urlJoin2.default)(req.webtaskContext.data.WT_URL, path),
	        issuer: 'https://' + req.webtaskContext.data.AUTH0_DOMAIN
	      }, function (err, decoded) {
	        if (err) {
	          return res.sendStatus(401);
	        }
	        return next();
	      });
	    }

	    return res.sendStatus(401);
	  };
	}

	// Validate JWT for on-install
	hooks.use('/on-install', createRuleValidator('/.extensions/on-install'));
	hooks.use('/on-uninstall', createRuleValidator('/.extensions/on-uninstall'));
	hooks.use('/on-update', createRuleValidator('/.extensions/on-update'));

	// Getting Auth0 APIV2 access_token
	hooks.use(_addAuth2.default);

	/* To check everything */
	hooks.get('/checkall', function (a, b) {
	  b.status(200).end('Ok');
	});

	// This endpoint would be called by webtask-gallery
	hooks.post('/on-install', function (req, res) {
	  var ctx = req.webtaskContext.data;

	  req.auth0.rules.create({
	    name: 'captcha-rule-PLEASE-DO-NOT-RENAME',
	    script: (0, _checkCaptcha2.default)({
	      EXTENSION_SECRET: ctx.EXTENSION_SECRET,
	      CAPTCHA_URL: ctx.WT_URL
	    }),
	    order: 2,
	    enabled: true,
	    stage: "login_success"
	  }).then(function () {
	    res.sendStatus(204);
	  }).catch(function (e) {
	    res.sendStatus(500);
	  });
	});

	// This endpoint would be called by webtask-gallery
	hooks.put('/on-update', function (req, res) {
	  res.sendStatus(204);
	});

	// This endpoint would be called by webtask-gallery
	hooks.delete('/on-uninstall', function (req, res) {
	  req.auth0.rules.getAll().then(function (rules) {
	    var rule = findRule(rules, 'captcha-rule-PLEASE-DO-NOT-RENAME');

	    if (rule) {
	      req.auth0.rules.delete({ id: rule.id }).then(function () {
	        res.sendStatus(204);
	      }).catch(function () {
	        res.sendStatus(500);
	      });
	    }
	  }).catch(function () {
	    res.sendStatus(500);
	  });
	});

	exports.default = hooks;

/***/ },
/* 19 */
/***/ function(module, exports) {

	module.exports = require("auth0@2.1.0");

/***/ },
/* 20 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = createRule;
	function createRule(config) {
	  var rule = function (user, context, callback) {
	    // Based on work done by Nicolas Sebana
	    var jwt = escapeRequire('jsonwebtoken@7.1.9');
	    var audience = "https://" + auth0.domain + "/captcha/webtask";
	    var issuer = "https://" + auth0.domain + "/captcha/rule";

	    var config = CONFIG;
	    var secret = config.EXTENSION_SECRET;
	    var redirectUrl = config.CAPTCHA_URL;

	    if (context.protocol === "redirect-callback") {

	      // handle signed response
	      var postVerify = function postVerify(err, decoded) {
	        if (err) {
	          return callback(new UnauthorizedError("Error validating token from wt: " + err));
	        } else if (decoded.sub !== user.user_id) {
	          return callback(new UnauthorizedError("Token does not match the current user."));
	        } else if (!decoded.captchaOk) {
	          return callback(new UnauthorizedError("Captcha validation was not successful.\n" + decoded.errorMessage || ""));
	        } else {
	          // Captcha ok, go ahead with authentication
	          return callback(null, user, context);
	        }
	      };

	      ;

	      return jwt.verify(context.request.query.token, secret, {
	        audience: issuer,
	        issuer: audience
	      }, postVerify);
	    }

	    var payload = {
	      sub: user.user_id,
	      clientName: context.clientName
	    };

	    var options = {
	      expiresIn: "5m",
	      audience: audience,
	      issuer: issuer
	    };

	    return jwt.sign(payload, secret, options, function (err, token) {
	      if (err) {
	        // You will receive this and its the apps responsibility to display the user.
	        return callback(new Error('Cannot run Captcha'));
	      }

	      var separator = redirectUrl.indexOf('?') !== -1 ? "&" : "?";

	      // Issue the redirect command
	      context.redirect = {
	        url: redirectUrl + separator + "token=" + token + "&webtask_no_cache=1"
	      };
	      callback(null, user, context);
	    });
	  }.toString();

	  var re = new RegExp('CONFIG', 'g');
	  var rr = new RegExp('escapeRequire', 'g');

	  rule = rule.replace(re, 'JSON.parse(\'' + JSON.stringify(config) + '\')');
	  rule = rule.replace(rr, 'require');
	  return rule;
	}

/***/ }
/******/ ]);