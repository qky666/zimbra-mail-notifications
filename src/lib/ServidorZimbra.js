import LogZimbra from './LogZimbra.js'

export default class ServidorZimbra {
	constructor(urlAsString) {
		this._urlAsString = urlAsString
		this._mensajes = []
		//this._errorRequest = "¡No inicializado!"
		this._estadoCarga = {error:"¡No inicializado!"}
		this._ultimaConsulta = null
	}

	get urlAsString () 					{return this._urlAsString}
	
	get mensajes 		() 					{return this._mensajes}

	get urlAsURL		()					{
		let strToURL = UtilesURL.stringToURL(this._urlAsString)
		if (strToURL.hasOwnProperty('error')) {
			return null
		}
		return strToURL.url
	}
	
	get urlError		()					{
		let strToURL = UtilesURL.stringToURL(this._urlAsString)
		if (strToURL.hasOwnProperty('error')) {
			return strToURL.error
		}
		return null
	}

	get error 			()					{
		if (this.urlError) {
			return this.urlError
		}
		if (this._estadoCarga.error) {
			return this._estadoCarga.error
		} 
		return null
	}

	get estado 			()					{
		if (this.urlError) {
			return {error:this.urlError}
		}
		return JSON.parse(JSON.stringify(this._estadoCarga))
	}
	
	init (callback) {
		this.actualizarMensajesNoleidos(callback)
	}

	
	usarCache() {
		if (this.error) {
			return false
		}
		let ahora = new Date()
		if ( this._ultimaConsulta && (ahora.getTime()-this._ultimaConsulta.getTime()<2000) ) {
			return true
		}
		return false
	}	


	// callback: function ()
	actualizarMensajesNoleidos (callback) {
		if (this.urlError) {
			this._mensajes = null
			this._estadoCarga = {error:this.urlError}
			callback()
			return
		}

		if (this.usarCache()) {
			// Voy a usar caché, o sea, no actualizo realmente los mensajes.
			callback()
			return
		}

		let url = this.urlAsURL

	  let parametros = { query: "is:unread" }
	  let urlBase = url.protocol + "//" +  url.host + "/home/~/inbox.json"
	  let urlJson = UtilesURL.codificarQueryURL(urlBase, parametros)

	  let _this = this
	  let cb = function () {
	  	_this._ultimaConsulta = new Date()
	  	callback()
	  }

	  this._estadoCarga = {cargando:true}
	  if (window.fetch) {
	  	this._actualizarNoLeidosFetch(urlJson, cb)
	  } else {
	  	this._actualizarNoLeidosXHR(urlJson, cb)
	  }
	}


	_actualizarNoLeidosXHR (urlJson, callback) {
		LogZimbra.log("GestorZimbra. Actualizar No Leidos XHR. Inicio")

		let thisZimbraServer = this

	  let xhr = new XMLHttpRequest()
	  xhr.open("GET", urlJson, true)
	  xhr.timeout = 4000
	  xhr.withCredentials = true

	  xhr.onload = function() {
		  // Hemos terminado y ha ido bien.
		  // Debido a un error en la respuesta del servidor de correo web Zimbra, debemos hacer una transformación de la respuesta.
	  	// El problema es que en la respuesta se incluye texto del tipo "\x". Este texto no puede aparecer en un JSON correcto,
	  	// así que lo sustituimos por "\u00", que debería ser lo mismo
	  	if (this.status != 200) {
	  		// Algo no ha ido bien
	  		thisZimbraServer._establecerErrorRequest(this.statusText)
	  		callback()
	  		return
	  	}

			thisZimbraServer._jsonAMensajes (this.responseText)
		  callback()
		  return
		}

		xhr.onerror = function (e) {
			thisZimbraServer._establecerErrorRequest(this.statusText)
			callback()
			return
		}
		xhr.send()
	}

	_actualizarNoLeidosFetch (urlJson, callback) {
		LogZimbra.log("GestorZimbra. Actualizar No Leidos Fetch. Inicio")
		let thisZimbraServer = this

		window.fetch(urlJson, 
		            {	credentials:'include',
			            method: 'GET',
			            headers: new Headers().append('Content-Type', 'text/plain'),
			            mode: 'cors',
			            cache: 'default'
		            }
		            )
	  .then(function(response) {
	    if (response && response.ok) {
	      return response.text()  
	    } else {
	    	if (response && response.statusText) {
	      	thisZimbraServer._establecerErrorRequest(response.statusText)
	      } else {
	      	thisZimbraServer._establecerErrorRequest(null)
	      }
	      callback()
	  		return Promise.reject(new Error("Response no ok"))
	    } 
	  },function(reason) {
	  		if (reason && reason.message) {
	  			thisZimbraServer._establecerErrorRequest(reason.message)
	  		} else {
	  			thisZimbraServer._establecerErrorRequest(null)
	  		}
	  		callback()
	  		return Promise.reject(new Error("Promise rechazada"))
	  })
	  .then(function(myText) {
	    thisZimbraServer._jsonAMensajes(myText)
	    callback()
	    return
	  })

	}

	_establecerErrorRequest (error) {
		let e
		if (error) {
			e = error
		} else {
			e = chrome.i18n.getMessage("error_generico")
		}

		this._estadoCarga = {error:e}
		this._mensajes = null
	}

	_jsonAMensajes (json) {
		let jsonStr = json.replace(/\\x/g,"\\u00")
    let jsonParsed = JSON.parse(jsonStr)

		let mens = []
    if (jsonParsed.m) {
      for (let i = 0; i < jsonParsed.m.length; i++) {
      	let mensJson = jsonParsed.m[i]
        let m = new Mensaje(mensJson)
        mens.push(m)
      }
    }

    this._estadoCarga = {ok:true}
  	this._mensajes = mens
	  return
	}

	mensajeConId (idMensaje) {
		let mensaje = null

		function filtro (currentValue) {
			return currentValue.id == idMensaje
		}

		let filtrado = this.mensajes.filter(filtro)

		if (filtrado.length) {
			mensaje = filtrado[0]
			LogZimbra.log("Servidor Zimbra. Mensaje Con Id. He encontrado el mensaje: " + JSON.stringify(mensaje))
		} else {
			LogZimbra.log("Servidor Zimbra. Mensaje Con Id. No he encontrado el mensaje con id: " + idMensaje)
		}

		return mensaje
	}
}