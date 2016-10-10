class OpcionesStorage {
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
					urlZimbra: urlZimbraDefecto,
          minutosIntervalo: minutosIntervaloDefecto,
          mostrarNotificaciones: mostrarNotificacionesDefecto,
          notificacionesPermanentes: notificacionesPermanentesDefecto
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
        	opciones.urlZimbra = urlZimbraDefecto
        }
        if (opciones.minutosIntervalo == null) {
        	opciones.minutosIntervalo = minutosIntervaloDefecto
        }
        if (opciones.mostrarNotificaciones == null) {
        	opciones.mostrarNotificaciones = mostrarNotificacionesDefecto
        }
        if (opciones.notificacionesPermanentes == null) {
        	opciones.notificacionesPermanentes = notificacionesPermanentesDefecto
        }
        
        callback(opciones)
      }
    )
	}

}