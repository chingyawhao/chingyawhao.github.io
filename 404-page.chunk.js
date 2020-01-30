(window.webpackJsonp=window.webpackJsonp||[]).push([[2],{4982:function(module,__webpack_exports__,__webpack_require__){"use strict";eval('/* unused harmony export ScreenStore */\n/* harmony import */ var resub__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4981);\nvar __extends = (undefined && undefined.__extends) || (function () {\n    var extendStatics = function (d, b) {\n        extendStatics = Object.setPrototypeOf ||\n            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||\n            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };\n        return extendStatics(d, b);\n    };\n    return function (d, b) {\n        extendStatics(d, b);\n        function __() { this.constructor = d; }\n        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());\n    };\n})();\nvar __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\n\nvar ScreenStore = /** @class */ (function (_super) {\n    __extends(ScreenStore, _super);\n    function ScreenStore() {\n        var _this = _super.call(this) || this;\n        _this.trackScreenType = function () {\n            _this._size = window.innerWidth;\n            if (_this._size >= 1920) {\n                _this._type = \'xl-desktop\';\n            }\n            else if (_this._size >= 1280) {\n                _this._type = \'lg-desktop\';\n            }\n            else if (_this._size >= 960) {\n                _this._type = \'md-desktop\';\n            }\n            else if (_this._size >= 600) {\n                _this._type = \'sm-tablet\';\n            }\n            else {\n                _this._type = \'xs-phone\';\n            }\n            _this.trigger();\n        };\n        _this.startTrackingScreenType = function () {\n            _this.trackScreenType();\n            window.addEventListener(\'resize\', _this.trackScreenType);\n        };\n        _this.startTrackingScreenType();\n        return _this;\n    }\n    ScreenStore.prototype.size = function () {\n        return this._size;\n    };\n    ScreenStore.prototype.type = function () {\n        return this._type;\n    };\n    __decorate([\n        resub__WEBPACK_IMPORTED_MODULE_0__[/* autoSubscribe */ "d"]\n    ], ScreenStore.prototype, "size", null);\n    __decorate([\n        resub__WEBPACK_IMPORTED_MODULE_0__[/* autoSubscribe */ "d"]\n    ], ScreenStore.prototype, "type", null);\n    ScreenStore = __decorate([\n        resub__WEBPACK_IMPORTED_MODULE_0__[/* AutoSubscribeStore */ "a"]\n    ], ScreenStore);\n    return ScreenStore;\n}(resub__WEBPACK_IMPORTED_MODULE_0__[/* StoreBase */ "c"]));\n\n/* harmony default export */ __webpack_exports__["a"] = (new ScreenStore());\n\n\n//# sourceURL=webpack:///./src/client/store/screen.ts?')},5155:function(module,__webpack_exports__,__webpack_require__){"use strict";eval('__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var resub__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4981);\n/* harmony import */ var _material_ui_core_styles__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7);\n/* harmony import */ var _material_ui_core_Typography__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(4975);\n/* harmony import */ var _store_screen__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(4982);\nvar __extends = (undefined && undefined.__extends) || (function () {\n    var extendStatics = function (d, b) {\n        extendStatics = Object.setPrototypeOf ||\n            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||\n            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };\n        return extendStatics(d, b);\n    };\n    return function (d, b) {\n        extendStatics(d, b);\n        function __() { this.constructor = d; }\n        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());\n    };\n})();\nvar __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\n\n\n\n\n\nvar styles = function (theme) { return ({\n    row: {\n        display: \'flex\',\n        flexDirection: \'column\',\n        padding: \'32px\',\n        alignItems: \'center\'\n    },\n    divider: {\n        height: \'3px\',\n        width: \'120px\',\n        maxWidth: \'calc(100% - 64px)\',\n        margin: \'16px 32px\',\n        background: \'black\',\n        opacity: 0.8\n    }\n}); };\nvar NotFoundPage = /** @class */ (function (_super) {\n    __extends(NotFoundPage, _super);\n    function NotFoundPage() {\n        return _super !== null && _super.apply(this, arguments) || this;\n    }\n    NotFoundPage.prototype._buildState = function (props, initial) {\n        return {\n            screenType: _store_screen__WEBPACK_IMPORTED_MODULE_4__[/* default */ "a"].type()\n        };\n    };\n    NotFoundPage.prototype.render = function () {\n        var classes = this.props.classes;\n        return (react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: classes.row },\n            react__WEBPACK_IMPORTED_MODULE_0__["createElement"](_material_ui_core_Typography__WEBPACK_IMPORTED_MODULE_3__[/* default */ "a"], { variant: \'h4\', color: \'inherit\', component: \'h2\' }, "404"),\n            react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: classes.divider }),\n            react__WEBPACK_IMPORTED_MODULE_0__["createElement"](_material_ui_core_Typography__WEBPACK_IMPORTED_MODULE_3__[/* default */ "a"], { align: \'center\', variant: \'body2\', gutterBottom: true }, "Page not found")));\n    };\n    NotFoundPage = __decorate([\n        Object(_material_ui_core_styles__WEBPACK_IMPORTED_MODULE_2__[/* default */ "a"])(styles)\n    ], NotFoundPage);\n    return NotFoundPage;\n}(resub__WEBPACK_IMPORTED_MODULE_1__[/* ComponentBase */ "b"]));\n/* harmony default export */ __webpack_exports__["default"] = (NotFoundPage);\n\n\n//# sourceURL=webpack:///./src/client/components/404-page/index.tsx?')}}]);