/*
 * Script que corre en el background
 */

import CoordinadorZimbra from './lib/CoordinadorZimbra.js'

//Arrancamos
CoordinadorZimbra.configurarListeners()
//CoordinadorZimbra.actualizarMensajes({notificacion:false}, function () {} )