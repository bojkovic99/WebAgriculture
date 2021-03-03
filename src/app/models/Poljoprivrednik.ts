import { Korisnik } from './Korisnik';

export interface Poljoprivrednik {
  Id: number;
  KorIme: string;
  Lozinka: string;
  Tip: string;
  Ime: string;
  Prezime: string;

  DatumRodjenja: Date;
  MestoRodjenja: string;

  Telefon: string;
  Email: string;

  Prihvacen: string;

}