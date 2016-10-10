class ZimbraNavegador {
	constructor () {
		return null
	}

	// callback: function (tabs) {...}
	static _tabsConZimbraAbierto (callback) {

		GestorServidor.getServidor(function(servidor){

			if(servidor.urlError) {
				callback([])
				return
			}

			let url = servidor.urlAsURL

		  chrome.tabs.query( 
							          {
							           status:"complete", 
							           url:"*://"+url.host+"/*"
							          }, function (tabs) {
							          	callback (tabs)
							            return
							          } 
			)

		})
	}


	static abrirOActivarZimbra () {

		GestorServidor.getServidor(function(servidor){

			if (servidor.urlError) {
				return
			}
			let url = servidor.urlAsURL
		 	ZimbraNavegador._tabsConZimbraAbierto (function (tabs) {
		 		if (tabs.length) {
		 			chrome.windows.update(tabs[0].windowId, { focused: true })
		      chrome.tabs.update(tabs[0].id, { active: true })
		 		} else if (url) {
		 			chrome.tabs.create({ active: true, url: url.toString() })
		 		} else {
		 			return
		 		}
		 	})
		})
	}

	/**
	 * Comprueba si Zimbra está activo ahora (o sea, está abierto y el usuario lo está "viendo")
	 * @param callback: function (boolean activo). Función callback 
	 */
	static zimbraActivo (callback) {
		GestorServidor.getServidor(function(servidor){

			if(servidor.urlError) {
				callback(false)
				return
			}
			
			let url = servidor.urlAsURL
			  
		  chrome.windows.getLastFocused({populate:true},function (win) {
		        
		    // Si la ventana no está "focused", consideramos que la ventana del navegador no está activa
		    if (win.focused == false) {
		      callback(false)
		      return
		    }

		    // Si aún hay opciones de que Zimbra esté activo, 
		    // miramos el estado de la ventana. Si no está en la lista, consideramos que Zimbra no está activo
		    let estadosValidos = ["normal", "maximized", "fullscreen"]
		    if (estadosValidos.indexOf(win.state) < 0) {
		      callback(false)
		      return
		    }
		    
		    chrome.tabs.query( 
		      {active:true, 
		       highlighted:true, 
		       lastFocusedWindow:true, 
		       status:"complete", url:"*://"+url.host+"/*"
		      }, function (tabs) {
		        if (tabs.length) {
		          callback(true)
		          return
		        } else {
		          callback(false)
		          return
		        }
		      } 
		    )
		  
		  })

		})
	}

}