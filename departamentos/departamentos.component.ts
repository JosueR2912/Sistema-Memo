import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServerService } from 'src/app/services/server';
import { Pagination } from 'src/app/models/pagination.model';
import { Departamentos } from 'src/app/models/departamentos';
import { UiService } from 'src/app/services/ui.service';
import { Table } from 'primeng/table';


@Component({
  selector: 'app-departamentos',
  templateUrl: './departamentos.component.html',
  styleUrls: ['./departamentos.component.scss']
})
export class DepartamentosComponent implements OnInit {
  public departamentos: Departamentos[] = [];
  public pagination: Pagination = new Pagination();
  public filter: Departamentos = new Departamentos();
  elimir: boolean = true;
  searchValue: string | undefined;


  constructor(public server: ServerService, private router: Router, private ui: UiService) { }

  async ngOnInit() {
    this.departamentos = (await this.server.getAllDepartamentos(new Pagination(1, 1000000)))?.items;
  }


  create() {
    this.router.navigate(['departamento']);
  }
  read(id: number) {
    this.router.navigate([`departamento/${id}`]);
}
async remove() {
  const items: any = this.departamentos.filter((x: any) => x.$_select);
  for (const item of items) {
      await this.server.departamentoDelete(item);}
      
  this.ui.messageSuccess(`${items.length} elementos eliminados.`);
  }
 clear(table: Table) {
        table.clear();
        this.searchValue = ''
    }
    async checkableselected(){
       const items: any = this.departamentos.filter((x: any) => x.$_select);
      if(items.length <= 0){
        this.elimir = true;
      }else{
        this.elimir = false;
      }
    }


}
