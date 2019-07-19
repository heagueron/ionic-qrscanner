import { Component } from '@angular/core';
import { DataLocalService } from '../../services/data-local.service';
import { Registro } from '../../models/registro.model';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  constructor( public dataLocal: DataLocalService) {}
  // public allows to use it outside the class. in this case,
  // from the html.

  enviarCorreo() {

    // console.log('send mail');
    this.dataLocal.enviarCorreo();

  }

  abrirRegistro( registro: Registro ) {
    console.log('registro', registro);
    this.dataLocal.abrirRegistro( registro );
  }

}
