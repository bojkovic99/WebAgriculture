import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MojServisService } from '../moj-servis.service';
import { Korisnik } from '../models/Korisnik';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],

})
export class LoginComponent implements OnInit {

  constructor(private service: MojServisService, private router: Router) { }

  ngOnInit(): void {


    localStorage.clear();


  }

  password: string;
  username: string;

  ksifra1: string;
  ksifra2: string;


  k: Observable<Korisnik[]>;
  niz: Korisnik[] = [];
  poruka: string = "";
  kor: Korisnik;
  korisnik: Korisnik;
  pr: boolean = false;
  ko: Promise<Korisnik>;





  logovanje() {

    let f = true;
    this.ko = this.service.pretrazi(this.username);
    this.ko.then(data => {
      let kori = data; this.kor = kori[0];
      if (JSON.stringify(kori) == "[]") {
        this.poruka = "Neispravni podaci! Pokušajte ponovo!";

        return;
      }
      else {
        if (this.kor.KorIme != this.username || this.kor.Prihvacen == 'n') {
          this.poruka = "Vaš zahtev za registraciju još nije prihvacen!";

          return;
        }
        else {
          if (this.kor.Lozinka != this.password) {
            this.poruka = "Pogrešna loznka!";
          }
          else {
            f = false;
            if (localStorage.getItem('prijavljen') == null) {
              localStorage.setItem('prijavljen', JSON.stringify(this.kor));
            }
            else {
              let k = JSON.parse(localStorage.getItem('prijavljen'));
              localStorage.setItem('prijavljen', JSON.stringify(this.kor));

            }
            this.korisnik = this.kor;
            if (this.kor.Tip == 'p') this.router.navigate(['/preduzece']);
            if (this.kor.Tip == 'a') this.router.navigate(['/admin']);
            if (this.kor.Tip == 'k') this.router.navigate(['/poljoprivrednik']);
          }

        }
      }
    });









  }



  promena() {
    let f = true;
    this.niz.forEach(element => {
      if (element.KorIme == this.username) {
        f = false;
        if (element.Lozinka != this.password) {
          this.poruka = "Pogresna lozinka!";
        }
        else {
          if (localStorage.getItem('prijavljen') == null) {
            localStorage.setItem('prijavljen', JSON.stringify(element));
          }
          else {
            let k = JSON.parse(localStorage.getItem('prijavljen'));
            localStorage.setItem('prijavljen', JSON.stringify(element));

          }

          this.router.navigate(['/promena']);

        }

      }

    });

    if (f) {
      this.poruka = "Pogrešni podaci! Pokušajte ponovo!";
    }

  }
}






