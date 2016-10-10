class UtilesURL {
	
	constructor() {
		return null
	}

	static codificarParametrosQueryURL(parametros){
	  let ret = [];
	  for (let d in parametros) {
	    ret.push(encodeURIComponent(d) + "=" + encodeURIComponent(parametros[d]));
	  }
	  return ret.join("&");
	}

	static codificarQueryURL(urlBase,parametros) {
		return urlBase + "?" + UtilesURL.codificarParametrosQueryURL(parametros)
	}

	static stringToURL(string) {
		let url 
		try {
			url = new URL(string)
		}
		catch (err) {
			let mensajeError = err.message
			if (!mensajeError) {
				mensajeError = "Error creando URL"
			}
			return {error:mensajeError}
		}
		return {url:url}
	}
}