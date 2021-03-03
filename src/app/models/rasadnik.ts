import { Time } from '@angular/common';


export interface Rasadnik  {
    Id: number;
    Naziv: string;
    Mesto: string;
    Duzina: number;
    Sirina: number;
    Temperatura: number;
    Voda: number;
    Zasadjeno: number;
    IdPolj: number;
    Datum:Date;

}