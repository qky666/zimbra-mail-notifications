/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/*!***************************!*\
  !*** ./src/background.js ***!
  \***************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _CoordinadorZimbra = __webpack_require__(/*! ./lib/CoordinadorZimbra.js */ 1);
	
	var _CoordinadorZimbra2 = _interopRequireDefault(_CoordinadorZimbra);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	//Arrancamos
	_CoordinadorZimbra2.default.configurarListeners();
	//CoordinadorZimbra.actualizarMensajes({notificacion:false}, function () {} )
	/*
	 * Script que corre en el background
	 */

/***/ },

/***/ 1:
/*!**************************************!*\
  !*** ./src/lib/CoordinadorZimbra.js ***!
  \**************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	//import CoordinadorZimbra from './CoordinadorZimbra.js')
	
	//import Mensaje from './Mensaje.js'
	//import OpcionesStorage from './OpcionesStorage.js'
	//import ServidorZimbra from './ServidorZimbra.js'
	//import UtilesFirefox from './UtilesFirefox.js'
	
	//import UtilesURL from './UtilesURL.js'
	
	
	var _constantes = __webpack_require__(/*! ./constantes.js */ 2);
	
	var _constantes2 = _interopRequireDefault(_constantes);
	
	var _GestorAlarma = __webpack_require__(/*! ./GestorAlarma.js */ 3);
	
	var _GestorAlarma2 = _interopRequireDefault(_GestorAlarma);
	
	var _GestorBadge = __webpack_require__(/*! ./GestorBadge.js */ 8);
	
	var _GestorBadge2 = _interopRequireDefault(_GestorBadge);
	
	var _GestorMensajes = __webpack_require__(/*! ./GestorMensajes.js */ 9);
	
	var _GestorMensajes2 = _interopRequireDefault(_GestorMensajes);
	
	var _GestorNotificaciones = __webpack_require__(/*! ./GestorNotificaciones.js */ 10);
	
	var _GestorNotificaciones2 = _interopRequireDefault(_GestorNotificaciones);
	
	var _GestorServidor = __webpack_require__(/*! ./GestorServidor.js */ 4);
	
	var _GestorServidor2 = _interopRequireDefault(_GestorServidor);
	
	var _LogZimbra = __webpack_require__(/*! ./LogZimbra.js */ 5);
	
	var _LogZimbra2 = _interopRequireDefault(_LogZimbra);
	
	var _UtilesPopup = __webpack_require__(/*! ./UtilesPopup.js */ 12);
	
	var _UtilesPopup2 = _interopRequireDefault(_UtilesPopup);
	
	var _ZimbraNavegador = __webpack_require__(/*! ./ZimbraNavegador.js */ 13);
	
	var _ZimbraNavegador2 = _interopRequireDefault(_ZimbraNavegador);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var CoordinadorZimbra = function () {
		function CoordinadorZimbra() {
			_classCallCheck(this, CoordinadorZimbra);
		}
	
		_createClass(CoordinadorZimbra, null, [{
			key: 'configurarListeners',
			value: function configurarListeners() {
	
				//Pongo este listener el primero para que se ejecute cuando se instala (si lo pongo en el callback parece que no se ejecuta a tiempo)
				if (chrome && chrome.runtime && chrome.runtime.onInstalled && chrome.runtime.onInstalled.addListener) {
					chrome.runtime.onInstalled.addListener(function (details) {
						CoordinadorZimbra.runtimeOnInstalledListener(details);
					});
				}
	
				//De hecho, pongo todos los listener primero aquí para evitar que algunas cosas se "pierdan" si lo pongo en el callback
				//Listeners		
				chrome.notifications.onClicked.addListener(function (notificationId) {
					CoordinadorZimbra.notificationsOnClickedListener(notificationId);
				});
	
				if (chrome && chrome.notifications && chrome.notifications.onButtonClicked && chrome.notifications.onButtonClicked.addListener) {
					chrome.notifications.onButtonClicked.addListener(function (notificationId, buttonIndex) {
						CoordinadorZimbra.notificationsOnButtonClickedListener(notificationId, buttonIndex);
					});
				}
	
				chrome.notifications.onClosed.addListener(function (notificationId, byUser) {
					CoordinadorZimbra.notificationsOnClosedListener(notificationId, byUser);
				});
	
				chrome.alarms.onAlarm.addListener(function (alarm) {
					CoordinadorZimbra.alarmsOnAlarmListener(alarm);
				});
	
				chrome.tabs.onActivated.addListener(function (activeInfo) {
					CoordinadorZimbra.tabsOnActivatedListener(activeInfo);
				});
	
				chrome.windows.onFocusChanged.addListener(function (windowId) {
					CoordinadorZimbra.windowsOnFocusChangedListener(windowId);
				});
	
				chrome.browserAction.onClicked.addListener(function (tab) {
					CoordinadorZimbra.browserActionOnClickedListener(tab);
				});
	
				chrome.storage.onChanged.addListener(function (changes, areaName) {
					CoordinadorZimbra.storageOnChangedListener(changes, areaName);
				});
	
				CoordinadorZimbra.escucharWebNavigationOnCompleted();
			}
	
			/*************************************************************************
	  * Funciones de Alto Nivel (afectan a UI)
	  **************************************************************************/
	
			//Parámetros: {notificacion:Boolean}
	
		}, {
			key: 'actualizarMensajes',
			value: function actualizarMensajes(parametros, callback) {
	
				_GestorServidor2.default.getServidor(function (servidor) {
	
					servidor.actualizarMensajesNoleidos(function () {
	
						CoordinadorZimbra.actualizarUis(parametros);
						callback();
					});
				});
			}
	
			//Parámetros: {notificacion:Boolean}
	
		}, {
			key: 'actualizarUis',
			value: function actualizarUis(parametros) {
				if (parametros.notificacion) {
					_GestorNotificaciones2.default.notificarMensajes();
				}
	
				_GestorBadge2.default.establecerDistintivoEnBoton();
	
				var ba = _UtilesPopup2.default.getBrowserActionPopupSiAbiero();
				if (ba) {
					ba.actualizarDatos();
				}
			}
		}, {
			key: 'abrirOActivarZimbraYLimpiarNotificacion',
			value: function abrirOActivarZimbraYLimpiarNotificacion() {
				_ZimbraNavegador2.default.abrirOActivarZimbra();
				_GestorNotificaciones2.default.limpiarNotificacion(function (wasCleared) {});
			}
		}, {
			key: 'siZimbraActivoLimpiarNotificacion',
			value: function siZimbraActivoLimpiarNotificacion() {
				_GestorNotificaciones2.default.hayNotificacionActiva(function (activa) {
					if (activa === true) {
						_ZimbraNavegador2.default.zimbraActivo(function (activo) {
							if (activo) {
								_GestorNotificaciones2.default.limpiarNotificacion(function (wasCleared) {});
							}
						});
					}
				});
			}
	
			/*************************************************************************
	  * Listeners
	  **************************************************************************/
	
		}, {
			key: 'runtimeOnInstalledListener',
			value: function runtimeOnInstalledListener(details) {
				_LogZimbra2.default.log("CoordinadorZimbra. Runtime On Installed Listener. Inicio");
				chrome.runtime.openOptionsPage(function () {});
				_GestorAlarma2.default.establecerAlarma();
			}
		}, {
			key: 'notificationsOnButtonClickedListener',
			value: function notificationsOnButtonClickedListener(notificationId, buttonIndex) {
				_LogZimbra2.default.log("CoordinadorZimbra. Notifications On Button Clicked Listener. Inicio");
				if (notificationId == _constantes2.default.ID_NOTIF_CORREO && buttonIndex == 0) {
	
					_GestorNotificaciones2.default.limpiarNotificacion(function (wasCleared) {});
	
					_GestorAlarma2.default.establecerAlarma();
	
					_GestorMensajes2.default.getMensajes(function (datos) {
						_LogZimbra2.default.log("CoordinadorZimbra. callback de Get Mensajes. Vamos a añadir mensajes ocultos: " + JSON.stringify(datos.mensajesNoOcultos));
						_GestorMensajes2.default.addMensajeOculto(datos.mensajesNoOcultos, function () {
							CoordinadorZimbra.actualizarMensajes({ notificacion: false }, function () {});
						});
					});
				}
			}
		}, {
			key: 'notificationsOnClickedListener',
			value: function notificationsOnClickedListener(notificationId) {
				_LogZimbra2.default.log("CoordinadorZimbra. Notifications On Clicked Listener. Inicio");
				if (notificationId == _constantes2.default.ID_NOTIF_CORREO) {
					CoordinadorZimbra.abrirOActivarZimbraYLimpiarNotificacion();
					_GestorAlarma2.default.establecerAlarma();
				}
			}
		}, {
			key: 'notificationsOnClosedListener',
			value: function notificationsOnClosedListener(notificationId, byUser) {
				_LogZimbra2.default.log("CoordinadorZimbra. Notifications On Closed Listener. Inicio");
				if (notificationId == _constantes2.default.ID_NOTIF_CORREO && byUser) {
					_GestorAlarma2.default.establecerAlarma();
				}
			}
		}, {
			key: 'alarmsOnAlarmListener',
			value: function alarmsOnAlarmListener(alarm) {
				_LogZimbra2.default.log("CoordinadorZimbra. Alarms On Alarm Listener. Inicio");
				if (alarm && alarm.name == _constantes2.default.ID_ALARMA_CORREO) {
					_LogZimbra2.default.log("CoordinadorZimbra. Alarms On Alarm Listener. alarm.name=" + alarm.name);
					CoordinadorZimbra.actualizarMensajes({ notificacion: true }, function () {});
				}
			}
		}, {
			key: 'tabsOnActivatedListener',
			value: function tabsOnActivatedListener(activeInfo) {
				_LogZimbra2.default.log("CoordinadorZimbra. Tabs On Activated Listener. Inicio");
				CoordinadorZimbra.siZimbraActivoLimpiarNotificacion();
			}
		}, {
			key: 'webNavigationOnCompletedListener',
			value: function webNavigationOnCompletedListener() {
				_LogZimbra2.default.log("CoordinadorZimbra. Web Navigation On Completed Listener. Inicio");
				CoordinadorZimbra.siZimbraActivoLimpiarNotificacion();
			}
		}, {
			key: 'windowsOnFocusChangedListener',
			value: function windowsOnFocusChangedListener(windowId) {
				_LogZimbra2.default.log("CoordinadorZimbra. Windows On Focus Changed Listener. Inicio");
				CoordinadorZimbra.siZimbraActivoLimpiarNotificacion();
			}
	
			// Si hay popup asociado, este método no se llama, así que nos sirve de poco...
	
		}, {
			key: 'browserActionOnClickedListener',
			value: function browserActionOnClickedListener(tab) {
				_GestorNotificaciones2.default.limpiarNotificacion(function (wasCleared) {});
				CoordinadorZimbra.actualizarMensajes({ notificacion: false }, function () {});
			}
		}, {
			key: 'storageOnChangedListener',
			value: function storageOnChangedListener(changes, areaName) {
				if (changes.hasOwnProperty("opciones")) {
					_GestorAlarma2.default.establecerAlarma();
					CoordinadorZimbra.escucharWebNavigationOnCompleted();
					CoordinadorZimbra.actualizarMensajes({ notificacion: true }, function () {});
				}
			}
			/*************************************************************************
	  * Gestión de listeners condicionales
	  **************************************************************************/
	
		}, {
			key: 'escucharWebNavigationOnCompleted',
			value: function escucharWebNavigationOnCompleted() {
	
				var webNavigationOnCompletedListenerWrap = function webNavigationOnCompletedListenerWrap() {
					CoordinadorZimbra.webNavigationOnCompletedListener();
				};
	
				chrome.webNavigation.onCompleted.removeListener(webNavigationOnCompletedListenerWrap);
	
				_GestorServidor2.default.getServidor(function (servidor) {
	
					if (servidor.urlError) {
						return;
					}
	
					var url = servidor.urlAsURL;
					chrome.webNavigation.onCompleted.addListener(webNavigationOnCompletedListenerWrap, { url: [{ hostEquals: url.host }] });
				});
			}
	
			/*************************************************************************
	  * Llamados desde la UI
	  **************************************************************************/
	
		}, {
			key: 'onLoadBrowserAction',
			value: function onLoadBrowserAction(callback) {
				_LogZimbra2.default.log("CoordinadorZimbra. On Load Browser Action. Inicio");
				_GestorNotificaciones2.default.limpiarNotificacion(function (wasCleared) {});
				CoordinadorZimbra.actualizarMensajes({ notificacion: false }, callback);
			}
		}, {
			key: 'onClickMensaje',
			value: function onClickMensaje() {
				var ba = _UtilesPopup2.default.getBrowserActionPopupSiAbiero();
				if (ba) {
					ba.close();
				}
				CoordinadorZimbra.abrirOActivarZimbraYLimpiarNotificacion();
				_GestorAlarma2.default.establecerAlarma();
			}
		}, {
			key: 'onMostrarOcultos',
			value: function onMostrarOcultos() {
				_GestorMensajes2.default.borrarMensajesOcultos(function () {
					CoordinadorZimbra.actualizarMensajes({ notificacion: false }, function () {});
				});
			}
	
			/****************************************************
	  * Consulta de estado general
	  *****************************************************/
			//callback: function (datos:object)
			//Los datos son de este estilo:
			//datos
			//	mensajesNoLeidos
			//		ocultos:[Mensaje]
			//		noOcultos:[Mensaje]
			//	estado
			//		ok:(true opcional)
			//		error:(String opcional)
			//		cargando:(true opcional)
	
		}, {
			key: 'getDatos',
			value: function getDatos(callback) {
				_GestorServidor2.default.getServidor(function (servidor) {
					_GestorMensajes2.default.getMensajes(function (datos) {
						callback({
							mensajesNoLeidos: {
								noOcultos: datos.mensajesNoOcultos,
								ocultos: datos.mensajesOcultos
							},
							estado: servidor.estado
						});
					});
				});
			}
		}]);
	
		return CoordinadorZimbra;
	}();
	
	exports.default = CoordinadorZimbra;

/***/ },

/***/ 2:
/*!*******************************!*\
  !*** ./src/lib/constantes.js ***!
  \*******************************/
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var periodoOverride = false; //false //0.25
	var logs = true;
	
	// Otras constantes
	var ID_ALARMA_CORREO = "IdAlarmaCorreoZimbra";
	var ID_NOTIF_CORREO = "IdNotificacionCorreoZimbra";
	
	var urlZimbraDefecto = "";
	var minutosIntervaloDefecto = 1;
	var mostrarNotificacionesDefecto = true;
	var notificacionesPermanentesDefecto = false;
	
	exports.default = {
		periodoOverride: periodoOverride,
		logs: logs,
		ID_ALARMA_CORREO: ID_ALARMA_CORREO,
		ID_NOTIF_CORREO: ID_NOTIF_CORREO,
		urlZimbraDefecto: urlZimbraDefecto,
		minutosIntervaloDefecto: minutosIntervaloDefecto,
		mostrarNotificacionesDefecto: mostrarNotificacionesDefecto,
		notificacionesPermanentesDefecto: notificacionesPermanentesDefecto
	};

/***/ },

/***/ 3:
/*!*********************************!*\
  !*** ./src/lib/GestorAlarma.js ***!
  \*********************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _constantes = __webpack_require__(/*! ./constantes.js */ 2);
	
	var _constantes2 = _interopRequireDefault(_constantes);
	
	var _GestorServidor = __webpack_require__(/*! ./GestorServidor.js */ 4);
	
	var _GestorServidor2 = _interopRequireDefault(_GestorServidor);
	
	var _OpcionesStorage = __webpack_require__(/*! ./OpcionesStorage.js */ 6);
	
	var _OpcionesStorage2 = _interopRequireDefault(_OpcionesStorage);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var GestorAlarma = function () {
		function GestorAlarma() {
			_classCallCheck(this, GestorAlarma);
	
			return null;
		}
	
		_createClass(GestorAlarma, null, [{
			key: 'establecerAlarma',
			value: function establecerAlarma() {
	
				_GestorServidor2.default.getServidor(function (servidor) {
					// Si la url está vacía, no pongo alarma
					if (servidor.urlAsString == "") {
						chrome.alarms.clear(_constantes2.default.ID_ALARMA_CORREO, function (wasCleared) {});
						return;
					}
	
					_OpcionesStorage2.default.getOpciones(function (opciones) {
						var periodo = opciones.minutosIntervalo;
						// Si estamos en modo test, hago que la alarma salte más a menudo
						if (_constantes2.default.periodoOverride) {
							periodo = _constantes2.default.periodoOverride;
						}
	
						chrome.alarms.create(_constantes2.default.ID_ALARMA_CORREO, { delayInMinutes: periodo, periodInMinutes: periodo });
					});
				});
			}
		}]);
	
		return GestorAlarma;
	}();
	
	exports.default = GestorAlarma;

/***/ },

/***/ 4:
/*!***********************************!*\
  !*** ./src/lib/GestorServidor.js ***!
  \***********************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _LogZimbra = __webpack_require__(/*! ./LogZimbra.js */ 5);
	
	var _LogZimbra2 = _interopRequireDefault(_LogZimbra);
	
	var _OpcionesStorage = __webpack_require__(/*! ./OpcionesStorage.js */ 6);
	
	var _OpcionesStorage2 = _interopRequireDefault(_OpcionesStorage);
	
	var _ServidorZimbra = __webpack_require__(/*! ./ServidorZimbra.js */ 7);
	
	var _ServidorZimbra2 = _interopRequireDefault(_ServidorZimbra);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var GestorServidor = function () {
		function GestorServidor() {
			_classCallCheck(this, GestorServidor);
	
			return null;
		}
	
		//callback: function (servidor) {...}
	
	
		_createClass(GestorServidor, null, [{
			key: 'getServidor',
			value: function getServidor(callback) {
				var _this = this;
				//let servidorPrevio = this._servidor
				_OpcionesStorage2.default.getOpciones(function (opciones) {
	
					_LogZimbra2.default.log("Gestor Servidor. Get Servidor. Voy a mirar si existe servidor previo");
					if (_this._servidor) {
						_LogZimbra2.default.log("Gestor Servidor. Get Servidor. Sí existe servidor previo: _this._servidor.urlAsString=" + _this._servidor.urlAsString + ". opciones.urlZimbra=" + opciones.urlZimbra);
						if (_this._servidor.urlAsString == opciones.urlZimbra) {
							_LogZimbra2.default.log("Gestor Servidor. Get Servidor. Existe servidor previo y la URL es la buena");
							callback(_this._servidor);
							return;
						}
					}
	
					_LogZimbra2.default.log("Gestor Servidor. Get Servidor. Estoy creando un nuevo servidor");
					_this._servidor = new _ServidorZimbra2.default(opciones.urlZimbra);
					_this._servidor.init(function () {
						callback(_this._servidor);
					});
				});
			}
		}]);
	
		return GestorServidor;
	}();
	
	exports.default = GestorServidor;

/***/ },

/***/ 5:
/*!******************************!*\
  !*** ./src/lib/LogZimbra.js ***!
  \******************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _constantes = __webpack_require__(/*! ./constantes.js */ 2);
	
	var _constantes2 = _interopRequireDefault(_constantes);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var LogZimbra = function () {
		function LogZimbra() {
			_classCallCheck(this, LogZimbra);
		}
	
		_createClass(LogZimbra, [{
			key: "constrctor",
			value: function constrctor() {
				return null;
			}
		}], [{
			key: "log",
			value: function log(cadena) {
				if (!_constantes2.default.logs) {
					return;
				}
				var date = new Date();
				console.log(date + ". " + cadena);
			}
		}, {
			key: "error",
			value: function error(cadena) {
				var date = new Date();
				console.error(date + ". " + cadena);
			}
		}]);
	
		return LogZimbra;
	}();
	
	exports.default = LogZimbra;

/***/ },

/***/ 6:
/*!************************************!*\
  !*** ./src/lib/OpcionesStorage.js ***!
  \************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _constantes = __webpack_require__(/*! ./constantes.js */ 2);
	
	var _constantes2 = _interopRequireDefault(_constantes);
	
	var _LogZimbra = __webpack_require__(/*! ./LogZimbra.js */ 5);
	
	var _LogZimbra2 = _interopRequireDefault(_LogZimbra);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var OpcionesStorage = function () {
	  function OpcionesStorage() {
	    _classCallCheck(this, OpcionesStorage);
	
	    return null;
	  }
	
	  //callback: function () {...}
	
	
	  _createClass(OpcionesStorage, null, [{
	    key: 'borrarOpciones',
	    value: function borrarOpciones(callback) {
	      chrome.storage.local.remove(["opciones"], callback);
	    }
	
	    //callback: function () {...}
	
	  }, {
	    key: 'setOpciones',
	    value: function setOpciones(nuevasOpciones, callback) {
	      if ((typeof nuevasOpciones === 'undefined' ? 'undefined' : _typeof(nuevasOpciones)) != 'object' || Array.isArray(nuevasOpciones)) {
	        _LogZimbra2.default.error("Hemos intentado grabas unas opciones incorrectas");
	      }
	      chrome.storage.local.set({ opciones: nuevasOpciones }, callback);
	    }
	
	    //callback: function (opciones) {...}
	
	  }, {
	    key: 'getOpciones',
	    value: function getOpciones(callback) {
	      chrome.storage.local.get({
	        opciones: {
	          urlZimbra: _constantes2.default.urlZimbraDefecto,
	          minutosIntervalo: _constantes2.default.minutosIntervaloDefecto,
	          mostrarNotificaciones: _constantes2.default.mostrarNotificacionesDefecto,
	          notificacionesPermanentes: _constantes2.default.notificacionesPermanentesDefecto
	        }
	      }, function (items) {
	        _LogZimbra2.default.log("OpcionesStorage. Get Opciones. Leído: items=" + JSON.stringify(items));
	        var opciones = items.opciones;
	
	        //Comprobamos que lo que leemos tiene buena pinta
	        if ((typeof opciones === 'undefined' ? 'undefined' : _typeof(opciones)) != 'object' || Array.isArray(opciones)) {
	          opciones = {};
	        }
	
	        if (opciones.urlZimbra == null) {
	          opciones.urlZimbra = _constantes2.default.urlZimbraDefecto;
	        }
	        if (opciones.minutosIntervalo == null) {
	          opciones.minutosIntervalo = _constantes2.default.minutosIntervaloDefecto;
	        }
	        if (opciones.mostrarNotificaciones == null) {
	          opciones.mostrarNotificaciones = _constantes2.default.mostrarNotificacionesDefecto;
	        }
	        if (opciones.notificacionesPermanentes == null) {
	          opciones.notificacionesPermanentes = _constantes2.default.notificacionesPermanentesDefecto;
	        }
	
	        callback(opciones);
	      });
	    }
	  }]);
	
	  return OpcionesStorage;
	}();
	
	exports.default = OpcionesStorage;

/***/ },

/***/ 7:
/*!***********************************!*\
  !*** ./src/lib/ServidorZimbra.js ***!
  \***********************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _LogZimbra = __webpack_require__(/*! ./LogZimbra.js */ 5);
	
	var _LogZimbra2 = _interopRequireDefault(_LogZimbra);
	
	var _UtilesURL = __webpack_require__(/*! ./UtilesURL.js */ 190);
	
	var _UtilesURL2 = _interopRequireDefault(_UtilesURL);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var ServidorZimbra = function () {
		function ServidorZimbra(urlAsString) {
			_classCallCheck(this, ServidorZimbra);
	
			this._urlAsString = urlAsString;
			this._mensajes = [];
			//this._errorRequest = "¡No inicializado!"
			this._estadoCarga = { error: "¡No inicializado!" };
			this._ultimaConsulta = null;
		}
	
		_createClass(ServidorZimbra, [{
			key: 'init',
			value: function init(callback) {
				this.actualizarMensajesNoleidos(callback);
			}
		}, {
			key: 'usarCache',
			value: function usarCache() {
				if (this.error) {
					return false;
				}
				var ahora = new Date();
				if (this._ultimaConsulta && ahora.getTime() - this._ultimaConsulta.getTime() < 2000) {
					return true;
				}
				return false;
			}
	
			// callback: function ()
	
		}, {
			key: 'actualizarMensajesNoleidos',
			value: function actualizarMensajesNoleidos(callback) {
				if (this.urlError) {
					this._mensajes = null;
					this._estadoCarga = { error: this.urlError };
					callback();
					return;
				}
	
				if (this.usarCache()) {
					// Voy a usar caché, o sea, no actualizo realmente los mensajes.
					callback();
					return;
				}
	
				var url = this.urlAsURL;
	
				var parametros = { query: "is:unread" };
				var urlBase = url.protocol + "//" + url.host + "/home/~/inbox.json";
				var urlJson = _UtilesURL2.default.codificarQueryURL(urlBase, parametros);
	
				var _this = this;
				var cb = function cb() {
					_this._ultimaConsulta = new Date();
					callback();
				};
	
				this._estadoCarga = { cargando: true };
				if (window.fetch) {
					this._actualizarNoLeidosFetch(urlJson, cb);
				} else {
					this._actualizarNoLeidosXHR(urlJson, cb);
				}
			}
		}, {
			key: '_actualizarNoLeidosXHR',
			value: function _actualizarNoLeidosXHR(urlJson, callback) {
				_LogZimbra2.default.log("GestorZimbra. Actualizar No Leidos XHR. Inicio");
	
				var thisZimbraServer = this;
	
				var xhr = new XMLHttpRequest();
				xhr.open("GET", urlJson, true);
				xhr.timeout = 4000;
				xhr.withCredentials = true;
	
				xhr.onload = function () {
					// Hemos terminado y ha ido bien.
					// Debido a un error en la respuesta del servidor de correo web Zimbra, debemos hacer una transformación de la respuesta.
					// El problema es que en la respuesta se incluye texto del tipo "\x". Este texto no puede aparecer en un JSON correcto,
					// así que lo sustituimos por "\u00", que debería ser lo mismo
					if (this.status != 200) {
						// Algo no ha ido bien
						thisZimbraServer._establecerErrorRequest(this.statusText);
						callback();
						return;
					}
	
					thisZimbraServer._jsonAMensajes(this.responseText);
					callback();
					return;
				};
	
				xhr.onerror = function (e) {
					thisZimbraServer._establecerErrorRequest(this.statusText);
					callback();
					return;
				};
				xhr.send();
			}
		}, {
			key: '_actualizarNoLeidosFetch',
			value: function _actualizarNoLeidosFetch(urlJson, callback) {
				_LogZimbra2.default.log("GestorZimbra. Actualizar No Leidos Fetch. Inicio");
				var thisZimbraServer = this;
	
				window.fetch(urlJson, { credentials: 'include',
					method: 'GET',
					headers: new Headers().append('Content-Type', 'text/plain'),
					mode: 'cors',
					cache: 'default'
				}).then(function (response) {
					if (response && response.ok) {
						return response.text();
					} else {
						if (response && response.statusText) {
							thisZimbraServer._establecerErrorRequest(response.statusText);
						} else {
							thisZimbraServer._establecerErrorRequest(null);
						}
						callback();
						return Promise.reject(new Error("Response no ok"));
					}
				}, function (reason) {
					if (reason && reason.message) {
						thisZimbraServer._establecerErrorRequest(reason.message);
					} else {
						thisZimbraServer._establecerErrorRequest(null);
					}
					callback();
					return Promise.reject(new Error("Promise rechazada"));
				}).then(function (myText) {
					thisZimbraServer._jsonAMensajes(myText);
					callback();
					return;
				});
			}
		}, {
			key: '_establecerErrorRequest',
			value: function _establecerErrorRequest(error) {
				var e = void 0;
				if (error) {
					e = error;
				} else {
					e = chrome.i18n.getMessage("error_generico");
				}
	
				this._estadoCarga = { error: e };
				this._mensajes = null;
			}
		}, {
			key: '_jsonAMensajes',
			value: function _jsonAMensajes(json) {
				var jsonStr = json.replace(/\\x/g, '\\u00');
				var jsonParsed = JSON.parse(jsonStr);
	
				var mens = [];
				if (jsonParsed.m) {
					for (var i = 0; i < jsonParsed.m.length; i++) {
						var mensJson = jsonParsed.m[i];
						var m = new Mensaje(mensJson);
						mens.push(m);
					}
				}
	
				this._estadoCarga = { ok: true };
				this._mensajes = mens;
				return;
			}
		}, {
			key: 'mensajeConId',
			value: function mensajeConId(idMensaje) {
				var mensaje = null;
	
				function filtro(currentValue) {
					return currentValue.id == idMensaje;
				}
	
				var filtrado = this.mensajes.filter(filtro);
	
				if (filtrado.length) {
					mensaje = filtrado[0];
					_LogZimbra2.default.log("Servidor Zimbra. Mensaje Con Id. He encontrado el mensaje: " + JSON.stringify(mensaje));
				} else {
					_LogZimbra2.default.log("Servidor Zimbra. Mensaje Con Id. No he encontrado el mensaje con id: " + idMensaje);
				}
	
				return mensaje;
			}
		}, {
			key: 'urlAsString',
			get: function get() {
				return this._urlAsString;
			}
		}, {
			key: 'mensajes',
			get: function get() {
				return this._mensajes;
			}
		}, {
			key: 'urlAsURL',
			get: function get() {
				var strToURL = _UtilesURL2.default.stringToURL(this._urlAsString);
				if (strToURL.hasOwnProperty('error')) {
					return null;
				}
				return strToURL.url;
			}
		}, {
			key: 'urlError',
			get: function get() {
				var strToURL = _UtilesURL2.default.stringToURL(this._urlAsString);
				if (strToURL.hasOwnProperty('error')) {
					return strToURL.error;
				}
				return null;
			}
		}, {
			key: 'error',
			get: function get() {
				if (this.urlError) {
					return this.urlError;
				}
				if (this._estadoCarga.error) {
					return this._estadoCarga.error;
				}
				return null;
			}
		}, {
			key: 'estado',
			get: function get() {
				if (this.urlError) {
					return { error: this.urlError };
				}
				return JSON.parse(JSON.stringify(this._estadoCarga));
			}
		}]);
	
		return ServidorZimbra;
	}();
	
	exports.default = ServidorZimbra;

/***/ },

/***/ 8:
/*!********************************!*\
  !*** ./src/lib/GestorBadge.js ***!
  \********************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _GestorMensajes = __webpack_require__(/*! ./GestorMensajes.js */ 9);
	
	var _GestorMensajes2 = _interopRequireDefault(_GestorMensajes);
	
	var _GestorServidor = __webpack_require__(/*! ./GestorServidor.js */ 4);
	
	var _GestorServidor2 = _interopRequireDefault(_GestorServidor);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var GestorBadge = function () {
		function GestorBadge() {
			_classCallCheck(this, GestorBadge);
	
			return null;
		}
	
		_createClass(GestorBadge, null, [{
			key: 'establecerDistintivoEnBoton',
			value: function establecerDistintivoEnBoton() {
	
				_GestorServidor2.default.getServidor(function (servidor) {
	
					if (servidor.error) {
						chrome.browserAction.setBadgeBackgroundColor({ color: [240, 0, 0, 255] });
						chrome.browserAction.setBadgeText({ text: "X" });
					} else {
						_GestorMensajes2.default.getMensajes(function (datos) {
							var num = datos.mensajesNoOcultos.length;
							chrome.browserAction.setBadgeText({ text: num.toString() });
							if (num == 0) {
								chrome.browserAction.setBadgeBackgroundColor({ color: [0, 0, 220, 255] });
							} else {
								chrome.browserAction.setBadgeBackgroundColor({ color: [0, 190, 0, 255] });
							}
						});
					}
				});
			}
		}]);
	
		return GestorBadge;
	}();
	
	exports.default = GestorBadge;

/***/ },

/***/ 9:
/*!***********************************!*\
  !*** ./src/lib/GestorMensajes.js ***!
  \***********************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _GestorServidor = __webpack_require__(/*! ./GestorServidor.js */ 4);
	
	var _GestorServidor2 = _interopRequireDefault(_GestorServidor);
	
	var _LogZimbra = __webpack_require__(/*! ./LogZimbra.js */ 5);
	
	var _LogZimbra2 = _interopRequireDefault(_LogZimbra);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var GestorMensajes = function () {
	  function GestorMensajes() {
	    _classCallCheck(this, GestorMensajes);
	
	    return null;
	  }
	
	  //callback: function () {...}
	
	
	  _createClass(GestorMensajes, null, [{
	    key: 'borrarMensajesOcultos',
	    value: function borrarMensajesOcultos(callback) {
	      _LogZimbra2.default.log("Gestor Mensajes. Borrar Mensajes Ocultos. Inicio");
	      chrome.storage.local.remove(["mensajesOcultos"], callback);
	    }
	
	    //callback: function () {...}
	
	  }, {
	    key: '_setIdsMensajesOcultos',
	    value: function _setIdsMensajesOcultos(nuevosMensajesOcultos, callback) {
	      if (!Array.isArray(nuevosMensajesOcultos)) {
	        _LogZimbra2.default.error("Hemos intentado grabar mensajes ocultos incorrectos");
	        return;
	      }
	      chrome.storage.local.set({ mensajesOcultos: nuevosMensajesOcultos }, callback);
	      _LogZimbra2.default.log("Gestor Mensajes. _Set Ids Mensajes Ocultos. Grabados: " + JSON.stringify(nuevosMensajesOcultos));
	    }
	
	    //callback: function ([int] idsMensajesOcultos) {...}
	
	  }, {
	    key: '_getIdsMensajesOcultos',
	    value: function _getIdsMensajesOcultos(callback) {
	      chrome.storage.local.get("mensajesOcultos", function (items) {
	        var mensajesOcultos = [];
	        if (items.mensajesOcultos && Array.isArray(items.mensajesOcultos)) {
	          _LogZimbra2.default.log("Gestor Mensajes. _Get Ids Mensajes Ocultos. La lectura ha sido buena!");
	          mensajesOcultos = items.mensajesOcultos;
	        }
	        _LogZimbra2.default.log("Gestor Mensajes. _Get Ids Mensajes Ocultos. Leídos: " + JSON.stringify(mensajesOcultos));
	        callback(mensajesOcultos);
	      });
	    }
	
	    //callback: function ([Mensaje] mensajesOcultos) {...}
	
	  }, {
	    key: '_getMensajesOcultos',
	    value: function _getMensajesOcultos(callback) {
	      _GestorServidor2.default.getServidor(function (servidor) {
	        GestorMensajes._getIdsMensajesOcultos(function (idsOcultos) {
	          var mensajesOcultos = [];
	          for (var i = 0; i < idsOcultos.length; i++) {
	            var m = servidor.mensajeConId(idsOcultos[i]);
	            if (m) {
	              mensajesOcultos.push(m);
	            }
	          }
	          _LogZimbra2.default.log("Gestor Mensajes. _Get Mensajes Ocultos. mensajesOcultos obtenidos: " + JSON.stringify(mensajesOcultos));
	          callback(mensajesOcultos);
	        });
	      });
	    }
	
	    //callback: function () {...}
	
	  }, {
	    key: '_setMensajesOcultos',
	    value: function _setMensajesOcultos(mensajesOcultos, callback) {
	
	      if (!mensajesOcultos.length) {
	        _LogZimbra2.default.log("Gestor Mensajes. _Set Mensajes Ocultos. Voy a llamar a Borrar Mensajes Ocultos");
	        GestorMensajes.borrarMensajesOcultos(callback);
	        return;
	      }
	
	      function getId(currentValue) {
	        return currentValue.id;
	      }
	
	      var arrayIds = mensajesOcultos.map(getId);
	      GestorMensajes._setIdsMensajesOcultos(arrayIds, callback);
	    }
	
	    //callback: function () {...}
	
	  }, {
	    key: '_sanearMensajesOcultos',
	    value: function _sanearMensajesOcultos(callback) {
	      _GestorServidor2.default.getServidor(function (servidor) {
	
	        if (servidor.error) {
	          // Hay un error al conectar con Zimbra. No es buen momento para "sanear".
	          callback();
	          return;
	        }
	
	        GestorMensajes._getMensajesOcultos(function (mensajesOcultos) {
	
	          function filtro(currentValue) {
	            var idsMensajesServidor = servidor.mensajes.map(function (m) {
	              return m.id;
	            });
	            if (idsMensajesServidor.indexOf(currentValue.id) < 0) {
	              return false;
	            } else {
	              return true;
	            }
	          }
	
	          _LogZimbra2.default.log("Gestor Mensajes. _Sanear Mensajes Ocultos. Voy a llamar a _Set Mensajes Ocultos con: " + JSON.stringify(mensajesOcultos.filter(filtro)));
	          GestorMensajes._setMensajesOcultos(mensajesOcultos.filter(filtro), callback);
	        });
	      });
	    }
	
	    // Se permite añadir un Mensaje o un Array de Mensajes
	    // Incluye Sanear Mensajes Ocultos
	    //callback: function () {...}
	
	  }, {
	    key: 'addMensajeOculto',
	    value: function addMensajeOculto(datos, callback) {
	
	      var nuevosMensajes = datos;
	      // Nos aseguramos de que es un array
	      if (datos instanceof Mensaje) {
	        nuevosMensajes = [datos];
	      }
	
	      GestorMensajes._getMensajesOcultos(function (mensajesOcultos) {
	
	        var mensajesOcultosActualizados = mensajesOcultos;
	
	        var idsMensajesOcultos = mensajesOcultos.map(function (m) {
	          return m.id;
	        });
	
	        for (var i = 0; i < nuevosMensajes.length; i++) {
	          if (idsMensajesOcultos.indexOf(nuevosMensajes[i].id) < 0) {
	            mensajesOcultosActualizados.push(nuevosMensajes[i]);
	          }
	        }
	
	        _LogZimbra2.default.log("Gestor Mensajes. Add Mensaje Oculto. Voy a llamar a _Set Mensajes Ocultos con: " + JSON.stringify(mensajesOcultosActualizados));
	        GestorMensajes._setMensajesOcultos(mensajesOcultosActualizados, function () {
	          GestorMensajes._sanearMensajesOcultos(callback);
	        });
	      });
	    }
	
	    //callback: function ({mensajesNoOcultos:[Mensaje], mensajesOcultos:[Mensaje]})
	
	  }, {
	    key: 'getMensajes',
	    value: function getMensajes(callback) {
	
	      _GestorServidor2.default.getServidor(function (servidor) {
	
	        GestorMensajes._getMensajesOcultos(function (mensajesOcultos) {
	          function filtro(currentValue) {
	            if (mensajesOcultos.indexOf(currentValue) < 0) {
	              return true;
	            } else {
	              return false;
	            }
	          }
	
	          var mensajesNoOcultos = servidor.mensajes ? servidor.mensajes.filter(filtro) : [];
	          callback({ mensajesNoOcultos: mensajesNoOcultos, mensajesOcultos: mensajesOcultos });
	        });
	      });
	    }
	  }]);
	
	  return GestorMensajes;
	}();
	
	exports.default = GestorMensajes;

/***/ },

/***/ 10:
/*!*****************************************!*\
  !*** ./src/lib/GestorNotificaciones.js ***!
  \*****************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	//import LogZimbra from './LogZimbra.js'
	
	
	var _constantes = __webpack_require__(/*! ./constantes.js */ 2);
	
	var _constantes2 = _interopRequireDefault(_constantes);
	
	var _GestorMensajes = __webpack_require__(/*! ./GestorMensajes.js */ 9);
	
	var _GestorMensajes2 = _interopRequireDefault(_GestorMensajes);
	
	var _GestorServidor = __webpack_require__(/*! ./GestorServidor.js */ 4);
	
	var _GestorServidor2 = _interopRequireDefault(_GestorServidor);
	
	var _OpcionesStorage = __webpack_require__(/*! ./OpcionesStorage.js */ 6);
	
	var _OpcionesStorage2 = _interopRequireDefault(_OpcionesStorage);
	
	var _UtilesFirefox = __webpack_require__(/*! ./UtilesFirefox.js */ 11);
	
	var _UtilesFirefox2 = _interopRequireDefault(_UtilesFirefox);
	
	var _UtilesPopup = __webpack_require__(/*! ./UtilesPopup.js */ 12);
	
	var _UtilesPopup2 = _interopRequireDefault(_UtilesPopup);
	
	var _ZimbraNavegador = __webpack_require__(/*! ./ZimbraNavegador.js */ 13);
	
	var _ZimbraNavegador2 = _interopRequireDefault(_ZimbraNavegador);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var GestorNotificaciones = function () {
		function GestorNotificaciones() {
			_classCallCheck(this, GestorNotificaciones);
	
			return null;
		}
	
		/*************************************************************************
	 * Notificaciones
	 **************************************************************************/
		/**
	  * Limpia la notificación que genera esta extensión
	  * callback: function (boolean wasCleared) {...}
	  */
	
	
		_createClass(GestorNotificaciones, null, [{
			key: 'limpiarNotificacion',
			value: function limpiarNotificacion(callback) {
				chrome.notifications.clear(_constantes2.default.ID_NOTIF_CORREO, callback);
			}
		}, {
			key: 'notificarMensajes',
			value: function notificarMensajes() {
	
				_GestorServidor2.default.getServidor(function (servidor) {
	
					// Si la URL está vacía, no notifico nada. Se supone que quien sea pondrá una url en algún momento...
					if (servidor.urlAsString == "") {
						return;
					}
	
					if (_UtilesPopup2.default.getBrowserActionPopupSiAbiero()) {
						return;
					}
	
					_OpcionesStorage2.default.getOpciones(function (opciones) {
						if (!opciones.mostrarNotificaciones) {
							return;
						}
	
						_ZimbraNavegador2.default.zimbraActivo(function (activo) {
							if (activo) {
								return;
							}
	
							//Si hay error
							if (servidor.error) {
								var iconUrl = "img/48_mail_error.png";
								var titulo = chrome.i18n.getMessage("notif_zimbra_mail_error");
	
								var notificationOptions = {
									type: "basic",
									title: titulo,
									iconUrl: iconUrl,
									message: servidor.error,
									requireInteraction: opciones.notificacionesPermanentes
								};
	
								//Ñapa para que funcione en Firefox también
								if (_UtilesFirefox2.default.navegadorEsFirefox()) {
									notificationOptions = {
										type: "basic",
										title: titulo,
										iconUrl: iconUrl,
										message: servidor.error
									};
								}
	
								chrome.notifications.create(_constantes2.default.ID_NOTIF_CORREO, notificationOptions, function (notificationId) {});
								return;
							}
	
							_GestorMensajes2.default.getMensajes(function (datos) {
								var list = [];
								for (var i = 0; i < datos.mensajesNoOcultos.length; i++) {
									var m = datos.mensajesNoOcultos[i];
									list.push({ title: m.de, message: m.titulo });
								}
	
								if (list.length > 0) {
									var _iconUrl = "img/48.png";
									var _titulo = chrome.i18n.getMessage("notif_zimbra_mail") + ". " + chrome.i18n.getMessage("new_mail_notification_message", list.length.toString());
									var mensaje = "Zimbra Mail. " + chrome.i18n.getMessage("new_mail_notification_message", list.length.toString());
	
									var _notificationOptions = {
										type: "list",
										title: _titulo,
										iconUrl: _iconUrl,
										message: mensaje,
										items: list,
										requireInteraction: opciones.notificacionesPermanentes,
										buttons: [{ title: chrome.i18n.getMessage("notif_do_not_show_again_for_these_messages") }]
									};
	
									if (_UtilesFirefox2.default.navegadorEsFirefox()) {
										_notificationOptions = {
											type: "basic",
											title: _titulo,
											iconUrl: _iconUrl,
											message: list.map(function (i) {
												return i.title + ": " + i.message;
											}).join("\n")
										};
									}
	
									chrome.notifications.create(_constantes2.default.ID_NOTIF_CORREO, _notificationOptions, function (notificationId) {});
								}
							});
						});
					});
				});
			}
		}, {
			key: 'hayNotificacionActiva',
			value: function hayNotificacionActiva(callback) {
				chrome.notifications.getAll(function (notifications) {
					if (notifications && notifications[_constantes2.default.ID_NOTIF_CORREO]) {
						callback(true);
						return;
					}
					callback(false);
				});
			}
		}]);
	
		return GestorNotificaciones;
	}();
	
	exports.default = GestorNotificaciones;

/***/ },

/***/ 11:
/*!**********************************!*\
  !*** ./src/lib/UtilesFirefox.js ***!
  \**********************************/
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var UtilesFirefox = function () {
		function UtilesFirefox() {
			_classCallCheck(this, UtilesFirefox);
	
			return null;
		}
	
		_createClass(UtilesFirefox, null, [{
			key: "navegadorEsFirefox",
			value: function navegadorEsFirefox() {
				return window.navigator.userAgent.includes("Firefox");
			}
		}]);
	
		return UtilesFirefox;
	}();
	
	exports.default = UtilesFirefox;

/***/ },

/***/ 12:
/*!********************************!*\
  !*** ./src/lib/UtilesPopup.js ***!
  \********************************/
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var UtilesPopup = function () {
		function UtilesPopup() {
			_classCallCheck(this, UtilesPopup);
	
			return null;
		}
	
		_createClass(UtilesPopup, null, [{
			key: "getBrowserActionPopupSiAbiero",
			value: function getBrowserActionPopupSiAbiero() {
				var popups = chrome.extension.getViews({ type: 'popup' });
				var popup = null;
				for (var i = 0; i < popups.length; i++) {
					if (popups[i].document.title == chrome.i18n.getMessage("ba_default_title")) {
						popup = popups[i];
					}
				}
	
				return popup;
			}
		}]);
	
		return UtilesPopup;
	}();
	
	exports.default = UtilesPopup;

/***/ },

/***/ 13:
/*!************************************!*\
  !*** ./src/lib/ZimbraNavegador.js ***!
  \************************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _GestorServidor = __webpack_require__(/*! ./GestorServidor.js */ 4);
	
	var _GestorServidor2 = _interopRequireDefault(_GestorServidor);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	//let LogZimbra from './LogZimbra.js')
	
	var ZimbraNavegador = function () {
		function ZimbraNavegador() {
			_classCallCheck(this, ZimbraNavegador);
	
			return null;
		}
	
		// callback: function (tabs) {...}
	
	
		_createClass(ZimbraNavegador, null, [{
			key: "_tabsConZimbraAbierto",
			value: function _tabsConZimbraAbierto(callback) {
	
				_GestorServidor2.default.getServidor(function (servidor) {
	
					if (servidor.urlError) {
						callback([]);
						return;
					}
	
					var url = servidor.urlAsURL;
	
					chrome.tabs.query({
						status: "complete",
						url: "*://" + url.host + "/*"
					}, function (tabs) {
						callback(tabs);
						return;
					});
				});
			}
		}, {
			key: "abrirOActivarZimbra",
			value: function abrirOActivarZimbra() {
	
				_GestorServidor2.default.getServidor(function (servidor) {
	
					if (servidor.urlError) {
						return;
					}
					var url = servidor.urlAsURL;
					ZimbraNavegador._tabsConZimbraAbierto(function (tabs) {
						if (tabs.length) {
							chrome.windows.update(tabs[0].windowId, { focused: true });
							chrome.tabs.update(tabs[0].id, { active: true });
						} else if (url) {
							chrome.tabs.create({ active: true, url: url.toString() });
						} else {
							return;
						}
					});
				});
			}
	
			/**
	   * Comprueba si Zimbra está activo ahora (o sea, está abierto y el usuario lo está "viendo")
	   * @param callback: function (boolean activo). Función callback 
	   */
	
		}, {
			key: "zimbraActivo",
			value: function zimbraActivo(callback) {
				_GestorServidor2.default.getServidor(function (servidor) {
	
					if (servidor.urlError) {
						callback(false);
						return;
					}
	
					var url = servidor.urlAsURL;
	
					chrome.windows.getLastFocused({ populate: true }, function (win) {
	
						// Si la ventana no está "focused", consideramos que la ventana del navegador no está activa
						if (win.focused === false) {
							callback(false);
							return;
						}
	
						// Si aún hay opciones de que Zimbra esté activo, 
						// miramos el estado de la ventana. Si no está en la lista, consideramos que Zimbra no está activo
						var estadosValidos = ["normal", "maximized", "fullscreen"];
						if (estadosValidos.indexOf(win.state) < 0) {
							callback(false);
							return;
						}
	
						chrome.tabs.query({ active: true,
							highlighted: true,
							lastFocusedWindow: true,
							status: "complete", url: "*://" + url.host + "/*"
						}, function (tabs) {
							if (tabs.length) {
								callback(true);
								return;
							} else {
								callback(false);
								return;
							}
						});
					});
				});
			}
		}]);
	
		return ZimbraNavegador;
	}();
	
	exports.default = ZimbraNavegador;

/***/ },

/***/ 190:
/*!******************************!*\
  !*** ./src/lib/UtilesURL.js ***!
  \******************************/
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var UtilesURL = function () {
		function UtilesURL() {
			_classCallCheck(this, UtilesURL);
	
			return null;
		}
	
		_createClass(UtilesURL, null, [{
			key: "codificarParametrosQueryURL",
			value: function codificarParametrosQueryURL(parametros) {
				var ret = [];
				for (var d in parametros) {
					ret.push(encodeURIComponent(d) + "=" + encodeURIComponent(parametros[d]));
				}
				return ret.join("&");
			}
		}, {
			key: "codificarQueryURL",
			value: function codificarQueryURL(urlBase, parametros) {
				return urlBase + "?" + UtilesURL.codificarParametrosQueryURL(parametros);
			}
		}, {
			key: "stringToURL",
			value: function stringToURL(string) {
				var url = void 0;
				try {
					url = new URL(string);
				} catch (err) {
					var mensajeError = err.message;
					if (!mensajeError) {
						mensajeError = "Error creando URL";
					}
					return { error: mensajeError };
				}
				return { url: url };
			}
		}]);
	
		return UtilesURL;
	}();
	
	exports.default = UtilesURL;

/***/ }

/******/ });
//# sourceMappingURL=background-bundle.js.map