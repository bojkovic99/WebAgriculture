import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MojServisService } from '../moj-servis.service';
import { Rasadnik } from '../models/rasadnik';
import { Observable } from 'rxjs';
import { Magacin } from '../models/magacin';
import { Sadnica } from '../models/Sadnica';
import { Korisnik } from '../models/Korisnik';


@Component({
  selector: 'app-magacin',
  templateUrl: './magacin.component.html',
  styleUrls: ['./magacin.component.css', '../promena/promena.component.css'],

})
export class MagacinComponent implements OnInit {
  @Input('tip') tip: string;
  @Input('broj') broj: number;



  constructor(private router: Router, private service: MojServisService) { this.tip = ' '; this.broj = 0; }
  rasadnik: Rasadnik;
  m: Observable<Magacin[]>;
  proizvodi: Magacin[];
  proizvodi1: Magacin[] = [];
  proizvodi2: Magacin[] = [];
  pom: Magacin[];
  pom2: Magacin[];
  i: number = 0;
  izaberi: string;
  kor: Korisnik;

  ngOnInit(): void {



    if (localStorage.getItem('rasadnik') == null) {
      alert("Morate biti prijavljeni kao poljoprivrednik!"); this.router.navigate(['/login']);
    }
    else {
      this.kor = JSON.parse(localStorage.getItem('prijavljen'));
      this.rasadnik = JSON.parse(localStorage.getItem('rasadnik'));
      this.m = this.service.dohvatiProizvode(this.rasadnik.Id, 1, 1);
      this.m.subscribe(data => {
        this.proizvodi = data;

        this.pom = data;
        this.pom2 = data;

        if (this.tip != null) this.izaberi = this.tip;



      });

    }

  }

  rasa() {
    this.router.navigate(['/prodavnica']);
  }


  sadnica: Sadnica;
  uvecaj(index: number) {

    if (localStorage.getItem('sadnica') == null) { return; }
    this.sadnica = JSON.parse(localStorage.getItem('sadnica'));

    let p = this.proizvodi[index].Napredak;
    this.sadnica.Napredak = this.sadnica.Napredak + p;

    let a = JSON.parse(localStorage.getItem('sadnica'));
    localStorage.setItem('sadnica', JSON.stringify(this.sadnica));
    this.proizvodi[index].KolicinaM = this.proizvodi[index].KolicinaM - 1;
    this.service.azurirajMagacin(this.proizvodi[index]);



  }

  dodaj(index: number) {


    let sad: Sadnica = { Naziv: this.proizvodi[index].Naziv, Presadjivanje: this.proizvodi[index].Presadjivanje, Proizvodjac: this.proizvodi[index].Proizvodjac, Mesto: this.broj, Id: 1, IdRas: this.rasadnik.Id, Napredak: 0, Dostupna: 1 };

    if (localStorage.getItem('sadnica') != null) {
      let t = JSON.parse(localStorage.getItem('sadnica'));

    }
    localStorage.setItem('sadnica', JSON.stringify(sad));
    this.service.dodajSadnicu(sad);
    if (localStorage.getItem('dodato') == null) { localStorage.setItem('dodato', JSON.stringify(this.broj)); }
    else {
      let nebitno = localStorage.getItem('dodato');
      localStorage.setItem('dodato', JSON.stringify(this.broj));
    }
    this.proizvodi[index].KolicinaM = this.proizvodi[index].KolicinaM - 1;
    this.service.azurirajMagacin(this.proizvodi[index]);
  }
  zatvori() {

  }

  classes: string[] = [' ', 'Naziv', 'Proizvodjac', 'Kolicina'];
  selectedClass: string[] = [];
  filt: number = 0;
  trazeno: any = "";
  trazi() {
    let pomocni2: Array<Magacin> = new Array(this.proizvodi.length);
    let pomocni: Array<Magacin> = new Array(this.proizvodi.length);
    pomocni2 = this.pom;




    let b: Magacin[] = [];
    if (this.filt == 1) {
      this.proizvodi = pomocni2.filter(item => { return item.Naziv === this.trazeno })
    }
    if (this.filt == 2) {
      this.proizvodi = pomocni2.filter(item => { return item.Proizvodjac == this.trazeno; })
    }
    if (this.filt == 3) {
      this.proizvodi = pomocni2.filter(item => { return item.KolicinaM == this.trazeno })

    }
    if (this.filt == 0) this.proizvodi = pomocni2;






  }
  filtriranje(event: any) {
    var values = event.target.options;

    var opt: any;
    for (var i = 0, iLen = values.length; i < iLen; i++) {
      opt = values[i];

      if (opt.selected) {
        if (i == 1) this.filt = 1;
        if (i == 2) this.filt = 2;
        if (i == 3) this.filt = 3;
        if (i == 0) { this.proizvodi = this.pom2 }

      }
    }

  }

  sortiraj(event: any) {
    let pomocni2: Magacin[] = this.pom;

    let pomocni: Array<Magacin> = new Array(this.proizvodi.length);



    for (let i = 0; i < this.proizvodi.length; i++) {
      pomocni[i] = {
        Id: this.pom[i].Id,
        IdM: this.pom[i].IdM,
        IdProizvoda: this.pom[i].IdProizvoda,
        IdRas: this.pom[i].IdRas,
        Kolicina: this.pom[i].Kolicina,
        Napredak: this.pom[i].Napredak,
        Naziv: this.pom[i].Naziv,
        Ocena: this.pom[i].Ocena,
        Presadjivanje: this.pom[i].Presadjivanje,
        Pristiglo: this.pom[i].Pristiglo,
        Proizvodjac: this.pom[i].Proizvodjac,
        Tip: this.pom[i].Tip,
        IdNar: this.pom[i].IdNar,
        KolicinaM: this.pom[i].KolicinaM
      };

    }


    var values = event.target.options;

    var opt: any;
    for (var i = 0, iLen = values.length; i < iLen; i++) {
      opt = values[i];

      if (opt.selected) {
        if (i == 0) pomocni == this.pom;
        if (i == 1) pomocni.sort((a, b) => { var n1 = a.Naziv; var n2 = b.Naziv; if (n1 < n2) return -1; });
        if (i == 2) pomocni.sort((a, b) => { if (a.Proizvodjac < b.Proizvodjac) return -1; });
        if (i == 3) pomocni.sort((a, b) => a.KolicinaM - b.KolicinaM);

      }
    }

    for (var j = 0; j < 3; j++) {
      this.classes[j] = this.classes[j];
    }




    this.proizvodi = pomocni;


  }


  otkazii(index: number) {
    let r: number;
    let k = this.service.pretrazi(this.proizvodi[index].Proizvodjac);
    k.then(data => {

      r = data[0].Id;


    });
    this.service.odbaciNarudzbinu(this.proizvodi[index].IdNar, 'o', 25, this.proizvodi[index].Id, this.proizvodi[index].KolicinaM);
    this.proizvodi.splice(index, 1);

  }
  proba(i: number) {
    console.log(i);
  }




}
