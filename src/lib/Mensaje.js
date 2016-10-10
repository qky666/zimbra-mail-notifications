export default class Mensaje {
  constructor (raw) {
    this._raw = raw
  }
  get raw     () {return this._raw}
  get titulo  () {return this._raw.su}
  get de      () {return this._raw.e[0].p || this._raw.e[0].a}
  get cuerpo  () {return this._raw.fr}
  get id      () {return this._raw.id}

  serializar () {
  	let serializacion = {
  		titulo: this.titulo,
  		de: this.de,
  		cuerpo: this.cuerpo,
  		id: this.id
  	}
  	return serializacion
  }

  static serializarArray (arrayMensajes = []) {
  	let resultado = []
  	for ( let i=0 ; i < arrayMensajes.length; i++) {
  		resultado.push(arrayMensajes[i].serializar())
  	}
  	return resultado
  }
}