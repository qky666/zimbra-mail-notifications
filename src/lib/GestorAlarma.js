import constantes from "./constantes.js"

import GestorServidor from './GestorServidor.js'
import OpcionesStorage from './OpcionesStorage.js'




export default class GestorAlarma {
	constructor () {
		return null
	}

	static establecerAlarma () {

		GestorServidor.getServidor(function(servidor) {
			// Si la url está vacía, no pongo alarma
			if (servidor.urlAsString == "") {
				chrome.alarms.clear(constantes.ID_ALARMA_CORREO, function (wasCleared) {} )
				return
			}

			OpcionesStorage.getOpciones(function(opciones) {
			  let periodo = opciones.minutosIntervalo
			  // Si estamos en modo test, hago que la alarma salte más a menudo
			  if (constantes.periodoOverride) {
			    periodo = constantes.periodoOverride
			  }

			  chrome.alarms.create(constantes.ID_ALARMA_CORREO, {delayInMinutes:periodo, periodInMinutes: periodo});  		
			}) 
		})
	}
		
}