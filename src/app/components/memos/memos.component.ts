import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServerService } from 'src/app/services/server';
import { Memos } from 'src/app/models/memos';
import { Departamentos } from 'src/app/models/departamentos';
import { Pagination } from 'src/app/models/pagination.model';
import { UiService } from 'src/app/services/ui.service';
import { Users } from 'src/app/models/users';
import { jsPDF } from "jspdf";
import autoTable  from 'jspdf-autotable';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-memos',
  templateUrl: './memos.component.html',
  styleUrls: ['./memos.component.scss']
})
export class MemosComponent implements OnInit {
  public memos: Memos[] = [];
  public pagination: Pagination = new Pagination();
  public filter: Memos = new Memos();
  public departamentos: Departamentos[] = [];
  public memosFilter: Memos[] = [];
  public seletedDepartamento: number = 0;
  public users: Users[] = [];
  public fecha: number = 0;
  public fechas: number[] = [2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030];
  searchValue: string | undefined;
  
   elimir: boolean = true;

  constructor(public server: ServerService, private ui: UiService, private router: Router) { }

 async ngOnInit() {
  this.users = (await this.server.getAllUsers(new Pagination(1, 1000000)))?.items;

 this.getDepartamentos();
 this.search();

  }
  
  async getDepartamentos() {
    this.departamentos = (await this.server.getAllDepartamentos(new Pagination(1, 1000000)))?.items;
    let aux = [];
    for (const departamento of this.departamentos) {
      if (departamento.status == "activo") {
        aux.push(departamento);
      }
    }
    this.departamentos = aux;
    console.log(this.departamentos);
  }

  async search() {
    let auxFecha
    let resultado = (await this.server.getAllMemos(new Pagination(1, 1000000)))?.items;
    this.memos = resultado;
    this.pagination.refresh(resultado.count);
    console.log(resultado);
    if (this.server.user.tipo == 'admin') {
      this.memosFilter = [];
      if (this.seletedDepartamento == 0 && this.fecha == 0) {
        this.memosFilter = this.memos;
      } else if (this.seletedDepartamento == 0 && this.fecha != 0) {
        for (const memo of this.memos) {
          auxFecha = new Date(memo.fecha).getFullYear();
          if (auxFecha == this.fecha) {
            this.memosFilter.push(memo);
          }
        }
      } else {
        for (const memo of this.memos) {
          auxFecha = new Date(memo.fecha).getFullYear();
          if (memo.toDepartamento == this.seletedDepartamento && this.fecha == 0) {
              this.memosFilter.push(memo);          
          } else if (memo.toDepartamento == this.seletedDepartamento && this.fecha != 0) {
            if (auxFecha == this.fecha) {
              this.memosFilter.push(memo);
            }
          }
        }
      }
    }else{
      this.memosFilter = [];
      for (const memo of this.memos) {
        memo.copia_para = memo.copia_para.split(',');
        let aux = memo.copia_para.findIndex((x: number) => x == this.server.user.id_depart);
      
        if (memo.toDepartamento == this.server.user.id_depart || aux != -1) {
          if (this.fecha == 0) {
            this.memosFilter.push(memo);
          }else{
            auxFecha = new Date(memo.fecha).getFullYear();
            if (auxFecha == this.fecha) {
              this.memosFilter.push(memo);
            }
          }
        }
      }
    }
  }
 
  getNameDepartamento(id: number):any {
    let aux
    for (const departamento of this.departamentos) {
      if (departamento.id == id) {
        aux = departamento.nombre_departamento;
      }
    }
    return aux;
  }

  onChangeDepartamento() {
    console.log(this.seletedDepartamento);
    this.search();
  }
  onChangeFecha() {
    console.log(this.fecha);
    this.search();
  }

  create() {
    this.router.navigate(['memoCreate']);
  }
  read(id: string) {
    this.router.navigate([`memo/${id}`]);
  }

 async generateReport() {
    const doc = new jsPDF('l');
    doc.addImage("../../../../assets/img/LOGOS CORPOLARA 2.png", 'PNG', 10, 10, 55, 10);
    doc.text("Reporte", 140, 30);
    doc.setFontSize(12);
    doc.text("Total de memos: " + this.memosFilter.length, 10, 35);
    autoTable (doc ,{
      margin: {top: 45, right: 10, bottom: 10, left: 10},
      head:[
        ['Cod. Memo','De','Para','Asunto','Estado']
      ],
      body: [
        ...this.memosFilter.map(x=>[x.codigo_memo,this.getNameDepartamento(x.fromDepartamento),this.getNameDepartamento(x.toDepartamento),x.asunto,x.status])
      ]
    } )

    doc.save('reporte.pdf');
  
  }
   clear(table: Table) {
        table.clear();
        this.searchValue = ''
    }

}
