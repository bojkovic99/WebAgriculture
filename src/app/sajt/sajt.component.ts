import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MojServisService } from '../moj-servis.service';
import { Komentar } from '../prodavnica/prodavnica.component';
import { Observable } from 'rxjs';
import { Prodavnica } from '../models/Prodavnica';

@Component({
  selector: 'app-sajt',
  templateUrl: './sajt.component.html',
  styleUrls: ['./sajt.component.css', '../promena/promena.component.css']
})
export class SajtComponent implements OnInit {

  constructor(private router: Router, private service: MojServisService) { }

  id: number;
  proizvodi: Prodavnica;
  komentari: Komentar[] = [];
  k: Observable<Komentar[]>;
  prosek: number = 0;
  duzina: number = 0;
  ngOnInit(): void {

    if (localStorage.getItem('detaljno') == null) {
      alert("Morate izabrati proizvod!"); this.router.navigate(['/login']); console.log('izasao')
    }
    else {
      this.proizvodi = JSON.parse(localStorage.getItem('detaljno'));
      this.id = this.proizvodi.Id;
      console.log(this.id);
      this.k = this.service.dohvatiKomentare(this.id, 2);
      this.k.subscribe(data => {
      this.komentari = data;
        this.komentari.forEach((element, index) => {
          this.prosek = this.prosek + element.Ocena;
        });

        if (this.komentari.length > 0) {
          this.prosek = this.prosek / this.komentari.length;
        }
        else this.prosek = 0;
        this.duzina = this.komentari.length;
      });


    }

  }

  nazad() {
    this.router.navigate(['/preduzece']);
  }

}
