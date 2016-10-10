import constantes from './constantes.js'

export default class LogZimbra {
	constrctor() {
		return null
	}

	static log(cadena) {
		if (!constantes.logs) {
			return
		}
		let date = new Date()
		console.log(date + ". " + cadena)
	}

	static error(cadena) {
		let date = new Date()
		console.error(date + ". " + cadena)	
	}
}