!function(e){function o(a){if(n[a])return n[a].exports;var s=n[a]={exports:{},id:a,loaded:!1};return e[a].call(s.exports,s,s.exports,o),s.loaded=!0,s.exports}var n={};return o.m=e,o.c=n,o.p="",o(0)}([function(e,o){"use strict";angular.module("zimbraNotificationsBA",[]).controller("MailCtrl",function(e,o,n){function a(){chrome.runtime.getBackgroundPage(function(e){e.CoordinadorZimbra.getDatos(function(e){r(e)})})}function s(){e.estado=e.window.estado,e.datos={},e.datos.hayMensajesOcultos=e.window.hayMensajesOcultos,e.window.mensajesRaw.length?e.datos.mensajes=e.window.mensajesRaw.map(function(e){return new Mensaje(e)}):e.datos.mensajes=[]}function i(o){LogZimbra.log("Popup Defecto. Necesita Refresco. Inicio"),LogZimbra.log("Popup Defecto. Necesita Refresco. datos="+JSON.stringify(o)),LogZimbra.log("Popup Defecto. Necesita Refresco. $scope.datos="+JSON.stringify(e.datos));var n=!!o.mensajesNoLeidos.ocultos.length;if(n!=e.datos.hayMensajesOcultos)return!0;var a=e.datos.mensajes.map(function(e){return e.id}),s=o.mensajesNoLeidos.noOcultos.map(function(e){return e.id}),i=a.length==s.length&&a.every(function(e,o){return e==s[o]});return LogZimbra.log("Popup Defecto. Necesita Refresco. mensScopeIds="+JSON.stringify(a)),LogZimbra.log("Popup Defecto. Necesita Refresco. mensDatosIds="+JSON.stringify(s)),LogZimbra.log("Popup Defecto. Necesita Refresco. ¿Son iguales? "+i),!i}function t(e){var n=arguments.length>1&&void 0!==arguments[1]&&arguments[1],a={};return a.numMensajes=e.mensajesNoLeidos.noOcultos.length,a.hayMensajesOcultos=!!e.mensajesNoLeidos.ocultos.length,a.mensajesRaw=e.mensajesNoLeidos.noOcultos.map(function(e){return e.raw}),a.estado=e.estado,n&&(a.innerWidth=o.innerWidth,a.innerHeight=o.innerHeight),JSON.stringify(a)}function r(n){if(i(n))return LogZimbra.log("Popup Defecto. SÍ necesitamos refrescar por datos"),o.name=t(n,!1),void o.location.reload();LogZimbra.log("Popup Defecto. NO necesitamos refrescar");var a=!!n.mensajesNoLeidos.ocultos.length;e.estado=n.estado,e.datos.mensajes=n.mensajesNoLeidos.noOcultos,e.datos.hayMensajesOcultos=a,e.ui.newMailNotificationMessage=chrome.i18n.getMessage("new_mail_notification_message",n.mensajesNoLeidos.noOcultos.length.toString()),e.$apply()}function c(){chrome.runtime.getBackgroundPage(function(e){e.CoordinadorZimbra.onClickMensaje()})}function u(){chrome.runtime.getBackgroundPage(function(e){e.CoordinadorZimbra.onMostrarOcultos(function(){})})}function g(){LogZimbra.log("Popup Defecto. Init. Inicio"),e.ui={},e.ui.pageTitle=chrome.i18n.getMessage("mail_page_title"),e.ui.noMessage=chrome.i18n.getMessage("mail_no_message"),e.ui.cargandoMessage=chrome.i18n.getMessage("mail_consultando_mensajes"),e.ui.newMailNotificationMessage=null,e.ui.btnShowHidden=chrome.i18n.getMessage("ba_btn_show_hidden"),e.ui.clickMensaje=c,e.ui.mostrarOcultos=u,e.window={},e.window.numMensajes=0,e.window.mensajesRaw=[],e.window.hayMensajesOcultos=!1,e.window.estado={ok:!0},e.window.esRecarga=!1,o.actualizarDatos=a,o.name&&(LogZimbra.log("Popup Defecto. Init. Existe window.name="+o.name),e.window=JSON.parse(o.name),e.window.esRecarga=!0),s(),a(),e.window.esRecarga||(LogZimbra.log("Popup Defecto. Init. Avisamos al background de que hemos cargado la página"),chrome.runtime.getBackgroundPage(function(e){e.CoordinadorZimbra.onLoadBrowserAction(function(){})}))}g()})}]);