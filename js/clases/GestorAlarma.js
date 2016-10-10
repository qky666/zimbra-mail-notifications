class GestorAlarma {
	constructor () {
		return null
	}

	static establecerAlarma () {

		GestorServidor.getServidor(function(servidor) {
			// Si la url está vacía, no pongo alarma
			if (servidor.urlAsString == "") {
				chrome.alarms.clear(ID_ALARMA_CORREO, function (wasCleared) {} )
				return
			}

			OpcionesStorage.getOpciones(function(opciones) {
			  let periodo = opciones.minutosIntervalo
			  // Si estamos en modo test, hago que la alarma salte más a menudo
			  if (periodoOverride) {
			    periodo = periodoOverride
			  }

			  chrome.alarms.create(ID_ALARMA_CORREO, {delayInMinutes:periodo, periodInMinutes: periodo});  		
			}) 
		})
	}
		
}