//lib/PopupApp.jsx

import React from 'react'
import ResumenEstado from './ResumenEstado.jsx'
import MensajesNoLeidosVisibles from './MensajesNoLeidosVisibles.jsx'
import Botones from './Botones.jsx'

export default () => (
	<div>
		<ResumenEstado />
		<MensajesNoLeidosVisibles />
		<Botones />
	</div>
)