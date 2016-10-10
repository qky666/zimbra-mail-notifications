/**
 * Module associated with the extension's popup.
 */
angular.module("zimbraNotificationsBA", [])
  .controller("MailCtrl", function ($scope, $window, $timeout) {

    
    function actualizarDatos() {
      chrome.runtime.getBackgroundPage (function(backgroundPage) {
        backgroundPage.CoordinadorZimbra.getDatos(function(datos){
          actualizarUi(datos)
        })
      })
      
    }
    
    
    function windowToScope() {
      $scope.estado = $scope.window.estado
      $scope.datos = {}
      $scope.datos.hayMensajesOcultos = $scope.window.hayMensajesOcultos
      if ($scope.window.mensajesRaw.length) {
        $scope.datos.mensajes = $scope.window.mensajesRaw.map(i=>new Mensaje(i))  
      } else {
        $scope.datos.mensajes = []
      }   
    }


    // Comprueba si los 'datos' pasados coinciden con los que hay en $scope
    function necesitaRefresco(datos) {
      LogZimbra.log("Popup Defecto. Necesita Refresco. Inicio")
      LogZimbra.log("Popup Defecto. Necesita Refresco. datos=" + JSON.stringify(datos))
      LogZimbra.log("Popup Defecto. Necesita Refresco. $scope.datos=" + JSON.stringify($scope.datos))
      let hayOcultos = datos.mensajesNoLeidos.ocultos.length?true:false
      if (hayOcultos != $scope.datos.hayMensajesOcultos) {
        return true
      }

      let mensScopeIds = $scope.datos.mensajes.map(i=>i.id)
      let mensDatosIds = datos.mensajesNoLeidos.noOcultos.map(j=>j.id)

      let sonIguales = mensScopeIds.length==mensDatosIds.length && mensScopeIds.every((v,i)=> v == mensDatosIds[i])
      
      LogZimbra.log("Popup Defecto. Necesita Refresco. mensScopeIds="+ JSON.stringify(mensScopeIds))
      LogZimbra.log("Popup Defecto. Necesita Refresco. mensDatosIds="+ JSON.stringify(mensDatosIds))
      LogZimbra.log("Popup Defecto. Necesita Refresco. ¿Son iguales? "+ sonIguales)

      return !sonIguales
    }


    function datosToJson(datos, incluirTam = false) {
      let dtj = {}
      dtj.numMensajes = datos.mensajesNoLeidos.noOcultos.length
      dtj.hayMensajesOcultos = datos.mensajesNoLeidos.ocultos.length?true:false

      dtj.mensajesRaw = datos.mensajesNoLeidos.noOcultos.map(i=>i.raw)

      dtj.estado = datos.estado

      if (incluirTam) {
        dtj.innerWidth = $window.innerWidth
        dtj.innerHeight = $window.innerHeight  
      }

      return JSON.stringify(dtj)
    }


    function actualizarUi (datos) {    
      
      //Comprobamos si hay que refrescar por datos
      if (necesitaRefresco(datos)) {
        LogZimbra.log("Popup Defecto. SÍ necesitamos refrescar por datos")
        
        // Código de depuración para evitar problemas de "reload()" infinitos...
        // let c = $window.confirm("¿Recargar?")
        // if (!c) {
        //   return
        // }

        $window.name=datosToJson(datos, false)

        $window.location.reload()
        return
      }

      LogZimbra.log("Popup Defecto. NO necesitamos refrescar")

      let hayOcultos = datos.mensajesNoLeidos.ocultos.length?true:false

    	$scope.estado = datos.estado
    	$scope.datos.mensajes = datos.mensajesNoLeidos.noOcultos
    	$scope.datos.hayMensajesOcultos = hayOcultos
    	$scope.ui.newMailNotificationMessage = chrome.i18n.getMessage(
        "new_mail_notification_message", 
        datos.mensajesNoLeidos.noOcultos.length.toString()
      )
    	$scope.$apply()


    }

		function windowOnLoad () {
    }

    function clickMensaje () {
    	chrome.runtime.getBackgroundPage (function(backgroundPage) {
    		backgroundPage.CoordinadorZimbra.onClickMensaje()
    	})
    }

    function mostrarOcultos () {
    	chrome.runtime.getBackgroundPage (function(backgroundPage) {
				backgroundPage.CoordinadorZimbra.onMostrarOcultos(function () {} )
			})	
    }

    /**
     * Inicializamos el controlador
     */
    function init () {
      LogZimbra.log("Popup Defecto. Init. Inicio")
      
      // Inicializamos los valores dependientes del idioma
      $scope.ui = {}
      $scope.ui.pageTitle = chrome.i18n.getMessage("mail_page_title")
      $scope.ui.noMessage = chrome.i18n.getMessage("mail_no_message")
      $scope.ui.cargandoMessage = chrome.i18n.getMessage("mail_consultando_mensajes")
      $scope.ui.newMailNotificationMessage = null
      $scope.ui.btnShowHidden = chrome.i18n.getMessage("ba_btn_show_hidden")

      // Inicializamos funciones que tienen que ver con la UI
      $scope.ui.clickMensaje = clickMensaje
      $scope.ui.mostrarOcultos = mostrarOcultos

      // Inicializamos variables. 
      // Esto ya no hace falta porque se inicializa a partir de los valores de $scope.window
      // $scope.datos = {}
      // $scope.datos.mensajes = []
      // $scope.datos.hayMensajesOcultos = false
      // $scope.estado = {ok:true}

      // Inicializamos window
      $scope.window = {}
      $scope.window.numMensajes = 0
      $scope.window.mensajesRaw = []
      $scope.window.hayMensajesOcultos = false
      $scope.window.estado = {ok:true}
      $scope.window.esRecarga = false

      //"publicamos" la función para que se la pueda llamar desde el background
      $window.actualizarDatos = actualizarDatos

      // Todo esto sirve para que los datos se carguen de entrada (a partir de lo que hay en $window.name).
      // Si no lo hacemos así, se cargaría a partir de los datos obtenidos del background, en un callback.
      // Establecer los datos en un callback hace que Firefox se líe un poco con el tamaño de la ventana, 
      // así que lo hacemos así.
      if ($window.name) {
        LogZimbra.log("Popup Defecto. Init. Existe window.name="+$window.name)
        $scope.window = JSON.parse($window.name)
        $scope.window.esRecarga = true
      } 
      windowToScope()
      actualizarDatos()

      if (!$scope.window.esRecarga) {
        // Avisamos al background de que hemos cargado la página
        LogZimbra.log("Popup Defecto. Init. Avisamos al background de que hemos cargado la página")
        chrome.runtime.getBackgroundPage (function(backgroundPage) {
          backgroundPage.CoordinadorZimbra.onLoadBrowserAction(function () {})
        })
      }

    }

    init()  // Inicializamos el controlador

  })


