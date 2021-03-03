import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { MojServisService } from '../moj-servis.service';
import { Korisnik } from '../models/Korisnik';
import { Narudzbine } from '../models/Narudzbine';
import { Observable } from 'rxjs';
import { Magacin } from '../models/magacin';
import { Prodavnica } from '../models/Prodavnica';
import { Preduzece } from '../models/Preduzece';
import { Poljoprivrednik } from '../models/Poljoprivrednik';
export interface Kuriri {
  K1: number;
  K2: number;
  K3: number;
  K4: number;
  K5: number;
  Id: number;
}
export interface Gradovi {
  grad1: string;
  grad2: string;
}

export interface Pomocnoo {
 
 

  u: Number,
  kol: Number,
  idnar: Number,
  idras: Number,
  vreme: any,
  ind: Number,
  idr: Number
}

@Component({
  selector: 'app-preduzece',
  templateUrl: './preduzece.component.html',
  styleUrls: ['./preduzece.component.css', '../promena/promena.component.css']
})
export class PreduzeceComponent implements OnInit {



  constructor(private router: Router, private service: MojServisService) { }


  kor: Korisnik;
  n: Observable<Narudzbine[]>;
  narudzbine: Narudzbine[] = [];
  narudzbinepom: Narudzbine[] = [];
  narudzbinepom2: Narudzbine[] = [];
  kuriri: number[] = [0, 0, 0, 0, 0];
  k: Observable<Kuriri>;
  odabran: number;
  kurir: Kuriri;
  prioritet: number = 0;
  m: Observable<Prodavnica[]>;
  mojiproizvodi: Prodavnica[];
  prikaz: number = 1;
  naziv: string;
  tip: string;
  osobina: number;
  cen: number;
  koli: number;
  trenutnitab = 0;
  tabovi: number[] = [1, 0, 0, 0, 0, 0];
  preduzece: Preduzece;
  kupac: Poljoprivrednik;
  mojGrad: string;
  idpred: number = 0;

  ngOnInit(): void {


    if (localStorage.getItem('prijavljen') == null) {
      alert("Morate biti prijavljeni kao preduzeće!"); this.router.navigate(['/login']);
    }
    else {
      this.kor = JSON.parse(localStorage.getItem('prijavljen'));

      if (this.kor.Tip != 'p') { alert("Morate biti prijavljeni kao preduzece!"); this.router.navigate(['/login']); }
      else {
        this.n = this.service.dohvatiNarudzbine(this.kor.KorIme);
        this.n.subscribe(data => {
          this.narudzbine = data;
          this.narudzbinepom = data;
          this.narudzbinepom2 = data;



          this.narudzbine.forEach(element => {
            let t: Date = new Date(element.Datum);
            t.setDate(t.getDate() + 1);
            element.Datum = JSON.stringify(element.Datum).slice(1, 11) as unknown as Date;
          });

          this.m = this.service.dohvatiProizvodePred(this.kor.KorIme);
          this.m.subscribe(data => { this.mojiproizvodi = data; })
          this.k = this.service.dohvatiKurire(this.kor.KorIme);
          this.k.subscribe(dataa => {
            this.kurir = dataa;
            this.kuriri[0] = this.kurir[0].K1;
            this.kuriri[1] = this.kurir[0].K2;
            this.kuriri[2] = this.kurir[0].K3;
            this.kuriri[3] = this.kurir[0].K4;
            this.kuriri[4] = this.kurir[0].K5;
          });

          let pom: Kuriri;
          this.narudzbine.sort((a, b) => b.NaCekanju - a.NaCekanju);
          this.narudzbine.forEach(element => {
            if (element.NaCekanju > this.prioritet) this.prioritet = element.NaCekanju;

          });
        });

        setInterval(() => {
          this.k = this.service.dohvatiKurire(this.kor.KorIme);
          this.k.subscribe(dataa => {
            this.kurir = dataa;
            this.kuriri[0] = this.kurir[0].K1;
            this.kuriri[1] = this.kurir[0].K2;
            this.kuriri[2] = this.kurir[0].K3;
            this.kuriri[3] = this.kurir[0].K4;
            this.kuriri[4] = this.kurir[0].K5;
          });


        }, 18000);


      }


    }
  }

  prihvati(index: number) {
    console.log('prihvata');
    let flag: boolean = false;
    for (let i = 0; i < 5; i++) {
      if (this.kuriri[i] == 1) {
        this.odabran = i;
        flag = true;
        break;
      }
    }
    if (flag == false) //nije nasao kurira, ide na cekanje
    {
      this.narudzbine[index].NaCekanju = this.prioritet + 1;
      this.prioritet = this.prioritet + 1;
      this.service.azurirajNarudzbine(this.narudzbine[index]);
      this.narudzbine[index].NaCekanju = this.prioritet;

      this.narudzbine.sort((a, b) => b.NaCekanju - a.NaCekanju);
    }
    else { //nasao kurira
      this.kuriri[this.odabran] = 0;
      if (this.odabran == 0) { this.kurir[0].K1 = 0; };
      if (this.odabran == 1) { this.kurir[0].K2 = 0; }
      if (this.odabran == 2) { this.kurir[0].K3 = 0; };
      if (this.odabran == 3) { this.kurir[0].K4 = 0; };
      if (this.odabran == 4) { this.kurir[0].K5 = 0; };

      this.service.azurirajKurire(this.kurir[0]);

      let idpr = this.narudzbine[index].IdPreduzeca;
      this.idpred = idpr;


      let ind = this.odabran;
      let idp = this.narudzbine[index].IdProizvoda;
      let kol = this.narudzbine[index].Kolicina;
      let idr = this.narudzbine[index].IdRas;
      let idna = this.narudzbine[index].IdN;
      this.service.odbaciNarudzbinu(this.narudzbine[index].IdN, 'n', idpr, idp, 0);
      this.narudzbine.splice(index, 1);

      let andj;
      let drugi: string;
      let gr: Gradovi
      console.log(idr);
      let k = this.service.dohvatiPoljoprivrednika(idr);
      k.subscribe(data => {
        drugi = JSON.stringify(data);
        console.log(drugi);
        let c = drugi.split(':');
        drugi = c[1];
        drugi = drugi.slice(0, drugi.length - 2);
        gr = { grad1: this.kor.Mesto, grad2: drugi };


        let a = this.service.razdaljina(gr);
        a.subscribe(data => {
          andj = JSON.stringify(data);
          let pomocno = andj.split(":");
          andj = pomocno[1];
          andj = andj.slice(0, andj.length - 1);

          andj = andj * 1000;
          let po: Pomocnoo = { vreme: andj, idnar: idna, u: idp, idr: idpr, idras: idr, ind: ind, kol: kol };
          /* idp, kol, idna, idr, andj, ind, idpr */
          /* :u/:kol/:idnar/:idras/:vreme/:ind/:idr */
          let pom = this.service.sacekajPorudbinu(po);
          pom.subscribe();
        })

      });












    }



  }
  odbaci(index: number) {
    this.service.odbaciNarudzbinu(this.narudzbine[index].IdN, 'o', this.narudzbine[index].IdPreduzeca, this.narudzbine[index].IdProizvoda, this.narudzbine[index].Kolicina);
    this.narudzbine.splice(index, 1);
  }



  poruka: string = "";
  showtab(n: number) {

    if (n == 1 && this.naziv == null) { this.poruka = "Morate uneti vrednost!"; }


    else if (n == 2 && this.tip == null) { this.poruka = "Morate uneti vrednost!"; }

    else if (n == 3 && this.osobina == null) { this.poruka = "Morate uneti vrednost!"; }

    else if (n == 4 && this.koli == null) { this.poruka = "Morate uneti vrednost!"; }

    else if (n == 5 && this.cen == null) { this.poruka = "Morate uneti vrednost!"; }
    else {
      this.tabovi[(n - 1) % 5] = 0;
      this.tabovi[(n + 1) % 5] = 0;
      this.tabovi[n] = 1;
      this.poruka = "";
    }












  }



  msg: string = "";
  dodajUProd() {
    this.msg = "";
    if (this.cen == null) { this.poruka = "Morate uneti vrednost" }
    else {

      let proiz: Prodavnica = { Id: 1, Kolicina: this.koli, CenaPro: this.cen, IdProizvodjaca: 1, Naziv: this.naziv, Proizvodjac: this.kor.KorIme, Tip: this.tip, Napredak: this.tip == 'p' ? this.osobina : null, Presadjivanje: this.tip == 's' ? this.osobina : null, Ocena: null };
      let a = this.service.dodajProizvod(proiz);
      let b;
      a.subscribe(data => {
        b = data;
        proiz.Id = b;
      });

      this.mojiproizvodi.push(proiz);
      alert("Usprešno ste dodali proizvod!");
      this.prikaz = 2;

      this.showtab(0);
      this.tabovi[5] = 0;
      this.tabovi[4] = 0;
      this.naziv = "";
      this.tip = "";
      this.osobina = null;
      this.koli = null;
      this.cen = null;
    }

  }
  povuci(id: number) {
    let pom: number = this.mojiproizvodi[id].Id;
    this.service.obrisiProizvod(this.mojiproizvodi[id].Id);
    this.mojiproizvodi.splice(id, 1);
    this.narudzbine.forEach((element, index) => {
      if (element.IdProizvoda = pom) {
        this.narudzbine.splice(index, 1);
      }
    });
  }

  detaljno(i: number) {
    if (localStorage.getItem('detaljno') != null) {
      localStorage.removeItem('detaljno');
    }
    localStorage.setItem('detaljno', JSON.stringify(this.mojiproizvodi[i]));
    this.router.navigate(['/proizvod']);

  }

  sortiraj() {


    let pom: Array<Narudzbine> = new Array(this.narudzbine.length);
    for (let i = 0; i < this.narudzbine.length; i++) {
      pom[i] = {
        IdN: this.narudzbinepom[i].IdN,
        IdPreduzeca: this.narudzbinepom[i].IdPreduzeca,
        IdRas: this.narudzbinepom[i].IdRas,
        IdProizvoda: this.narudzbinepom[i].IdProizvoda,
        Kolicina: this.narudzbinepom[i].Kolicina,
        Naziv: this.narudzbinepom[i].Naziv,
        NaCekanju: this.narudzbinepom[i].NaCekanju,
        Datum: this.narudzbinepom[i].Datum
      }
    }
    pom.sort((a, b) => { if (a.Datum < b.Datum) return -1; });

    this.narudzbine = pom;

  }
  grafi: number = 0;
  sortirajNemoj() {
    this.narudzbine = this.narudzbinepom;
  }






}



