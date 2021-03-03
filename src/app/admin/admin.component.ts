import { Component, OnInit } from '@angular/core';
import { MojServisService } from '../moj-servis.service';
import { Observable } from 'rxjs';
import { Korisnik } from '../models/Korisnik';
import { Router } from '@angular/router';
import { Poljoprivrednik } from '../models/Poljoprivrednik';
import { Preduzece } from '../models/Preduzece';
import { element } from 'protractor';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['../promena/promena.component.css']
})
export class AdminComponent implements OnInit {

  constructor(private service: MojServisService, private router: Router) { }

  k2: Observable<Poljoprivrednik[]>;
  niz1: Preduzece[] = [];
  niz3: Korisnik[] = [];
  k: Observable<Preduzece[]>;
  niz2: Poljoprivrednik[] = [];

  pom1: Poljoprivrednik[] = [];
  pom2: Preduzece[] = [];

  ngOnInit(): void {

    if (localStorage.getItem('prijavljen') == null) {
      alert("Morate biti prijavljeni kao admin!"); this.router.navigate(['/login']);
    }
    else {

      let kor = JSON.parse(localStorage.getItem('prijavljen'));
      if (kor.Tip != 'a') { alert("Morate biti prijavljeni kao admin!"); this.router.navigate(['/login']); }
      else {
        this.k = this.service.dohvatiRegP();
        this.k.subscribe(data => {
          this.pom2 = data;
          this.niz1 = [];
          this.pom2.forEach(element => {

            let t: Date = new Date(element.Datum);
            t.setDate(t.getDate() + 1);
            element.Datum = JSON.stringify(t).slice(1, 11) as unknown as Date;
            if (element.Prihvacen == 'y') {

              this.niz1.push(element);
            }

          });
          if (this.niz1 == null) { this.niz1 = [] };

        });


        this.k2 = this.service.dohvatiRegK();
        this.k2.subscribe(data => {

          this.pom1 = data;
          this.niz2 = [];
          this.pom1.forEach(element => {
            if (element.Tip != 'a') {
              let t: Date = new Date(element.DatumRodjenja);
              t.setDate(t.getDate() + 1);


              if (element.Prihvacen == 'y') {
                element.DatumRodjenja = JSON.stringify(t).slice(1, 11) as unknown as Date;
                this.niz2.push(element);
              }
              else { element.DatumRodjenja = JSON.stringify(t).slice(1, 11) as unknown as Date; }

            }

          });
        });
        if (this.niz2 == null) { this.niz2 = [] };


      }
    }

  }


  prist: string = '2';
  pristigli() {
    this.msg = "";
    this.poruka = " ";
    this.prist = '2';


  }
  dodaj() {
    this.msg = "";
    this.poruka = " ";
    this.prist = '3';
  }
  registrujPW() {
    this.msg = "";
    this.poruka = " ";
    this.prist = '4';
  }
  registrujKW() {
    this.msg = "";
    this.poruka = " ";
    this.prist = '5';
  }
  kor: Korisnik;


  prihvati(index1: number, tip: number) {



    if (tip == 1) {
      this.pom2.forEach((element, index) => {
        if (index == index1) {
          element.Prihvacen = 'y';
          this.niz1.push(element);


          var isoDate = element.Datum;
          var mySQLDateString = JSON.stringify(isoDate).slice(1, 20).replace('T', ' ');
          var mySQLDateStringD = mySQLDateString as unknown as Date;
          element.Datum = mySQLDateStringD;

          let kor: Preduzece = { Id: element.Id, KorIme: element.KorIme, PunoIme: element.PunoIme, Lozinka: element.Lozinka, Datum: element.Datum, Mesto: element.Mesto, Tip: element.Tip, Email: element.Email, Prihvacen: element.Prihvacen };
          this.service.azurirajPreduzeceN(kor);
          this.service.setRegistracijapDijagram(element.KorIme);
          this.pom2.splice(index, 1);




        }
      });
    }
    else {
      this.pom1.forEach((element, index) => {
        if (index == index1) {

          element.Prihvacen = 'y';
          this.niz2.push(element);
          var isoDate = element.DatumRodjenja;
          var mySQLDateString = JSON.stringify(isoDate).slice(1, 20).replace('T', ' ');


          var mySQLDateStringD = mySQLDateString as unknown as Date;
          element.DatumRodjenja = mySQLDateStringD;


          this.service.azurirajPoljoprivrednikaN(element);
          this.pom1.splice(index, 1);
        }
      });
    }



  }

  odbaci1(kori: Preduzece, tip: number) {


    this.niz1.forEach((element, index) => {
      if (element == kori) {
        this.niz1.splice(index, 1);
      }
    });

    this.pom2.forEach((element, index) => {
      if (element == kori) {
        this.pom2.splice(index, 1);
      }
    });

    this.service.obrisiPreduzece(kori.KorIme);



  }
  odbaci2(kori: Poljoprivrednik, tip: number) {






    this.niz2.forEach((element, index) => {
      if (element == kori) {
        this.niz2.splice(index, 1);
      }
    });

    this.pom1.forEach((element, index) => {
      if (element == kori) {
        this.pom1.splice(index, 1);
      }

    });
    this.service.obrisiPoljoprivrednika(kori.KorIme);


  }


  Po1: Poljoprivrednik;

  azuriraj1(pr: Preduzece) {
    var isoDate = pr.Datum;
    var mySQLDateString = JSON.stringify(isoDate).slice(1, 20).replace('T', ' ');
    var mySQLDateStringD = mySQLDateString as unknown as Date;
    pr.Datum = mySQLDateStringD;
    this.service.azurirajPreduzeceN(pr);

    var isoDate = pr.Datum;
    var mySQLDateString = JSON.stringify(isoDate).slice(1, 11).replace('T', ' ');
    var mySQLDateStringD = mySQLDateString as unknown as Date;
    pr.Datum = mySQLDateStringD;

    alert("Uspesno ažurirano!");

  }
  azuriraj2(pr: Poljoprivrednik) {
    var isoDate = pr.DatumRodjenja;
    var mySQLDateString = JSON.stringify(isoDate).slice(1, 20).replace('T', ' ');
    var mySQLDateStringD = mySQLDateString as unknown as Date;
    pr.DatumRodjenja = mySQLDateStringD;
    this.service.azurirajPoljoprivrednikaN(pr);
    var isoDate = pr.DatumRodjenja;
    var mySQLDateString = JSON.stringify(isoDate).slice(1, 11).replace('T', ' ');
    var mySQLDateStringD = mySQLDateString as unknown as Date;
    pr.DatumRodjenja = mySQLDateStringD;

    alert("Uspesno ažurirano!");
  }


  tip: string;

  kime: string;
  kprezime: string;
  kusername: string;
  ksifra1: string;

  kmesto: string;
  kdatum: Date;
  ktelefon: string;
  kmail: string;

  ppunoime: string;
  pusername: string;
  psifra1: string;

  pmail: string;
  pdatum: Date;
  pmesto: string;
  msg: string = " ";

  poruka: string;

  niz: string[] = [];



  registracija: boolean;
  ko: Promise<Korisnik>;
  kori: Korisnik;

  registrujP() {
    let pr: Preduzece = { Id: this.niz1.length + 1, PunoIme: this.ppunoime, KorIme: this.pusername, Lozinka: this.psifra1, Mesto: this.pmesto, Email: this.pmail, Tip: 'p', Prihvacen: 'y', Datum: this.pdatum };
    if (this.ppunoime == null || this.pusername == null || this.pdatum == null || this.pmail == null || this.pmesto == null || this.psifra1 == null) {
      this.msg = "Niste uneli sva polja!";
      return;
    }
    let provera = /^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{7,}$/;
    let peta = /^[A-Z]/;
    //  let em = /^(\w+)@(\w+)(\.\w{2,3})+$/;
    let em = /^(.+)@(\w+)(\.\w{2,3})+$/;
    if (!(provera.test(this.psifra1) && peta.test(this.psifra1))) {
      this.msg = "Lozinka nije u dobrom formatu!";
      return;
    }
    else if (!(em.test(this.pmail))) {
      this.msg = "Nije dobar email!";
      return;
    }
    else {

      this.ko = this.service.pretrazi(this.pusername);
      this.ko.then(data => {
        this.kor = data;
        if (JSON.stringify(this.kor) != "[]") {
          this.msg = "Već postoji korisnik sa datim korisničkim imenom!";

        }
        else {

          let pr: Preduzece = { Id: 1, PunoIme: this.ppunoime, KorIme: this.pusername, Lozinka: this.psifra1, Datum: this.pdatum, Mesto: this.pmesto, Email: this.pmail, Tip: 'p', Prihvacen: 'y' }
          this.service.regP(pr);
          this.service.setRegistracijapDijagram(this.pusername);
          this.tip = 'm';
          this.poruka = "Preduzeće je dodato!";
          this.niz1.push(pr);
          this.msg = "";
        }
      });


    }


  }
  registrujK() {

    this.msg = "";
    this.poruka = "";

    if (this.kime == null || this.kprezime == null || this.kdatum == null || this.kmail == null || this.kmesto == null || this.ksifra1 == null || this.ktelefon == null || this.kusername == null) {
      this.msg = "Niste uneli sva polja!";
    }
    let provera = /^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{7,}$/;
    let peta = /^[A-Z]/;
    //  let em = /^(\w+)@(\w+)(\.\w{2,3})+$/;
    let em = /^(.+)@(\w+)(\.\w{2,3})+$/;
    if (!(provera.test(this.ksifra1) && peta.test(this.ksifra1))) {
      this.msg = "Lozinka nije u dobrom formatu!";
      return;
    }
    else if (!(em.test(this.kmail))) {
      this.msg = "Nije dobar email!";
      return;
    }
    else {
      this.ko = this.service.pretrazi(this.kusername);
      this.ko.then(data => {
        this.kori = data;
        if (JSON.stringify(this.kori) != "[]") {
          this.msg = "Već postoji korisnik sa datim korisničkim imenom!";
          return;
        }
        else {

          let p: Poljoprivrednik = { Tip: 'k', Id: 1, KorIme: this.kusername, Lozinka: this.ksifra1, Prezime: this.kprezime, DatumRodjenja: this.kdatum, MestoRodjenja: this.kmesto, Ime: this.kime, Telefon: this.ktelefon, Email: this.kmail, Prihvacen: 'y' };
          this.niz2.push(p);
          this.service.regK(p); this.tip = 'm';
          this.poruka = "Poljoprivrednik je dodat!";
          this.msg = "";

        }
      });




    }
  }









}
