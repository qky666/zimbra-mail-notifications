//lib/ResumenEstado.jsx
import React from 'react'
import { Alert } from 'react-bootstrap'

export default ({error,numMensajes}) => (
	<div className="row">
		<div class="col-md-12 col-xs-12">
			<Alert bsStyle="info">
    		Tienes <strong>5</strong> mensajes sin leer (por ejemplo)
  		</Alert>
			
		</div>
	</div>
)