import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { Registro } from '../models/registro.model';
import { NavController } from '@ionic/angular';

import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

import { File } from '@ionic-native/file/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';


@Injectable({
  providedIn: 'root'
})
export class DataLocalService {

  guardados: Registro[] = [];

  constructor(private storage: Storage,
              private navCtrl: NavController,
              private iab: InAppBrowser,
              private file: File,
              private emailComposer: EmailComposer ) {
    this.cargarStorage();
  }

  async cargarStorage() {
    this.guardados = await this.storage.get('registros') || [];
  }

  async guardarRegistro( format: string, text: string ) {

    await this.cargarStorage();

    const nuevoRegistro = new Registro( format, text );
    this.guardados.unshift( nuevoRegistro );

    this.storage.set('registros', this.guardados );

    // Commenting this will prevent open on scan ...
    this.abrirRegistro( nuevoRegistro );

  }

  abrirRegistro( registro: Registro ) {

    this.navCtrl.navigateForward('/tabs/tab2');

    switch ( registro.type ) {

      case 'http':
        this.iab.create(registro.text, '_system');
        break;
      
      case 'geo':
        this.navCtrl.navigateForward(`/tabs/tab2/mapa/${registro.text}`);
        break;
      
      default:

    }

  }

  enviarCorreo() {

    const arrTemp = [];
    const titulos = 'Tipo, Formato, Creado en, texto\n';

    arrTemp.push( titulos );

    this.guardados.forEach( registro => {

      const linea = `${ registro.type }, ${ registro.format }, ${ registro.created }, ${ registro.text.replace(',', ' ') }\n`;

      arrTemp.push( linea );

    });

    this.crearArchivoFisico( arrTemp.join('') ); // unir todos to get one string.

  }

  crearArchivoFisico( text: string ) {

    this.file.checkFile( this.file.dataDirectory, 'registros.csv')
      .then( existe => {
        console.log('File exists?', existe );
        return this.escribirEnArchivo( text );
      })
      .catch( err => {
        return this.file.createFile( this.file.dataDirectory, 'registros.csv', false )
          .then ( creado => this.escribirEnArchivo( text ))
          .catch( err2 => console.log('Can not create the file'));
      });

  }

  async escribirEnArchivo( text: string ) {

    await this.file.writeExistingFile( this.file.dataDirectory, 'registros.csv', text );
    console.log('File created');
    // console.log(this.file.dataDirectory + 'registros.csv');

    const scansFile = `${this.file.dataDirectory}/registros.csv`;
    console.log( 'scansFile', scansFile );
    
    const email = {
      to: 'heagueron@gmail.com',
      // cc: 'erika@mustermann.de',
      // bcc: ['john@doe.com', 'jane@doe.com'],
      attachments: [
        scansFile
      ],
      subject: 'Scans',
      body: 'How are you? Nice greetings from <strong>Maracaibo</strong>',
      isHtml: true
    };

    // Send a text message using default options
    this.emailComposer.open(email);

  }


}
