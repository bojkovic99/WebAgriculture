import { Component, OnInit } from '@angular/core';
import { MojServisService } from '../moj-servis.service';
import { Observable } from 'rxjs';
import { Korisnik } from '../models/Korisnik';
import { Router } from '@angular/router';
import { Poljoprivrednik } from '../models/Poljoprivrednik';
import { Preduzece } from '../models/Preduzece';

@Component({
  selector: 'app-registracija',
  templateUrl: './registracija.component.html',
  styleUrls: ['../promena/promena.component.css']
})
export class RegistracijaComponent implements OnInit {

  constructor(private service: MojServisService, private router: Router) { }

  ngOnInit(): void {
  }

  tip: string = 'p';

  kime: string;
  kprezime: string;
  kusername: string;
  ksifra1: string;
  ksifra2: string;
  kmesto: string;
  kdatum: Date;
  ktelefon: string;
  kmail: string;

  ppunoime: string;
  pusername: string;
  psifra1: string;
  psifra2: string;
  pmail: string;
  pdatum: Date;
  pmesto: string;
  msg: string = " ";

  poruka: string;

  k: any;
  niz: string[] = [];



  registracija: boolean;
  ko: Promise<Korisnik>;
  kor: Korisnik;
  pred() {
    this.tip = 'p';
    this.msg = " ";
    this.poruka = "";

  }
  polj() {
    this.tip = 'k';

    this.msg = " ";
    this.poruka = "";
  }

  odjavi() {
    this.kor = null;

    localStorage.setItem('prijavljen', null);
    localStorage.clear();
    localStorage.removeItem('prijavljen');
    this.router.navigate(['/login']);
  }


  async resolved(captchaResponse: string) {
    console.log(`Resolved response token: ${captchaResponse}`);
    await this.sendTokenToBackend(captchaResponse);
  }


  uspesno: boolean = false;
  sendTokenToBackend(tok) {

    this.service.sendToken(tok).subscribe(
      data => {

        console.log(data.success);
        this.uspesno = data.success;
      },
      err => {
        console.log(err)
      },
      () => { }
    );
  }


  registruj() {
    this.msg = "";
    this.poruka = "";
    if (this.tip == 'k') {
      if (this.kime == null || this.uspesno == false || this.kprezime == null || this.kdatum == null || this.kmail == null || this.kmesto == null || this.ksifra1 == null || this.ksifra2 == null || this.ktelefon == null || this.kusername == null) {
        this.msg = "Niste uneli sva polja!";
      }
      else {



        let provera = /^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{7,}$/;

        let peta = /^[A-Z]/;
        let em = /^(.+)@(\w+)(\.\w{2,3})+$/;


        if (!(provera.test(this.ksifra1) && peta.test(this.ksifra1))) {
          this.msg = "Lozinka nije u dobrom formatu!";
          return;
        }
        if (!(em.test(this.kmail))) {
          this.msg = "Nije dobar email!";
          return;
        }

        else {
          if (this.ksifra1 != this.ksifra2) {
            this.msg = "Lozinke se ne poklapaju!";
            return;
          }
          else {
            let a = this.service.proveraMesto(this.kmesto);
            let andj;
            a.subscribe(data => {
              andj = JSON.stringify(data);
              let pomocno = andj.split(":");
              andj = pomocno[1];
              andj = andj.slice(0, andj.length - 1);
              console.log(JSON.stringify(andj));
              if (andj == 0) {
                this.msg = "Mesto koje ste uneli ne postoji!";
              }
              else {
                this.ko = this.service.pretrazi(this.kusername);
                this.ko.then(data => {
                  this.kor = data;
                  if (JSON.stringify(this.kor) != "[]") {
                    this.msg = "Već postoji korisnik sa datim korisničkim imenom!";
                    return;
                  }
                  else {
                    let p: Poljoprivrednik = { Tip: 'k', Id: 1, KorIme: this.kusername, Lozinka: this.ksifra1, Prezime: this.kprezime, DatumRodjenja: this.kdatum, MestoRodjenja: this.kmesto, Ime: this.kime, Telefon: this.ktelefon, Email: this.kmail, Prihvacen: 'n' };

                    this.service.regK(p);
                    this.tip = 'm';
                    this.poruka = "Zahtev za registraciju je poslat!";
                    this.uspesno = false;
                    this.msg = "";

                  }
                });

              }




            });
          }
        }


      }

    }
    else {
      if (this.ppunoime == null || this.uspesno == false || this.pusername == null || this.pdatum == null || this.pmail == null || this.pmesto == null || this.psifra1 == null || this.psifra2 == null) {
        this.msg = "Niste uneli sva polja!";
        return;
      }
      else {
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
          if (this.psifra1 != this.psifra2) {
            this.msg = "Lozinke se ne poklapaju!";
            return;
          }
          else {
            let a = this.service.proveraMesto(this.pmesto);
            let andj;
            a.subscribe(data => {
              andj = JSON.stringify(data);
              let pomocno = andj.split(":");
              andj = pomocno[1];
              andj = andj.slice(0, andj.length - 1);


              if (andj == 0) {
                this.msg = "Mesto koje ste uneli ne postoji!";
              }
              else {
                this.ko = this.service.pretrazi(this.pusername);
                this.ko.then(data => {
                  this.kor = data;
                  if (JSON.stringify(this.kor) != "[]") {
                    this.msg = "Već postoji korisnik sa datim korisničkim imenom!";

                  }
                  else {
                    let pr: Preduzece = { Id: 1, PunoIme: this.ppunoime, KorIme: this.pusername, Lozinka: this.psifra1, Datum: this.pdatum, Mesto: this.pmesto, Email: this.pmail, Tip: 'p', Prihvacen: 'n' }
                    this.service.regP(pr);

                    this.tip = 'm';
                    this.poruka = "Zahtev za registraciju je poslat!";
                    this.uspesno = false;
                    this.msg = "";
                  }
                });

              }
            });





          }
        }
      }
    }
  }

}
