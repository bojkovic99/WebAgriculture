import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MojServisService } from '../moj-servis.service';
import { Rasadnik } from '../models/rasadnik';
import { Sadnica } from '../models/Sadnica';
import { Observable } from 'rxjs';
import { Pom } from '../models/Pom';
export interface Email {
  Adresa: number;
  Poruka: string;

}

@Component({
  selector: 'app-rasadnik',
  templateUrl: './rasadnik.component.html',
  styleUrls: ['./rasadnik.component.css', '../promena/promena.component.css']
})
export class RasadnikComponent implements OnInit {

  constructor(private router: Router, private service: MojServisService) { }

  rasadnik: Rasadnik;
  sadnice: Sadnica[] = [];
  s: Observable<Sadnica[]>;
  duzina: number[] = [];
  nalazise: number[] = [];
  sirina: number[] = [];
  prikaz: boolean = false;
  sadnica: Sadnica = { Naziv: '', Id: 0, IdRas: 0, Presadjivanje: 0, Mesto: 0, Napredak: 0, Proizvodjac: "", Dostupna: 1 };
  progres: number = 0;
  prikazi: boolean;
  p: Pom[] = [];
  magacini: boolean = false;
  id: number;
  otvaranje: string;
  prikazivanje: number = 1;
  magacini2: boolean = false;
  zaprikazivanje: number = 0;


  si: number;
  d: number;

  ngOnInit(): void {
    if (localStorage.getItem('rasadnik') == null) {
      alert("Morate biti prijavljeni kao poljoprivrednik!"); this.router.navigate(['/login']);
    }
    else {
      console.log('usap');

      this.rasadnik = JSON.parse(localStorage.getItem('rasadnik'));
      this.s = this.service.dohvatiSadnicu(this.rasadnik.Id);
      this.s.subscribe(data => {
        this.sadnice = data;
        console.log(this.sadnice);
        if (this.sadnice == null) { this.sadnice = []; }
        this.si = this.rasadnik.Sirina;
        this.d = this.rasadnik.Duzina;
        for (let i = 0; i < this.rasadnik.Sirina; i++) {
          this.sirina[i] = i;
          for (let j = 0; j < this.rasadnik.Duzina; j++) { this.nalazise[j * this.si + i] = 0; }
        }

        for (let j = 0; j < this.rasadnik.Duzina; j++) { this.duzina[j] = j; }


        this.sadnice.forEach(element => {
          if (element.Napredak >= element.Presadjivanje) this.nalazise[element.Mesto] = 2;
          if (element.Napredak < element.Presadjivanje) this.nalazise[element.Mesto] = 1;
          if (element.Dostupna == 2) {
            console.log('element ' + element.Dostupna + " " + element.Mesto + " " + element.Id);
            this.nalazise[element.Mesto] = 3;
          }

        });
        /* 86400000 */
        console.log(this.rasadnik.Temperatura);
        if (this.rasadnik.Voda <= 75 || this.rasadnik.Temperatura <= 12) {
          this.zaprikazivanje = 1;
        }
        else {
          this.zaprikazivanje = 0;
        }


      });

    }
  }

  myFunc(arg) {
    console.log(`arg was => ${arg}`);
  }



  vratise() {
    var isoDate = new Date();
    var mySQLDateString = isoDate.toJSON().slice(0, 19).replace('T', ' ');
    var mySQLDateStringD = mySQLDateString as unknown as Date;
    this.rasadnik.Datum = mySQLDateStringD;
    this.service.azurirajRasadnik(this.rasadnik);
    this.router.navigate(['/poljoprivrednik']);

  }

  avodap() {
    this.rasadnik.Voda = this.rasadnik.Voda + 1;
    if (this.rasadnik.Voda > 75 && this.rasadnik.Temperatura > 12) {
      this.zaprikazivanje = 0;
    }
    this.service.azurirajRasadnik(this.rasadnik);


  }
  avodas() {
    this.rasadnik.Voda = this.rasadnik.Voda - 1;
    if (this.rasadnik.Voda <= 75) {
      var e: Email = { Adresa: this.rasadnik.IdPolj, Poruka: "Vašem rasadniku u mestu" + this.rasadnik.Mesto + "je potrebno održavanje!" };
      this.service.sendmail(e);
      this.zaprikazivanje = 1;
    }
    this.service.azurirajRasadnik(this.rasadnik);

  }
  atempp() {
    this.rasadnik.Temperatura = this.rasadnik.Temperatura + 1;
    if (this.rasadnik.Voda > 75 && this.rasadnik.Temperatura > 12) {
      this.zaprikazivanje = 0;
    }
    this.service.azurirajRasadnik(this.rasadnik);

  }
  atemps() {
    this.rasadnik.Temperatura = this.rasadnik.Temperatura - 1;
    if (this.rasadnik.Temperatura <= 12) {
      var e: Email = { Adresa: this.rasadnik.IdPolj, Poruka: "Vašem rasadniku u mestu" + this.rasadnik.Mesto + "je potrebno održavanje!" };
      this.service.sendmail(e);
      this.zaprikazivanje = 1;
    }
    this.service.azurirajRasadnik(this.rasadnik);

  }

  showModal: boolean = false;
  presad: boolean = false;
  presad2: boolean = false;

  onClick(event) {

    this.showModal = true;


    console.log(event.target.id);

    this.id = event.target.id;


    this.sadnice.forEach(element => {
      if (element.Mesto == this.id) {
        this.sadnica = element;
        this.progres = this.sadnica.Napredak / this.sadnica.Presadjivanje * 100;
        return;
      }

    });
    if (this.sadnica == null) this.sadnica = this.sadnice[0];
  }

  dodajNovu(event) {
    this.prikazi = true;
    this.id = event.target.id;
    console.log("Ovo je mesto gde ce da se doda" + event.target.id);
  }
  presad3(event) {
    this.presad = true;
    this.id = event.target.id;
    console.log(this.id + " presadjivanje");

  }
  presad4(event) {
    this.presad2 = true;
    this.id = event.target.id;

  }

  hide() {
    this.showModal = false;
    this.prikazi = false;
    this.presad = false;
    this.presad2 = false;
    this.magacini = false;
    this.magacini2 = false;
  }

  presadiSadnicu(broj: number) {
    let d = new Date();


    this.sadnice.forEach(element => {
      if (element.Mesto == broj) {

        element.Dostupna = 2;


        this.service.azurirajSadnicu(element);
        this.nalazise[broj] = 3;
        this.rasadnik.Zasadjeno = this.rasadnik.Zasadjeno - 1;
        this.service.azurirajRasadnik(this.rasadnik);



        let a = this.service.sacekajDan(element.IdRas, element.Mesto, 86400);
        a.subscribe(data => {
          this.nalazise[broj] = 0;
        })

      }

    });
    console.log('izasao');



  }


  skokMagacin() {
    this.otvaranje = 'p';
    this.magacini = true;
    this.prikazivanje = 4;


  }

  mag() {

    this.prikazivanje = 4;
    this.otvaranje = 's';

    let s: Sadnica;
    this.sadnice.forEach(element => {
      if (element.Mesto == this.id) { s = element; }
    });
    if (s == null) { return; }

    if (localStorage.getItem('sadnica') == null) {
      localStorage.setItem('sadnica', JSON.stringify(s));
    }
    else {
      let sa = JSON.parse(localStorage.getItem('sadnica'));
      localStorage.setItem('sadnica', JSON.stringify(s));
    }
    this.magacini = true;
  }

  zatvori() {
    this.prikazivanje = 1;
    this.showModal = false;
    this.prikazi = false;
    this.presad = false;
    this.presad2 = false;
    this.magacini = false;
    this.magacini2 = false;
    if (this.otvaranje == 's') {

      if (localStorage.getItem('sadnica') != null) {
        let a: Sadnica = JSON.parse(localStorage.getItem('sadnica'));

        this.sadnice.forEach(element => {
          console.log(this.id + "id na kraju zatvori");
          if (element.Mesto == this.id) {
            element.Napredak = a.Napredak;
            if (element.Napredak >= element.Presadjivanje) {
              this.nalazise[element.Mesto] = 2;
            } else this.nalazise[element.Mesto] = 1;
          }
        });

        this.service.azurirajSadnicu(a);


        localStorage.removeItem('sadnica');
      }
    }
    if (this.otvaranje == 'p') {
      if (localStorage.getItem != null && localStorage.getItem('dodato') != null) {
        this.rasadnik.Zasadjeno = this.rasadnik.Zasadjeno + 1;

        let a = JSON.parse(localStorage.getItem('dodato'));
        let b = JSON.parse(localStorage.getItem('sadnica'));
        this.nalazise[a] = 1;
        this.sadnice.push(b);

        localStorage.removeItem('sadnica');
        localStorage.removeItem('dodato');
      }
      console.log(this.id + "id na kraju zatvori");

    }
  }

  skokProdavnica() {
    this.router.navigate(['/prodavnica']);
  }


}

