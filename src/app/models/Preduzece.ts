import { Korisnik } from './Korisnik';

export interface Preduzece {
  Id: number;
  PunoIme: string;
  KorIme: string;
  Lozinka: string;

  Datum: Date;
  Mesto: string;
  Email: string;
  Tip: string;
  Prihvacen: string;

}