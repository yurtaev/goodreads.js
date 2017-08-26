(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('xml2js'), require('ramda')) :
	typeof define === 'function' && define.amd ? define(['exports', 'xml2js', 'ramda'], factory) :
	(factory((global.goodreads = global.goodreads || {}, global.goodreads.js = global.goodreads.js || {}),global.xml2js,global.ramda));
}(this, (function (exports,xml2js,ramda) { 'use strict';

xml2js = xml2js && 'default' in xml2js ? xml2js['default'] : xml2js;

var PROTOCOL = 'https';
var HOST = 'www.goodreads.com';
var ENDPOINT = PROTOCOL + '://' + HOST;

var asyncToGenerator = function (fn) {
  return function () {
    var gen = fn.apply(this, arguments);
    return new Promise(function (resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }

        if (info.done) {
          resolve(value);
        } else {
          return Promise.resolve(value).then(function (value) {
            step("next", value);
          }, function (err) {
            step("throw", err);
          });
        }
      }

      return step("next");
    });
  };
};











var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var _this$1 = window;

var isOK = ramda.propEq('ok', true);
var isNotOK = ramda.propEq('ok', false);

var is20x = ramda.propSatisfies(function (status) {
  return status >= 200 && status <= 299;
}, 'status');
var is40x = ramda.propSatisfies(function (status) {
  return status >= 400 && status <= 499;
}, 'status');
var is50x = ramda.propSatisfies(function (status) {
  return status >= 500 && status <= 599;
}, 'status');

var on20x = function () {
  var _ref = asyncToGenerator(regeneratorRuntime.mark(function _callee(response) {
    var result;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return response.text();

          case 2:
            result = _context.sent;
            return _context.abrupt('return', {
              ok: true,
              status: response.status,
              data: result
            });

          case 4:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, _this$1);
  }));

  return function on20x(_x) {
    return _ref.apply(this, arguments);
  };
}();

var on50x = function () {
  var _ref2 = asyncToGenerator(regeneratorRuntime.mark(function _callee2(response) {
    var text;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return response.text();

          case 2:
            text = _context2.sent;
            return _context2.abrupt('return', Promise.reject({
              ok: false,
              statusText: response.statusText,
              status: response.status,
              error: text
            }));

          case 4:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, _this$1);
  }));

  return function on50x(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

var on40x = function () {
  var _ref3 = asyncToGenerator(regeneratorRuntime.mark(function _callee3(response) {
    var result;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return response.text();

          case 2:
            result = _context3.sent;
            return _context3.abrupt('return', Promise.reject({
              ok: false,
              status: response.status,
              error: result
            }));

          case 4:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, _this$1);
  }));

  return function on40x(_x3) {
    return _ref3.apply(this, arguments);
  };
}();

var onUnknow = function onUnknow(response) {
  return Promise.reject({
    ok: false,
    status: response.status,
    statusText: response.statusText,
    error: 'Unknown response status'
  });
};

var onOK = function () {
  var _ref4 = asyncToGenerator(regeneratorRuntime.mark(function _callee4(response) {
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            return _context4.abrupt('return', ramda.cond([[is20x, on20x]])(response));

          case 1:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, _this$1);
  }));

  return function onOK(_x4) {
    return _ref4.apply(this, arguments);
  };
}();
var onNotOK = function () {
  var _ref5 = asyncToGenerator(regeneratorRuntime.mark(function _callee5(response) {
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            return _context5.abrupt('return', ramda.cond([[is40x, on40x], [is50x, on50x], [ramda.T, onUnknow]])(response));

          case 1:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, _this$1);
  }));

  return function onNotOK(_x5) {
    return _ref5.apply(this, arguments);
  };
}();

var prepareResponse = function () {
  var _ref6 = asyncToGenerator(regeneratorRuntime.mark(function _callee6(response) {
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            return _context6.abrupt('return', ramda.cond([[isOK, onOK], [isNotOK, onNotOK]])(response));

          case 1:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, _this$1);
  }));

  return function prepareResponse(_x6) {
    return _ref6.apply(this, arguments);
  };
}();

var _this$2 = window;

var OAuth = require('oauth-1.0a');
var CryptoJS = require('crypto-js');

// var oauth = OAuth({
//   consumer: {
//     key: 'consumer_key',
//     secret: 'consumer_secret',
//   },
//   signature_method: 'HMAC-SHA1',
//   hash_function: (base_string, key) => CryptoJS.HmacSHA1(base_string, key).toString(CryptoJS.enc.Base64),
// })

var getOAuthSigner = function getOAuthSigner(credentials) {
  return OAuth({
    consumer: _extends({}, credentials.consumer),
    signature_method: 'HMAC-SHA1',
    hash_function: function hash_function(base_string, key) {
      return CryptoJS.HmacSHA1(base_string, key).toString(CryptoJS.enc.Base64);
    }
  });
};

// var token = {
//   key: 'user_access_key',
//   secret: 'user_access_secret',
// }

/** Credentials */


var isPOST = ramda.equals('POST');
var isPUT = ramda.equals('PUT');
var isPATCH = ramda.equals('PATCH');
var isAllowBodyMethod = ramda.anyPass([isPOST, isPUT, isPATCH]);

var makeRequestOptions = function makeRequestOptions(method, url, credentials) {
  var data = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  var oauth = getOAuthSigner(credentials);
  var oauth_data = oauth.authorize({ url: url, method: method }, credentials.user);
  var oauthHeaders = oauth.toHeader(oauth_data);

  var options = {
    method: method,
    headers: _extends({}, oauthHeaders)
  };

  if (isAllowBodyMethod(method) && ramda.not(ramda.isNil(data))) {
    var body = JSON.stringify(data);
    return _extends({}, options, {
      body: body
    });
  }

  return options;
};

var makeAPIRequest = function () {
  var _ref = asyncToGenerator(regeneratorRuntime.mark(function _callee(method, url, credentials, data) {
    var options, response;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            options = makeRequestOptions(method, url, credentials, data);
            _context.prev = 1;
            _context.next = 4;
            return fetch(url, options);

          case 4:
            response = _context.sent;
            _context.prev = 5;
            _context.next = 8;
            return prepareResponse(response);

          case 8:
            return _context.abrupt('return', _context.sent);

          case 11:
            _context.prev = 11;
            _context.t0 = _context['catch'](5);
            return _context.abrupt('return', Promise.reject(_context.t0));

          case 14:
            _context.next = 19;
            break;

          case 16:
            _context.prev = 16;
            _context.t1 = _context['catch'](1);
            return _context.abrupt('return', Promise.reject({
              ok: false,
              status: -1,
              error: 'Network error',
              data: _context.t1
            }));

          case 19:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, _this$2, [[1, 16], [5, 11]]);
  }));

  return function makeAPIRequest(_x2, _x3, _x4, _x5) {
    return _ref.apply(this, arguments);
  };
}();

var makeGETRequest = ramda.partial(makeAPIRequest, ['GET']);
var makePOSTRequest = ramda.partial(makeAPIRequest, ['POST']);
var makePUTRequest = ramda.partial(makeAPIRequest, ['PUT']);
var makePATCHRequest = ramda.partial(makeAPIRequest, ['PATCH']);
var makeDELETERequest = ramda.partial(makeAPIRequest, ['DELETE']);

var parserOptions = {
  explicitArray: false,
  attrkey: 'attr',
  valueProcessors: [xml2js.processors.parseNumbers, xml2js.processors.parseBooleans]
  // ignoreAttrs: true,
  // mergeAttrs: true,
};

var xmlToJSON = function xmlToJSON(text) {
  return new Promise(function (resolve, reject) {
    xml2js.parseString(text, parserOptions, function (err, json) {
      if (err) {
        return reject(err);
      }
      resolve(json);
    });
  });
};

var _this = window;

/**
Get an xml response with the given user's friends using OAuth.
Parameters:

- id: Goodreads user_id (required)
- page: 1-N (optional, default 1)
- sort: first_name|date_added|last_online (optional)
@example
const friends = await getFriends(credentials, 37152837)
*/
var getFriends = function () {
  var _ref = asyncToGenerator(regeneratorRuntime.mark(function _callee(credentials, userID) {
    var url, resp;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            url = ENDPOINT + '/friend/user/' + userID + '?format=xml';
            _context.next = 3;
            return makeGETRequest(url, credentials);

          case 3:
            resp = _context.sent;
            return _context.abrupt('return', xmlToJSON(resp.data));

          case 5:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, _this);
  }));

  return function getFriends(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var index$1 = function (str) {
	return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
		return '%' + c.charCodeAt(0).toString(16).toUpperCase();
	});
};

/*
object-assign
(c) Sindre Sorhus
@license MIT
*/

/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

var index$3 = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

function encoderForArrayFormat(opts) {
	switch (opts.arrayFormat) {
		case 'index':
			return function (key, value, index) {
				return value === null ? [
					encode(key, opts),
					'[',
					index,
					']'
				].join('') : [
					encode(key, opts),
					'[',
					encode(index, opts),
					']=',
					encode(value, opts)
				].join('');
			};

		case 'bracket':
			return function (key, value) {
				return value === null ? encode(key, opts) : [
					encode(key, opts),
					'[]=',
					encode(value, opts)
				].join('');
			};

		default:
			return function (key, value) {
				return value === null ? encode(key, opts) : [
					encode(key, opts),
					'=',
					encode(value, opts)
				].join('');
			};
	}
}

function parserForArrayFormat(opts) {
	var result;

	switch (opts.arrayFormat) {
		case 'index':
			return function (key, value, accumulator) {
				result = /\[(\d*)\]$/.exec(key);

				key = key.replace(/\[\d*\]$/, '');

				if (!result) {
					accumulator[key] = value;
					return;
				}

				if (accumulator[key] === undefined) {
					accumulator[key] = {};
				}

				accumulator[key][result[1]] = value;
			};

		case 'bracket':
			return function (key, value, accumulator) {
				result = /(\[\])$/.exec(key);
				key = key.replace(/\[\]$/, '');

				if (!result) {
					accumulator[key] = value;
					return;
				} else if (accumulator[key] === undefined) {
					accumulator[key] = [value];
					return;
				}

				accumulator[key] = [].concat(accumulator[key], value);
			};

		default:
			return function (key, value, accumulator) {
				if (accumulator[key] === undefined) {
					accumulator[key] = value;
					return;
				}

				accumulator[key] = [].concat(accumulator[key], value);
			};
	}
}

function encode(value, opts) {
	if (opts.encode) {
		return opts.strict ? index$1(value) : encodeURIComponent(value);
	}

	return value;
}

function keysSorter(input) {
	if (Array.isArray(input)) {
		return input.sort();
	} else if (typeof input === 'object') {
		return keysSorter(Object.keys(input)).sort(function (a, b) {
			return Number(a) - Number(b);
		}).map(function (key) {
			return input[key];
		});
	}

	return input;
}

var extract = function (str) {
	return str.split('?')[1] || '';
};

var parse = function (str, opts) {
	opts = index$3({arrayFormat: 'none'}, opts);

	var formatter = parserForArrayFormat(opts);

	// Create an object with no prototype
	// https://github.com/sindresorhus/query-string/issues/47
	var ret = Object.create(null);

	if (typeof str !== 'string') {
		return ret;
	}

	str = str.trim().replace(/^(\?|#|&)/, '');

	if (!str) {
		return ret;
	}

	str.split('&').forEach(function (param) {
		var parts = param.replace(/\+/g, ' ').split('=');
		// Firefox (pre 40) decodes `%3D` to `=`
		// https://github.com/sindresorhus/query-string/pull/37
		var key = parts.shift();
		var val = parts.length > 0 ? parts.join('=') : undefined;

		// missing `=` should be `null`:
		// http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
		val = val === undefined ? null : decodeURIComponent(val);

		formatter(decodeURIComponent(key), val, ret);
	});

	return Object.keys(ret).sort().reduce(function (result, key) {
		var val = ret[key];
		if (Boolean(val) && typeof val === 'object' && !Array.isArray(val)) {
			// Sort object keys, not values
			result[key] = keysSorter(val);
		} else {
			result[key] = val;
		}

		return result;
	}, Object.create(null));
};

var stringify = function (obj, opts) {
	var defaults = {
		encode: true,
		strict: true,
		arrayFormat: 'none'
	};

	opts = index$3(defaults, opts);

	var formatter = encoderForArrayFormat(opts);

	return obj ? Object.keys(obj).sort().map(function (key) {
		var val = obj[key];

		if (val === undefined) {
			return '';
		}

		if (val === null) {
			return encode(key, opts);
		}

		if (Array.isArray(val)) {
			var result = [];

			val.slice().forEach(function (val2) {
				if (val2 === undefined) {
					return;
				}

				result.push(formatter(key, val2, result.length));
			});

			return result.join('&');
		}

		return encode(key, opts) + '=' + encode(val, opts);
	}).filter(function (x) {
		return x.length > 0;
	}).join('&') : '';
};

var index = {
	extract: extract,
	parse: parse,
	stringify: stringify
};

var _this$3 = window;

/** Type annotation */


var defaultQuery = Object({
  format: 'xml',
  v: 2,
  per_page: 200,
  page: 1
});

/**
Get the books on a members shelf. Customize the feed with the below variables. Viewing members with profiles who have set them as visible to members only or just their friends requires using OAuth.

- URL: https://www.goodreads.com/review/list?v=2    (sample url)
- HTTP method: GET

Parameters:

- v: 2
- id: Goodreads id of the user
- shelf: read, currently-reading, to-read, etc. (optional)
- sort: title, author, cover, rating, year_pub, date_pub, date_pub_edition, date_started, date_read, date_updated, date_added, recommender, avg_rating, num_ratings, review, read_count, votes, random, comments, notes, isbn, isbn13, asin, num_pages, format, position, shelves, owned, date_purchased, purchase_location, condition (optional)
- search[query]: query text to match against member's books (optional)
- order: a, d (optional)
- page: 1-N (optional)
- per_page: 1-200 (optional)
- key: Developer key (required).

@example
const reviews = await getReviewList(credentials, 37152837)
*/
var getReviewList = function () {
  var _ref = asyncToGenerator(regeneratorRuntime.mark(function _callee(credentials, userID) {
    var query = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var url, resp;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            url = ENDPOINT + '/review/list/' + userID + '?' + index.stringify(_extends({}, defaultQuery, query));
            _context.next = 3;
            return makeGETRequest(url, credentials);

          case 3:
            resp = _context.sent;
            return _context.abrupt('return', xmlToJSON(resp.data));

          case 5:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, _this$3);
  }));

  return function getReviewList(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var _this$4 = window;

/**
Lists shelves for a user.

URL: https://www.goodreads.com/shelf/list.xml    (sample url)
HTTP method: GET

Parameters:

- key: Developer key (required)
- user_id: Goodreads user id (required)
- page: 1-N (default 1).
@example
const shelves = await getShelves(credentials, 37152837)
*/
var getShelves = function () {
  var _ref = asyncToGenerator(regeneratorRuntime.mark(function _callee(credentials, userID) {
    var url, resp;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            url = ENDPOINT + '/shelf/list.xml?user_id=' + userID;
            _context.next = 3;
            return makeGETRequest(url, credentials);

          case 3:
            resp = _context.sent;

            console.log(resp);
            return _context.abrupt('return', xmlToJSON(resp.data));

          case 6:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, _this$4);
  }));

  return function getShelves(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.getFriends = getFriends;
exports.getReviewList = getReviewList;
exports.getShelves = getShelves;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=goodreads.js.map
