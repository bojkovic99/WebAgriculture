import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { Rasadnik } from '../models/rasadnik';
import { Router } from '@angular/router';
import { MojServisService } from '../moj-servis.service';
import { Korisnik } from '../models/Korisnik';



@Component({
  selector: 'app-poljoprivrednik',
  templateUrl: './poljoprivrednik.component.html',
  styleUrls: ['../promena/promena.component.css'],

})
export class PoljoprivrednikComponent implements OnInit {

  constructor(private router: Router, private service: MojServisService) { }

  r: Observable<Rasadnik[]>;
  rasadnici: Rasadnik[] = [];
  datum: Date = new Date();
  datum2: Date;

  sati: number = 0;
  niz: number[] = [];
  prikaz: number = 1;

  naziv: string = "";
  mesto: string = "";
  duz: number = 0;
  sir: number = 0;
  kor: Korisnik;
  idp: number = 0;
  noviBroj: Observable<number>;
  em: String;




  ngOnInit(): void {

    if (localStorage.getItem('prijavljen') == null) {
      alert("Morate biti prijavljeni kao poljoprivrednik!"); this.router.navigate(['/login']);
    }
    else {

      this.kor = JSON.parse(localStorage.getItem('prijavljen'));
      if (this.kor.Tip != 'k') { alert("Morate biti prijavljeni kao poljoprivrednik!"); this.router.navigate(['/login']); }
      else {
        this.r = this.service.dohvatiRasadnik(this.kor.KorIme);
        this.r.subscribe(data => {
          this.rasadnici = data;
          this.rasadnici.forEach((element, index) => {

            if (element.Voda <= 75 || element.Temperatura <= 12) {
              // var e: Email = { Adresa: this.kor.KorIme, Poruka: 'Vašem rasadniku u mestu Ribnica je potrebno održavanje!' };
              //posalje se poruka email

              this.niz.push(index);


            }

          });


          if (this.rasadnici[0] != null) this.idp = this.rasadnici[0].IdPolj;

        });
      }


    }
  }

  prikazi(ras: Rasadnik) {

    if (localStorage.getItem('rasadnik') == null) {
      localStorage.setItem('rasadnik', JSON.stringify(ras));
    }
    else {
      let r = localStorage.getItem('rasadnik');
      localStorage.setItem('rasadnik', JSON.stringify(ras));

    }

    this.router.navigate(['/rasadnik']);


  }

  dodaj() { this.poruka = " "; this.prikaz = 2; }
  ras() {

    this.prikaz = 1;

    this.poruka = " ";
  }

  poruka: string = " ";
  registruj() {
    //var isoDateString:string=datePickerDate.toISOString();
    // var isoDateString =datePickerDate.toISOString();

    this.poruka = " ";
    var isoDate = new Date();
    var mySQLDateString = isoDate.toJSON().slice(0, 19).replace('T', ' ');
    var mySQLDateStringD = mySQLDateString as unknown as Date;
    var isoDate = new Date();
    let r: Rasadnik = { Id: this.rasadnici.length + 1, Naziv: this.naziv, Mesto: this.mesto, Duzina: this.duz, Sirina: this.sir, Voda: 200, Temperatura: 18, Zasadjeno: 0, IdPolj: this.kor.Id, Datum: mySQLDateStringD };
    let a = this.service.proveraMesto(this.mesto);
    let andj;
    a.subscribe(data => {
      andj = JSON.stringify(data);
      let pomocno = andj.split(":");
      andj = pomocno[1];
      andj = andj.slice(0, andj.length - 1);
      console.log(JSON.stringify(andj));
      if (andj == 0) {
        this.poruka = "Mesto koje ste uneli ne postoji!";
        return;
      }
      else {

        this.noviBroj = this.service.dodajRasadnik(r);
        let br: any;
        this.noviBroj.subscribe(data => {
          br = data;
          console.log(br.insertId);
          r.Id = br.insertId;
        });

        this.rasadnici.push(r);
        this.poruka = "Rasadnik je dodat";


      }
    });

  }



}


