"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _koaViews = require('koa-views');

var _koaViews2 = _interopRequireDefault(_koaViews);

var _koaSession = require('koa-session2');

var _koaSession2 = _interopRequireDefault(_koaSession);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Router = function Router(router, fpm) {
  fpm.app.use((0, _koaViews2.default)(_path2.default.join(__dirname, '../views'), {
    extension: 'html',
    map: { html: 'nunjucks' }
  }));
  fpm.app.use((0, _koaSession2.default)({
    key: "SESSIONID" }));
  fpm.app.use(function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(ctx, next) {
      var path, user;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              path = ctx.request.url;

              if (!(path === '/' || path === '/eggs/login')) {
                _context.next = 6;
                break;
              }

              _context.next = 4;
              return next();

            case 4:
              _context.next = 13;
              break;

            case 6:
              user = ctx.session.user;

              if (user) {
                _context.next = 11;
                break;
              }

              ctx.redirect('/eggs/login');
              _context.next = 13;
              break;

            case 11:
              _context.next = 13;
              return next();

            case 13:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }());
  router.get('/eggs', function () {
    var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(ctx, next) {
      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return ctx.render('login', {});

            case 2:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, undefined);
    }));

    return function (_x3, _x4) {
      return _ref2.apply(this, arguments);
    };
  }());

  router.get('/eggs/login', function () {
    var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(ctx, next) {
      return _regenerator2.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return ctx.render('login', {});

            case 2:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, undefined);
    }));

    return function (_x5, _x6) {
      return _ref3.apply(this, arguments);
    };
  }());

  router.post('/eggs/login', function () {
    var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(ctx, next) {
      var loginInfo;
      return _regenerator2.default.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              loginInfo = ctx.request.body;

              if (loginInfo.name === 'admin' && loginInfo.pass === '741235896') {
                ctx.session.user = loginInfo;
                ctx.body = { code: 0 };
              } else {
                ctx.body = { code: -99, error: 'User Or Pass Error ' };
              }

            case 2:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, undefined);
    }));

    return function (_x7, _x8) {
      return _ref4.apply(this, arguments);
    };
  }());

  router.get('/eggs/main', function () {
    var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(ctx, next) {
      return _regenerator2.default.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return ctx.render('main');

            case 2:
            case 'end':
              return _context5.stop();
          }
        }
      }, _callee5, undefined);
    }));

    return function (_x9, _x10) {
      return _ref5.apply(this, arguments);
    };
  }());

  return router;
};

exports.default = {
  bind: function bind(fpm) {

    fpm.registerAction('FPM_ROUTER', function (args) {
      var fpm = args[0];
      var r = fpm.createRouter();
      fpm.bindRouter(Router(r, fpm));
    });
  }
};