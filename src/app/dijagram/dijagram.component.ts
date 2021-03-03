import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { Dijagram } from '../models/Dijagram';
import { MojServisService } from '../moj-servis.service';

import { Korisnik } from '../models/Korisnik';

@Component({
  selector: 'app-dijagram',
  templateUrl: './dijagram.component.html',
  styleUrls: ['./dijagram.component.css']
})
export class DijagramComponent implements OnInit {

  constructor(private service: MojServisService) { }

  sviDijagrami: Dijagram[] = [];
  kor: Korisnik;
  ngOnInit(): void {
    this.kor = JSON.parse(localStorage.getItem('prijavljen'));
    console.log(this.kor.Id);

    let a = this.service.grafik(this.kor.Id);

    a.then(
      data => {

        this.sviDijagrami = data;
        this.dijagrami = [];




        var glavni: number;
        let min: number;
        let max: number;
        let count: number;
        this.sviDijagrami.forEach((element, index) => {

          if (element.Glavni == 1) {
            glavni = element.Id; min = element.Minimum; max = element.Maximum; count = element.Counter;
            this.sviDijagrami.splice(index, 1);
          }

        });
        console.log(count + " " + min + " " + max);

        if (count < 29) {
          console.log("okej");
          this.dijagrami = this.sviDijagrami;
          for (let i = count; i < 30; i++) {
            let d: Dijagram = { Maximum: 0, Broj: 1, Counter: 2, Datum: new Date, Glavni: 0, Id: 1, IdPreduzeca: this.kor.Id, Kolicina: 0, Minimum: 0 };
            this.dijagrami.push(d);
          }

        }
        else {
          for (let i = 0; i < 30; i++) {
            this.dijagrami[i] = this.sviDijagrami[(min + i) % 30];
          }
        }

        this.dataSource = this.getData();
        this.svg = d3.select('#bar').select('svg');
        this.xScale = d3.scaleBand();


        this.yScale = d3.scaleLinear();
        this.setSVGDimensions();

        this.mainContainer = this.svg.append('g').attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
        this.gy = this.mainContainer.append('g').attr('class', 'axis axis--y');
        this.gx = this.mainContainer.append('g').attr('class', 'axis axis--x');
        this.draw();


      }


    );









  }
  private readonly NAMES = ['1', '2', '3', '4', '5', '6', '7', '8', '9',
    '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'];

  /*  private readonly MIN_ITEM = 10;
   private readonly MAX_ITEM = 20;
 
   private readonly MAX_VALUE = 100; */




  dataSource: Item[];

  getData(): Item[] {
    console.log(this.dijagrami);
    const nbItems = 30;
    const samples = [];
    for (let i = 0; i < nbItems; i++) {

      const val = this.dijagrami[i].Kolicina;
      //const val = 5;
      samples.push({
        name: this.NAMES[i],
        value: val,
        abs: Math.abs(val)
      });
    }
    return samples;
  }

  get height(): number { return parseInt(d3.select('body').style('height'), 10); }
  get width(): number { return parseInt(d3.select('body').style('width'), 10); }
  private margin = { top: 20, right: 20, bottom: 30, left: 40 };
  get barWidth(): number { return this.width - this.margin.left - this.margin.right; }
  get barHeight(): number { return this.height - this.margin.top - this.margin.bottom; }

  gx: any; gy: any; bars: any;

  xAxis: any; xScale: any; yAxis: any; yScale: any;

  svg: any; mainContainer: any;



  private drawBars() {
    this.bars = this.mainContainer.selectAll('.bar')
      .remove().exit()
      .data(this.dataSource).enter().append('rect');

    this.bars
      .attr('x', d => this.xScale(d.name))
      .attr('y', d => this.yScale(d.value))
      .attr('width', Number(this.xScale.bandwidth()))
      .attr('height', d => Math.abs(Number(this.yScale(d.value)) - Number(this.yScale(0))))
      .attr("fill", function (d) {
        if (d.value < 5) {
          return "yellow";
        } else if (d.value < 20) {
          return "orange";
        }
        return "red";
      });
  }

  private drawAxis() {
    this.gy.attr('transform', `translate(0, 0)`).call(this.yAxis);
    this.gx.attr('transform', `translate(0, ${this.yScale(0)})`).call(this.xAxis);
  }

  private setSVGDimensions() {
    this.svg.style('width', this.width).style('height', this.height);
  }

  private setAxisScales() {
    this.xScale = d3.scaleBand();
    this.yScale = d3.scaleLinear();

    this.xScale
      .rangeRound([0, this.barWidth]).padding(.1)
      .domain(this.dataSource.map(d => d.name));
    this.yScale
      .range([this.barHeight, 0])
      .domain([0, Math.max(...this.dataSource.map(x => x.value))]);
    this.xAxis = d3.axisBottom(this.xScale);
    this.yAxis = d3.axisLeft(this.yScale);
  }

  private draw() {
    this.setAxisScales();
    this.drawAxis();
    this.drawBars();
  }


  dijagrami: Dijagram[] = [];
  grafi() {



  }

}
export interface Item {
  name: string;
  value: number;
  abs: number;
}

