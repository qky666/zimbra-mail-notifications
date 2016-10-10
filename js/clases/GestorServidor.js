class GestorServidor {
	constructor () {
		return null
	}

	//callback: function (servidor) {...}
	static getServidor(callback) {
		let _this = this
		//let servidorPrevio = this._servidor
		OpcionesStorage.getOpciones(function(opciones){
			
			LogZimbra.log("Gestor Servidor. Get Servidor. Voy a mirar si existe servidor previo")
			if (_this._servidor) {
				LogZimbra.log("Gestor Servidor. Get Servidor. Sí existe servidor previo: _this._servidor.urlAsString=" + 
					_this._servidor.urlAsString + ". opciones.urlZimbra=" + opciones.urlZimbra)				
				if (_this._servidor.urlAsString == opciones.urlZimbra) {
					LogZimbra.log("Gestor Servidor. Get Servidor. Existe servidor previo y la URL es la buena")				
					callback (_this._servidor)
					return
				}
			} 

			LogZimbra.log("Gestor Servidor. Get Servidor. Estoy creando un nuevo servidor")
			_this._servidor = new ServidorZimbra(opciones.urlZimbra)
			_this._servidor.init(function(){
				callback(_this._servidor)
			})
		
		})
	}
}