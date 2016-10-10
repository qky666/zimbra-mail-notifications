var CoordinadorZimbra = class {

	constructor () {
	}

	static configurarListeners () {
		
		//Pongo este listener el primero para que se ejecute cuando se instala (si lo pongo en el callback parece que no se ejecuta a tiempo)
		if (chrome && chrome.runtime && chrome.runtime.onInstalled && chrome.runtime.onInstalled.addListener) {
			chrome.runtime.onInstalled.addListener(function(details) {
				CoordinadorZimbra.runtimeOnInstalledListener(details)
			})
		}

		//De hecho, pongo todos los listener primero aquí para evitar que algunas cosas se "pierdan" si lo pongo en el callback
		//Listeners		
		chrome.notifications.onClicked.addListener(function (notificationId) {
			CoordinadorZimbra.notificationsOnClickedListener(notificationId)
		})

		if (chrome && chrome.notifications && chrome.notifications.onButtonClicked && chrome.notifications.onButtonClicked.addListener){
			chrome.notifications.onButtonClicked.addListener(function(notificationId, buttonIndex) {
				CoordinadorZimbra.notificationsOnButtonClickedListener(notificationId, buttonIndex)
			})	
		}
		
		chrome.notifications.onClosed.addListener(function (notificationId, byUser) {
			CoordinadorZimbra.notificationsOnClosedListener(notificationId, byUser)
		})

		chrome.alarms.onAlarm.addListener(function (alarm) {
			CoordinadorZimbra.alarmsOnAlarmListener(alarm)
		})

		chrome.tabs.onActivated.addListener(function (activeInfo) {
			CoordinadorZimbra.tabsOnActivatedListener(activeInfo)
		})
	
		chrome.windows.onFocusChanged.addListener(function (windowId) {
			CoordinadorZimbra.windowsOnFocusChangedListener(windowId)
		})

		chrome.browserAction.onClicked.addListener(function (tab) {
			CoordinadorZimbra.browserActionOnClickedListener(tab)
		})

		chrome.storage.onChanged.addListener(function(changes,areaName) {
			CoordinadorZimbra.storageOnChangedListener(changes,areaName)
		})
		
		CoordinadorZimbra.escucharWebNavigationOnCompleted()

	}


	/*************************************************************************
	* Funciones de Alto Nivel (afectan a UI)
	**************************************************************************/

	//Parámetros: {notificacion:Boolean}
	static actualizarMensajes (parametros, callback) {

		GestorServidor.getServidor(function(servidor) {

			servidor.actualizarMensajesNoleidos (function () {

				CoordinadorZimbra.actualizarUis(parametros)
				callback()

			})	

		})
	}

	
	//Parámetros: {notificacion:Boolean}
	static actualizarUis (parametros) {
		if (parametros.notificacion) {
			GestorNotificaciones.notificarMensajes()
		}
		
		GestorBadge.establecerDistintivoEnBoton()

		
		let ba = UtilesPopup.getBrowserActionPopupSiAbiero()
		if (ba) {
			ba.actualizarDatos()
		} 
	}


	static abrirOActivarZimbraYLimpiarNotificacion () {
		ZimbraNavegador.abrirOActivarZimbra()
		GestorNotificaciones.limpiarNotificacion(function (wasCleared) {})
	}


	static siZimbraActivoLimpiarNotificacion () {
		GestorNotificaciones.hayNotificacionActiva(function (activa) {
			if (activa == true) {
				ZimbraNavegador.zimbraActivo ( function (activo) {
					if (activo) {
						GestorNotificaciones.limpiarNotificacion(function (wasCleared) {})
					}
				})
			}
		})
	}


	/*************************************************************************
	* Listeners
	**************************************************************************/
	
	static runtimeOnInstalledListener(details) {
		LogZimbra.log("CoordinadorZimbra. Runtime On Installed Listener. Inicio")
		chrome.runtime.openOptionsPage( function () {} )
		GestorAlarma.establecerAlarma()
	}


	static notificationsOnButtonClickedListener (notificationId, buttonIndex) {
		LogZimbra.log("CoordinadorZimbra. Notifications On Button Clicked Listener. Inicio")
		if (notificationId == ID_NOTIF_CORREO && buttonIndex == 0) {
			
			GestorNotificaciones.limpiarNotificacion(function (wasCleared) {})

			GestorAlarma.establecerAlarma()

			GestorMensajes.getMensajes (function(datos) {
				LogZimbra.log("CoordinadorZimbra. callback de Get Mensajes. Vamos a añadir mensajes ocultos: "+ JSON.stringify(datos.mensajesNoOcultos))
				GestorMensajes.addMensajeOculto(datos.mensajesNoOcultos, function(){
					CoordinadorZimbra.actualizarMensajes({notificacion:false},function(){})
				})
			})
		}	
	}


	static notificationsOnClickedListener (notificationId) {
		LogZimbra.log("CoordinadorZimbra. Notifications On Clicked Listener. Inicio")
		if (notificationId == ID_NOTIF_CORREO) {
			CoordinadorZimbra.abrirOActivarZimbraYLimpiarNotificacion()
			GestorAlarma.establecerAlarma()
		}		
	}


	static notificationsOnClosedListener (notificationId, byUser) {
		LogZimbra.log("CoordinadorZimbra. Notifications On Closed Listener. Inicio")
		if (notificationId == ID_NOTIF_CORREO && byUser) {
			GestorAlarma.establecerAlarma()
		}		
	}


	static alarmsOnAlarmListener (alarm) {
		LogZimbra.log("CoordinadorZimbra. Alarms On Alarm Listener. Inicio")
		LogZimbra.log("CoordinadorZimbra. Alarms On Alarm Listener. alarm.name=" + alarm?alarm.name:"¡Sin alarma!")
		if (alarm && alarm.name == ID_ALARMA_CORREO) {
			CoordinadorZimbra.actualizarMensajes({notificacion:true}, function () {} )
		}
	}


	static tabsOnActivatedListener (activeInfo) {
		LogZimbra.log("CoordinadorZimbra. Tabs On Activated Listener. Inicio")
		CoordinadorZimbra.siZimbraActivoLimpiarNotificacion()
	}

	static webNavigationOnCompletedListener () {
		LogZimbra.log("CoordinadorZimbra. Web Navigation On Completed Listener. Inicio")
		CoordinadorZimbra.siZimbraActivoLimpiarNotificacion()
	}


	static windowsOnFocusChangedListener (windowId) {
		LogZimbra.log("CoordinadorZimbra. Windows On Focus Changed Listener. Inicio")
		CoordinadorZimbra.siZimbraActivoLimpiarNotificacion()	
	}

	// Si hay popup asociado, este método no se llama, así que nos sirve de poco...
	static browserActionOnClickedListener (tab) {
		GestorNotificaciones.limpiarNotificacion(function (wasCleared) {})
		CoordinadorZimbra.actualizarMensajes({notificacion:false}, function(){})
	}

	static storageOnChangedListener (changes,areaName) {
		if (changes.hasOwnProperty("opciones")){
			GestorAlarma.establecerAlarma()
			CoordinadorZimbra.escucharWebNavigationOnCompleted()
			CoordinadorZimbra.actualizarMensajes({notificacion:true}, function (){})
		}
	}
	/*************************************************************************
	* Gestión de listeners condicionales
	**************************************************************************/	
	static escucharWebNavigationOnCompleted () {
		
		let webNavigationOnCompletedListenerWrap = function () {
			CoordinadorZimbra.webNavigationOnCompletedListener()
		}
	
		chrome.webNavigation.onCompleted.removeListener(webNavigationOnCompletedListenerWrap)
		
		GestorServidor.getServidor(function(servidor){

			if (servidor.urlError) {
				return
			}
			
			let url = servidor.urlAsURL
			chrome.webNavigation.onCompleted.addListener(webNavigationOnCompletedListenerWrap, {url: [{hostEquals:url.host}]} )

		})
		
	}

	/*************************************************************************
	* Llamados desde la UI
	**************************************************************************/

	static onLoadBrowserAction (callback) {
		LogZimbra.log("CoordinadorZimbra. On Load Browser Action. Inicio")
		GestorNotificaciones.limpiarNotificacion(function (wasCleared) {})
		CoordinadorZimbra.actualizarMensajes({notificacion:false},callback)
	}

	static onClickMensaje () {
		let ba = UtilesPopup.getBrowserActionPopupSiAbiero()
		if (ba) {
			ba.close()
		}
		CoordinadorZimbra.abrirOActivarZimbraYLimpiarNotificacion()
		GestorAlarma.establecerAlarma()
	}

	static onMostrarOcultos () {
		GestorMensajes.borrarMensajesOcultos(function(){
			CoordinadorZimbra.actualizarMensajes({notificacion:false},function(){})
		})
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
	static getDatos (callback) {
		GestorServidor.getServidor(function(servidor){
			GestorMensajes.getMensajes(function(datos){
				callback({
					mensajesNoLeidos:{
						noOcultos:datos.mensajesNoOcultos,
						ocultos:datos.mensajesOcultos
					},
					estado:servidor.estado
				})
			})
		})
	}
}