import constantes from './constantes.js'

import GestorMensajes from './GestorMensajes.js'
import GestorServidor from './GestorServidor.js'
//import LogZimbra from './LogZimbra.js'
import OpcionesStorage from './OpcionesStorage.js'
import UtilesFirefox from './UtilesFirefox.js'
import UtilesPopup from './UtilesPopup.js'
import ZimbraNavegador from './ZimbraNavegador.js'


export default class GestorNotificaciones {
	constructor () {
		return null
	}

	/*************************************************************************
	* Notificaciones
	**************************************************************************/
	/**
	 * Limpia la notificación que genera esta extensión
	 * callback: function (boolean wasCleared) {...}
	 */
	static limpiarNotificacion (callback) {
	  chrome.notifications.clear(constantes.ID_NOTIF_CORREO, callback)
	}


	static notificarMensajes () {

		GestorServidor.getServidor(function(servidor){

			// Si la URL está vacía, no notifico nada. Se supone que quien sea pondrá una url en algún momento...
			if (servidor.urlAsString == "") {
				return
			}


			if (UtilesPopup.getBrowserActionPopupSiAbiero()) {
				return
			}

			OpcionesStorage.getOpciones(function(opciones) {
				if (!opciones.mostrarNotificaciones) {
					return
				}

				ZimbraNavegador.zimbraActivo(function (activo) { 
					if (activo) {
						return
					}

					//Si hay error
					if(servidor.error) {
						let iconUrl = "img/48_mail_error.png"
						let titulo = chrome.i18n.getMessage("notif_zimbra_mail_error")

						let notificationOptions = {
															          type: "basic",
															          title: titulo,
															          iconUrl: iconUrl,
															          message: servidor.error,
															          requireInteraction: opciones.notificacionesPermanentes
															        }
						
						//Ñapa para que funcione en Firefox también
						if (UtilesFirefox.navegadorEsFirefox()) {
							notificationOptions = {
																			type: "basic",
														          title: titulo,
														          iconUrl: iconUrl,
														          message: servidor.error,
																		}
						}

						chrome.notifications.create(constantes.ID_NOTIF_CORREO, notificationOptions, function (notificationId) {} )
						return
					}

				  GestorMensajes.getMensajes (function (datos) {
						let list = []
					  for (let i = 0; i < datos.mensajesNoOcultos.length; i++) {
					  	let m = datos.mensajesNoOcultos[i]
					  	list.push({title:m.de, message:m.titulo})
					  }

				  	if (list.length > 0) {
					  	let iconUrl = "img/48.png"
					  	let titulo = chrome.i18n.getMessage("notif_zimbra_mail") + ". " + chrome.i18n.getMessage("new_mail_notification_message",list.length.toString())
					  	let mensaje ="Zimbra Mail. " + chrome.i18n.getMessage("new_mail_notification_message",list.length.toString())

					    let notificationOptions = {
					      type: "list",
					      title: titulo,
					      iconUrl: iconUrl,
					      message: mensaje,
					      items: list,
					      requireInteraction: opciones.notificacionesPermanentes,
					      buttons:[{title:chrome.i18n.getMessage("notif_do_not_show_again_for_these_messages")}]
					    }


							if (UtilesFirefox.navegadorEsFirefox()) {
								notificationOptions = {
																				type: "basic",
															          title: titulo,
															          iconUrl: iconUrl,
															          message: list.map(i => i.title+": "+i.message).join("\n"),
																			}
							}



					    chrome.notifications.create(constantes.ID_NOTIF_CORREO, notificationOptions, function (notificationId) {} )
					  }
				  })
				})
			})

		})
		
	}


	static hayNotificacionActiva (callback) {
		chrome.notifications.getAll(function (notifications) {
			if (notifications && notifications[constantes.ID_NOTIF_CORREO]) {
				callback(true)
				return
			}
			callback(false)
		})
	}
}