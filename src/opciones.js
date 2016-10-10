/**
 * Módulo asociado a la página de opciones (options.html) de la extensión
 */
angular.module("zimbraNotificationsOptions", [])
  .controller("OptionsCtrl", function ($scope, $timeout, $window) {

  	function limpiarStatus () {
  		$scope.status = ""
			$scope.statusURL = ""
			$scope.estilo.colorStatusUrl = {}
  	} 

    /**
     * Graba los valores actuales de las opciones en el almacenamiento de Chrome
     */
    $scope.guardarOpciones = function () {

    	$scope.deshabilitarBotones = true
    	let strToURL = UtilesURL.stringToURL($scope.opciones.urlZimbra)
  		if (strToURL.hasOwnProperty('error')) {
  			LogZimbra.log("¡URL no válida!")
  			$scope.statusURL = chrome.i18n.getMessage("options_invalid_url")
  			$scope.estilo.colorStatusUrl = {color:'red'}
  			$scope.deshabilitarBotones = false
  			$scope.$apply()
       	return
  		} else {
  			LogZimbra.log("URL correcta. Voy a establecer opciones. $scope.opciones="+JSON.stringify($scope.opciones))
        OpcionesStorage.setOpciones($scope.opciones, function () {
  				LogZimbra.log("callback URL correcta")
			  	$scope.status = chrome.i18n.getMessage("options_saved")
					$scope.statusURL = chrome.i18n.getMessage("options_saved")
					$scope.estilo.colorStatusUrl = {}
					$scope.deshabilitarBotones = false
          $scope.$apply()
          $timeout(
          	function() {
              limpiarStatus()
              // $scope.$apply()
          	}, 
          	2000
         	)
         	//$scope.restablecerOpciones({limpiarStatus:false})
    		})
  		}

    }

    /**
     * Restablece los valores de las opciones a partir de las guardadas anteriormente en el almacenamiento de Chrome
     */
    $scope.restablecerOpciones = function () {
    	LogZimbra.log("Restablecer Opciones. Inicio")
    	$scope.deshabilitarBotones = true

    	// if (params && params.limpiarStatus) {
    	// 	limpiarStatus()	
    	// }

			
			OpcionesStorage.getOpciones(function(opciones) {
				LogZimbra.log("Restablecer Opciones. Callback. Opciones recibidas: " + JSON.stringify(opciones))
	  		$scope.opciones = opciones
	  		$scope.deshabilitarBotones = false
      	$scope.$apply()
			})
			    	
    }


    $scope.urlZimbraModificado = function () {
    	if($scope.statusURL != "") {
    		$scope.statusURL = ""
    		$scope.estilo.colorStatusUrl = {}
    	}
    }

    $scope.navegadorEsFirefox = function () {
      return UtilesFirefox.navegadorEsFirefox()
    }

    /**
     * Código de inicialización para este controlador
     */
    function init () {
      // Inicializamos los valores dependientes del idioma
      $scope.ui = {}
      $scope.ui.pageTitle = chrome.i18n.getMessage("options_page_title")
      $scope.ui.labelInterval = chrome.i18n.getMessage("options_label_interval")
      $scope.ui.labelServerURL = chrome.i18n.getMessage("options_label_server_URL")
      $scope.ui.labelShowNotifications = chrome.i18n.getMessage("options_label_show_notifications")
      $scope.ui.labelPermanentNotifications = chrome.i18n.getMessage("options_label_permanent_notifications")
      $scope.ui.btnSave = chrome.i18n.getMessage("options_btn_save")
      $scope.ui.btnCancel = chrome.i18n.getMessage("options_btn_cancel")
      $scope.ui.btnPorDefecto = chrome.i18n.getMessage("options_btn_por_defecto")

      $scope.estilo = {}
      $scope.estilo.colorStatusUrl = {}

      $scope.deshabilitarBotones = false

      // Cargamos los valores guardados anteriormente en el almacenamiento de Chrome
      $scope.restablecerOpciones()
    }

    init()  //Inicializamos el controlador.
      
  })