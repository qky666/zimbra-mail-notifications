export default class UtilesFirefox {
	
	constructor() {
		return null
	}

	static navegadorEsFirefox() {
		return window.navigator.userAgent.includes("Firefox")
	}
	
}