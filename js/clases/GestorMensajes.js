class GestorMensajes {
  constructor () {
    return null
  }

  //callback: function () {...}
  static borrarMensajesOcultos (callback) {
    LogZimbra.log("Gestor Mensajes. Borrar Mensajes Ocultos. Inicio")
    chrome.storage.local.remove(["mensajesOcultos"], callback)
  }

  //callback: function () {...}
  static _setIdsMensajesOcultos (nuevosMensajesOcultos, callback) {
    if(!Array.isArray(nuevosMensajesOcultos)) {
      LogZimbra.error("Hemos intentado grabar mensajes ocultos incorrectos")
      return
    }
    chrome.storage.local.set({mensajesOcultos:nuevosMensajesOcultos}, callback)
    LogZimbra.log("Gestor Mensajes. _Set Ids Mensajes Ocultos. Grabados: " + JSON.stringify(nuevosMensajesOcultos))
  }

  //callback: function ([int] idsMensajesOcultos) {...}
  static _getIdsMensajesOcultos(callback) {
    chrome.storage.local.get("mensajesOcultos", function(items) {
      let mensajesOcultos = []
      if (items.mensajesOcultos && Array.isArray(items.mensajesOcultos)) {
        LogZimbra.log("Gestor Mensajes. _Get Ids Mensajes Ocultos. La lectura ha sido buena!")
        mensajesOcultos = items.mensajesOcultos
      }
      LogZimbra.log("Gestor Mensajes. _Get Ids Mensajes Ocultos. Leídos: " + JSON.stringify(mensajesOcultos))
      callback(mensajesOcultos)
    })
  }

  //callback: function ([Mensaje] mensajesOcultos) {...}
  static _getMensajesOcultos (callback) {
    GestorServidor.getServidor(function(servidor) {
      GestorMensajes._getIdsMensajesOcultos (function (idsOcultos) {
        let mensajesOcultos = []
        for (let i = 0; i < idsOcultos.length; i++) {
          let m = servidor.mensajeConId(idsOcultos[i])
          if (m) {
            mensajesOcultos.push(m)
          }
        }
        LogZimbra.log("Gestor Mensajes. _Get Mensajes Ocultos. mensajesOcultos obtenidos: " + JSON.stringify(mensajesOcultos))
        callback(mensajesOcultos)
      })
    })
  }

  //callback: function () {...}
  static _setMensajesOcultos (mensajesOcultos, callback) {
    
      if (!mensajesOcultos.length) {
        LogZimbra.log("Gestor Mensajes. _Set Mensajes Ocultos. Voy a llamar a Borrar Mensajes Ocultos")
        GestorMensajes.borrarMensajesOcultos(callback)
        return
      }

      function getId (currentValue) {
        return currentValue.id
      }

      let arrayIds = mensajesOcultos.map(getId)
      GestorMensajes._setIdsMensajesOcultos(arrayIds,callback)
  }

  //callback: function () {...}
  static _sanearMensajesOcultos (callback) {
    GestorServidor.getServidor(function(servidor){

      if (servidor.error) {
        // Hay un error al conectar con Zimbra. No es buen momento para "sanear".
        callback()
        return
      }

      GestorMensajes._getMensajesOcultos (function (mensajesOcultos) {
        
        function filtro (currentValue) {
          let idsMensajesServidor = servidor.mensajes.map(m => m.id)
          if (idsMensajesServidor.indexOf(currentValue.id) < 0 ) {
            return false
          } else {
            return true
          }
        } 
        
        LogZimbra.log("Gestor Mensajes. _Sanear Mensajes Ocultos. Voy a llamar a _Set Mensajes Ocultos con: " 
          + JSON.stringify(mensajesOcultos.filter(filtro)))
        GestorMensajes._setMensajesOcultos(mensajesOcultos.filter(filtro), callback)
      
      })

    })

    
  }


  // Se permite añadir un Mensaje o un Array de Mensajes
  // Incluye Sanear Mensajes Ocultos
  //callback: function () {...}
  static addMensajeOculto (datos, callback) {

    let nuevosMensajes = datos
    // Nos aseguramos de que es un array
    if (datos instanceof Mensaje) {
      nuevosMensajes = [datos]
    }

    GestorMensajes._getMensajesOcultos (function (mensajesOcultos) { 
      
      let mensajesOcultosActualizados = mensajesOcultos

      let idsMensajesOcultos = mensajesOcultos.map(m => m.id)

      for (var i = 0; i < nuevosMensajes.length; i++) {
        if (idsMensajesOcultos.indexOf(nuevosMensajes[i].id) < 0) {
          mensajesOcultosActualizados.push(nuevosMensajes[i])
        }
      }

      LogZimbra.log("Gestor Mensajes. Add Mensaje Oculto. Voy a llamar a _Set Mensajes Ocultos con: " 
        + JSON.stringify(mensajesOcultosActualizados))
      GestorMensajes._setMensajesOcultos(mensajesOcultosActualizados, function() {
        GestorMensajes._sanearMensajesOcultos(callback)
      })
    }) 

  }


  //callback: function ({mensajesNoOcultos:[Mensaje], mensajesOcultos:[Mensaje]})
  static getMensajes (callback) {

    GestorServidor.getServidor(function(servidor) {

      GestorMensajes._getMensajesOcultos(function (mensajesOcultos) {
        function filtro (currentValue) {
          if (mensajesOcultos.indexOf(currentValue) < 0) {
            return true
          } else {
            return false
          }
        }

        let mensajesNoOcultos = servidor.mensajes?servidor.mensajes.filter(filtro):[]
        callback({mensajesNoOcultos:mensajesNoOcultos, mensajesOcultos:mensajesOcultos})
      })

    })

    
  }
}