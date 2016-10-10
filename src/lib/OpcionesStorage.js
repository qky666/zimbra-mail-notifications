import constantes from './constantes.js'

import LogZimbra from './LogZimbra.js'

export default class OpcionesStorage {
	constructor () {
		return null
	}

	//callback: function () {...}
	static borrarOpciones (callback) {
		chrome.storage.local.remove(["opciones"], callback)
	}

	//callback: function () {...}
	static setOpciones (nuevasOpciones, callback) {
    if (typeof(nuevasOpciones) != 'object' || Array.isArray(nuevasOpciones)) {
      LogZimbra.error("Hemos intentado grabas unas opciones incorrectas")
    }
		chrome.storage.local.set({opciones:nuevasOpciones}, callback)
	}

	//callback: function (opciones) {...}
 	static getOpciones(callback) {
		chrome.storage.local.get(
	  	{
				opciones: {
					urlZimbra: constantes.urlZimbraDefecto,
          minutosIntervalo: constantes.minutosIntervaloDefecto,
          mostrarNotificaciones: constantes.mostrarNotificacionesDefecto,
          notificacionesPermanentes: constantes.notificacionesPermanentesDefecto
        }
      }, 
      function(items) {
        LogZimbra.log("OpcionesStorage. Get Opciones. Leído: items="+JSON.stringify(items))
        let opciones = items.opciones

        //Comprobamos que lo que leemos tiene buena pinta
        if (typeof(opciones) != 'object' || Array.isArray(opciones)) {
          opciones = {}
        }
        
        if (opciones.urlZimbra == null) {
        	opciones.urlZimbra = constantes.urlZimbraDefecto
        }
        if (opciones.minutosIntervalo == null) {
        	opciones.minutosIntervalo = constantes.minutosIntervaloDefecto
        }
        if (opciones.mostrarNotificaciones == null) {
        	opciones.mostrarNotificaciones = constantes.mostrarNotificacionesDefecto
        }
        if (opciones.notificacionesPermanentes == null) {
        	opciones.notificacionesPermanentes = constantes.notificacionesPermanentesDefecto
        }
        
        callback(opciones)
      }
    )
	}

}