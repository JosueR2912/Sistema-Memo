import { Component, OnInit } from '@angular/core';
import { ServerService } from 'src/app/services/server';
import { Pagination } from 'src/app/models/pagination.model';
import { Departamentos } from 'src/app/models/departamentos';
import { Memos } from 'src/app/models/memos';
import { jsPDF } from "jspdf";
import autoTable  from 'jspdf-autotable';


@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.scss']
})
export class ReporteComponent implements OnInit {
  public memos: Memos[] = [];
  public departamentos: Departamentos[] = [];
  public filter: any[] = [];
  public aux :any[] = [];
  public fechas: number[] = [2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030];
  public selectedFecha:number = 0;


  constructor(public server: ServerService) { }

 async ngOnInit() {
   
    this.departamentos = (await this.server.getAllDepartamentos(new Pagination(1, 10000)))?.items;
    let aux = [];
    for (const departamento of this.departamentos) {
      if (departamento.status == "activo") {
        aux.push(departamento);
      }
    }
    this.departamentos = aux;
    await this.getMemos();
    console.log(this.memos);
    console.log(this.departamentos);
    await this.sortMemos();
    console.log(this.filter);
  }
  async getMemos() {
    this.memos = (await this.server.getAllMemos(new Pagination(1, 10000000)))?.items;

  }
  async sortMemos(){
    if(this.selectedFecha == 0){
      for (const item of this.departamentos){
        this.aux = [
          {
            codigo_departamento: item.codigo_departamento,
            nombre_departamento: item.nombre_departamento,
            memos_enviados: this.memos.filter((x:any)=> x.fromDepartamento === item.id).length,
            status_atendidos: this.memos.filter((x:any)=> x.fromDepartamento === item.id && x.status === "ATENDIDO").length,
            status_sinAtender: this.memos.filter((x:any)=> x.fromDepartamento === item.id && x.status === "SIN ATENDER").length,
            status_proceso : this.memos.filter((x:any)=> x.fromDepartamento === item.id && x.status === "EN PROCESO").length,
            memos_recibidos: this.memos.filter((x:any)=> x.toDepartamento === item.id).length,
            statusRe_atendidos: this.memos.filter((x:any)=> x.toDepartamento === item.id && x.status === "ATENDIDO").length,
            statusRe_sinAtender: this.memos.filter((x:any)=> x.toDepartamento === item.id && x.status === "SIN ATENDER").length,
            statusRe_proceso : this.memos.filter((x:any)=> x.toDepartamento === item.id && x.status === "EN PROCESO").length,
          }
        ]
        this.filter.push(this.aux[0]);
      }
    } else{
      for (const item of this.departamentos){
        this.aux = [
          {
            codigo_departamento: item.codigo_departamento,
            nombre_departamento: item.nombre_departamento,
            memos_enviados: this.memos.filter((x:any)=> x.fromDepartamento === item.id && new Date(x.fecha).getFullYear() == this.selectedFecha).length,
            status_atendidos: this.memos.filter((x:any)=> x.fromDepartamento === item.id && x.status === "ATENDIDO" && new Date(x.fecha).getFullYear() == this.selectedFecha).length,
            status_sinAtender: this.memos.filter((x:any)=> x.fromDepartamento === item.id && x.status === "SIN ATENDER" && new Date(x.fecha).getFullYear() == this.selectedFecha).length,
            status_proceso : this.memos.filter((x:any)=> x.fromDepartamento === item.id && x.status === "EN PROCESO" && new Date(x.fecha).getFullYear() == this.selectedFecha).length,
            memos_recibidos: this.memos.filter((x:any)=> x.toDepartamento === item.id && new Date(x.fecha).getFullYear() == this.selectedFecha || x.copia_para.split(',').findIndex((x: number) => x === item.id) !== -1 && new Date(x.fecha).getFullYear() == this.selectedFecha).length,
            statusRe_atendidos: this.memos.filter((x:any)=> x.toDepartamento === item.id && x.status === "ATENDIDO" && new Date(x.fecha).getFullYear() == this.selectedFecha).length,
            statusRe_sinAtender: this.memos.filter((x:any)=> x.toDepartamento === item.id && x.status === "SIN ATENDER" && new Date(x.fecha).getFullYear() == this.selectedFecha).length,
            statusRe_proceso : this.memos.filter((x:any)=> x.toDepartamento === item.id && x.status === "EN PROCESO" && new Date(x.fecha).getFullYear() == this.selectedFecha).length,
          }
        ]
        this.filter.push(this.aux[0]);
        console.log(this.aux)
      }
    }
  }
  async generatePDF(){
    const doc = new jsPDF('l');
    doc.addImage("../../../../assets/img/LOGOS CORPOLARA 2.png", 'PNG', 10, 10, 55, 10);
    doc.text("Reporte", 140, 30);
    autoTable (doc ,{
      margin: {top: 40, right: 10, bottom: 10, left: 10},
      head:[
        ['Cod. Departamento','Nombre Departamento','Memos enviados','Atendidos','En proceso','Sin atender','Memos recibidos','Atendidos','En proceso','Sin atender']
      ],
      body: [
        ...this.filter.map(x=>[x.codigo_departamento,x.nombre_departamento,x.memos_enviados,x.status_atendidos,x.status_proceso, x.status_sinAtender,x.memos_recibidos, x.statusRe_atendidos,x.statusRe_proceso, x.statusRe_sinAtender]) 
      ]
    } )
    doc.save('reporte.pdf');
  }

  async changeDate(){
    this.filter = []
    this.sortMemos();
    console.log(this.selectedFecha)
    console.log(this.filter)
  }
}