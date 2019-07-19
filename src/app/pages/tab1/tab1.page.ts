import { Component } from '@angular/core';

import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { DataLocalService } from '../../services/data-local.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  slideOptions = {
    allowSlidePrev: false,
    allowSlideNext: false
  };

  constructor( private barcodeScanner: BarcodeScanner,
    private dataLocal: DataLocalService  ) {}

  ionViewWillEnter() {
    //console.log('ionViewWillEnter');
  }

  ionViewDidEnter() {
    //console.log('ionViewDidEnter');
  }

  ionViewWillLeave() {
    //console.log('ionViewWillLeave');
  }

  ionViewDidLeave() {
    //console.log('ionViewDidLeave');
  }

  scan() {
    //console.log('scan something ... ');

    this.barcodeScanner.scan().then(barcodeData => {
        console.log('Barcode data', barcodeData);

        if ( !barcodeData.cancelled ) {
          this.dataLocal.guardarRegistro( barcodeData.format, barcodeData.text );
        }

      }).catch(err => {
          console.log('Error', err);
      });


  }



}
