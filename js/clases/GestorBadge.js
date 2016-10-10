class GestorBadge {
	constructor() {
		return null
	}

	static establecerDistintivoEnBoton () {
		let ops
		let texto

		GestorServidor.getServidor(function(servidor) {

			if (servidor.error) {
				chrome.browserAction.setBadgeBackgroundColor({color: [240, 0, 0, 255]})
				chrome.browserAction.setBadgeText({text: "X"})
			} else {
				GestorMensajes.getMensajes (function (datos) {
					let num = datos.mensajesNoOcultos.length
					chrome.browserAction.setBadgeText({text: num.toString()})
					if (num == 0) {
						chrome.browserAction.setBadgeBackgroundColor({color: [0, 0, 220, 255]})
					} else {
						chrome.browserAction.setBadgeBackgroundColor({color: [0, 190, 0, 255]})
					}
				})
			}
		})
	}
}