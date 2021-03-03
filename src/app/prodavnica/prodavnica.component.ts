import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MojServisService } from '../moj-servis.service';
import { Router } from '@angular/router';
import { Prodavnica } from '../models/Prodavnica';
import { Observable } from 'rxjs';
import { Rasadnik } from '../models/rasadnik';
import { Korisnik } from '../models/Korisnik';


export interface Slanje {
  IdPreduzeca: number;
  IdProizvoda: number;
  IdRas: number;
  Kolicina: number;
  Datum: Date;



}

export interface Komentar {
  IdKom: number;
  IdProizvod: number;
  IdPoljoprivrednika: number;
  Ocena: number;
  Sadrzaj: string;
  Polj: string;
}

@Component({
  selector: 'app-prodavnica',
  templateUrl: './prodavnica.component.html',
  styleUrls: ['./prodavnica.component.css'],

})
export class ProdavnicaComponent implements OnInit {

  constructor(private router: Router, private service: MojServisService) {

  }

  niz: Prodavnica[] = [];
  p: Observable<Prodavnica[]>;
  myModal: string;
  narudzbine: Prodavnica[] = [];
  rasadnik: Rasadnik;
  prikazi: number = 1;
  msg: string = " ";
  indexi: number[] = [];
  presadi: boolean = false;
  komentari: Komentar[] = [];
  k: Observable<Komentar[]>;
  KomProiz: Komentar[][] = [];
  komentariPrik: Komentar[] = [];
  otvori: number = 1;
  kor: Korisnik;
  kom: Komentar;
  ocene: number[] = [];
  broj2: number[] = [];
  prosek: number[] = [];
  brUNizu: number;

  ngOnInit(): void {

    if (localStorage.getItem('rasadnik') == null) {
      alert("Morate biti prijavljeni kao poljoprivrednik!"); this.router.navigate(['/login']);
    }
    else {
      this.kor = JSON.parse(localStorage.getItem('prijavljen'));
      this.rasadnik = JSON.parse(localStorage.getItem('rasadnik'));
      this.p = this.service.dohvatiProdavnicu();
      this.p.subscribe(data => {
        this.niz = data;
        this.ocene = new Array<number>(this.niz.length);
        this.broj2 = new Array<number>(this.niz.length);
        this.prosek = new Array<number>(this.niz.length);
        this.niz.forEach((element, index) => {
          this.ocene[index] = 0;
          this.broj2[index] = 0;
        });
        this.k = this.service.dohvatiKomentare(1, 1);

        this.k.subscribe(data => {
          this.komentari = data;
          this.kom = this.komentari[0];
          this.niz.forEach((element, index) => {
            this.komentari.forEach(element2 => {
              if (element.Id == element2.IdProizvod) {
                this.ocene[index] = this.ocene[index] + element2.Ocena;
                this.broj2[index] = this.broj2[index] + 1;
              }

            });

          });

          this.broj2.forEach((element, index) => {
            if (element > 0) {
              this.prosek[index] = this.ocene[index] / element;

            }
            else {
              this.prosek[index] = 0;
            }

          });

          console.log(this.prosek);

        });


      });



    }




  }


  hide2() {
    this.presadi = false;
  }


  dodajUKorpu(i: number) {
    this.msg = " ";


    var n: Prodavnica = {
      Id: this.niz[i].Id,
      CenaPro: this.niz[i].CenaPro,
      IdProizvodjaca: this.niz[i].IdProizvodjaca,

      Kolicina: this.niz[i].Kolicina,


      Naziv: this.niz[i].Naziv,
      Proizvodjac: this.niz[i].Proizvodjac,
      Tip: this.niz[i].Tip,
      Napredak: this.niz[i].Napredak,
      Presadjivanje: this.niz[i].Presadjivanje,
      Ocena: this.niz[i].Ocena
    }

    this.niz[i].Kolicina = this.niz[i].Kolicina - 1;



    let flag = false;
    this.narudzbine.forEach((element, index) => {
      if (element.Id == n.Id) { element.Kolicina = element.Kolicina + 1; flag = true; }

    });

    if (flag == false) { n.Kolicina = 1; this.indexi.push(i); this.narudzbine.push(n); }


  }

  odustaniK(i: number) {


    this.narudzbine[i].Kolicina = this.narudzbine[i].Kolicina - 1;
    this.niz.forEach(element => {
      if (element.Id == this.narudzbine[i].Id) {

        element.Kolicina = element.Kolicina + 1;

      }
    });

    if (this.narudzbine[i].Kolicina == 0) {
      this.narudzbine.splice(i, 1);
    }




  }
  nazad() {

    this.router.navigate(['/rasadnik']);
  }

  zavrsi() {
    this.msg = "";
    this.narudzbine.forEach((element, i) => {


      var isoDate: Date = new Date();
      var mySQLDateString = JSON.stringify(isoDate).slice(1, 11).replace('T', ' ');
      var mySQLDateStringD = mySQLDateString as unknown as Date;


      let t: Slanje = { IdRas: this.rasadnik.Id, IdProizvoda: element.Id, IdPreduzeca: element.IdProizvodjaca, Kolicina: element.Kolicina, Datum: mySQLDateStringD };

      console.log(JSON.stringify(t));


      let a = this.service.dodajMagacin(t);
      a.subscribe(
        data => {
          console.log(data);
        }
      );



    });


    this.indexi.forEach(element => {
      this.service.azurirajProdavnicu(this.niz[element]);
    });
    this.narudzbine = [];

    this.indexi = [];
    this.msg = 'Kupovina uspesno izvrsena';


  }

  message: string = "";
  message2: string = "";
  sadrzaj: string;
  ocena: number;
  broj: number;

  objavi() {
    this.message = "";
    this.message2 = "";
    if (this.ocena > 5 || this.ocena < 1) {
      this.message2 = "Ocena mora biti u opsegu od 1 do 5";
    }
    else {
      this.kom = { IdKom: 20, IdProizvod: this.broj, IdPoljoprivrednika: this.rasadnik.IdPolj, Polj: this.kor.KorIme, Sadrzaj: this.sadrzaj, Ocena: this.ocena }



      this.service.dodajKomentar(this.kom);
      this.komentari.push(this.kom);

      this.ocene[this.brUNizu] = this.ocene[this.brUNizu] + this.ocena;
      this.broj2[this.brUNizu] = this.broj2[this.brUNizu] + 1;
      this.prosek[this.brUNizu] = this.ocene[this.brUNizu] / this.broj2[this.brUNizu];

      //this.otvori=1;
      this.message2 = "";
      this.komentariPrikaz(this.broj);
      this.sadrzaj = "";
      this.ocena = 0;

    }



  }
  komentarisi(i: number, brniz: number) {
    this.otvori = 1;
    this.message = "";
    this.message2 = "";

    let postoji: boolean = false;
    //ne smem da komentarisem ako sam vec komentarisala ili ako nisam koristila proizvod
    this.komentari.forEach(element => {
      if (element.IdProizvod == i && element.IdPoljoprivrednika == this.rasadnik.IdPolj) {
        postoji = true;
        this.message = 'Već ste komentarisali ovaj proizvod';
      }
    });
    if (postoji == false) {
      let b = this.service.dohvatiProizvode(this.rasadnik.Id, i, 2);
      let pomocno;
      b.subscribe(data => {
        pomocno = data;
        if ((JSON.stringify(pomocno)) != '[]') {
          postoji = false;
          this.otvori = 3;
          this.brUNizu = brniz;
          this.broj = i;
        }
        else { postoji = true; this.message = 'Niste koristili ovaj proizvod'; }
      })
    }




  }
  komentariPrikaz(i: number) {
    this.message = "";
    this.message2 = "";
    this.komentariPrik = [];
    this.komentari.forEach(element => {
      if (element.IdProizvod == i) this.komentariPrik.push(element);
    });
    console.log(JSON.stringify(this.komentariPrik));
    this.otvori = 2;


  }

}

