import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServerService } from 'src/app/services/server';
import { Memos } from 'src/app/models/memos';
import { Departamentos } from 'src/app/models/departamentos';
import { Pagination } from 'src/app/models/pagination.model';
import { UiService } from 'src/app/services/ui.service';
import { jsPDF } from "jspdf";
import autoTable  from 'jspdf-autotable';

@Component({
  selector: 'app-memos-env',
  templateUrl: './memos-env.component.html',
  styleUrls: ['./memos-env.component.scss']
})
export class MemosEnvComponent implements OnInit {
  public memos: Memos[] = [];
  public pagination: Pagination = new Pagination();
  public filter: Memos = new Memos();
  public memosFilter: Memos[] = [];
  public departamentos: Departamentos[] = [];
  public fecha: number = 0;
  public fechas: number[] = [2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030];


  constructor(public server: ServerService, private ui: UiService, private router: Router) { }

  async ngOnInit() {
    this.getDepartamentos();
    this.search();
  }
  async getDepartamentos() {
    this.departamentos = (await this.server.getAllDepartamentos(new Pagination(1, 1000000)))?.items;
  }

  async search() {
    let resultado = (await this.server.getAllMemos(new Pagination(1, 1000000)))?.items;;
    this.memos = resultado
    this.pagination.refresh(resultado.count);
    console.log(resultado);
    this.memosFilter = [];
    for (const memo of this.memos) {
      if (memo.fromDepartamento == this.server.user.id_depart) {
        if (this.fecha == 0) {
          this.memosFilter.push(memo);
        } else{
          if (new Date(memo.fecha).getFullYear() == this.fecha) {
            this.memosFilter.push(memo);
            } 
        }
      }
  }
  }

  create() {
    this.router.navigate(['memoCreate']);
  }
  read(id: string) {
    this.router.navigate([`memo/${id}`]);
  }

  onChangeFecha() {
    console.log(this.fecha);
    this.search();
  }
  getNameDepartamento(id: number) {
    let aux
    for (const departamento of this.departamentos) {
      if (departamento.id == id) {
        aux = departamento.nombre_departamento;
      }
    }
    return aux;
  }


async generateReport() {
    const doc = new jsPDF('l');
    doc.addImage("../../../../assets/img/LOGOS CORPOLARA 2.png", 'PNG', 10, 10, 55, 10);
    doc.text("Reporte", 140, 30);
    doc.setFontSize(12);
    doc.text("Total de memos enviados: " + this.memosFilter.length, 10, 35);
    autoTable (doc ,{
      margin: {top: 45, right: 10, bottom: 10, left: 10},
      head:[
        ['Cod. Memo','De','Para','Asunto','Estado']
      ],
      body: [
        ...this.memosFilter.map(x=>[x.codigo_memo, this.getDto(x.fromDepartamento),this.getDto(x.toDepartamento),x.asunto,x.status])
      ]
    } )

    doc.save('reporteDeEnviados.pdf');
  
  }

  getDto(id:number):any{
    let aux
    for (const dto of this.departamentos) {
      if(dto.id == id){
        aux = dto.nombre_departamento
      }
    }
    return aux;
  }
}


