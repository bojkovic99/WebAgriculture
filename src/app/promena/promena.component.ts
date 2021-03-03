import { Component, OnInit } from '@angular/core';
import { MojServisService } from '../moj-servis.service';
import { Korisnik } from '../models/Korisnik';
import { Router } from '@angular/router';

@Component({
  selector: 'app-promena',
  templateUrl: './promena.component.html',
  styleUrls: ['./promena.component.css']
})
export class PromenaComponent implements OnInit {

  constructor(private service: MojServisService, private router: Router) { }

  ngOnInit(): void {
    if (localStorage.getItem('prijavljen') == null) {
      alert("Morate biti prijavljeni!"); this.router.navigate(['/login']);
    }

  }

  poruka: string;
  ksifra1: string = "";
  ksifra2: string = "";
  stara: string = "";

  korisnik: Korisnik;
  myModa: string;




  konacno() {
    this.korisnik = JSON.parse(localStorage.getItem('prijavljen'));

    if (this.ksifra1 == "" || this.ksifra2 == "" || this.stara == "") {
      this.poruka = "Morate uneti sva polja!";
    }
    else {
      if (this.stara != this.korisnik.Lozinka) {
        this.poruka = "Nije ispravna stara lozinka";

      }
      else {
        if (this.ksifra1 != this.ksifra2) {
          this.poruka = "Ne poklapaju se lozinke! Unesite ponovo";
        }
        else {
          let provera = /^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{7,}$/;

          let peta = /^[A-Z]/;

          if (!(provera.test(this.ksifra1) && peta.test(this.ksifra1))) {
            console.log(this.ksifra1);
            this.poruka = "Lozinka nije u dobrom formatu! Unesite ponovo";
          }
          else {
            if (this.korisnik.Lozinka != this.ksifra1) {
              this.korisnik.Lozinka = this.ksifra1;
              this.service.azurirajKor(this.korisnik);

              this.router.navigate(['/login']);

            }
            else {
              this.poruka = "Lozinka mora da se razlikuje od prethodne!";
            }
          }
        }

      }


    }

  }






}
