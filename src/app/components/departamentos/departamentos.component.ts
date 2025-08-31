import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServerService } from 'src/app/services/server';
import { Pagination } from 'src/app/models/pagination.model';
import { Departamentos } from 'src/app/models/departamentos';
import { UiService } from 'src/app/services/ui.service';


@Component({
  selector: 'app-departamentos',
  templateUrl: './departamentos.component.html',
  styleUrls: ['./departamentos.component.scss']
})
export class DepartamentosComponent implements OnInit {
  public departamentos: Departamentos[] = [];
  public pagination: Pagination = new Pagination();
  public filter: Departamentos = new Departamentos();


  constructor(public server: ServerService, private router: Router, private ui: UiService) { }

  ngOnInit(): void {
    this.search();
  }
  async search(pagination: Pagination = new Pagination) {
    this.pagination.page = pagination.page;
  
    let resultado = await this.server.getAllDepartamentos(this.pagination);
    this.departamentos = resultado.items;
    this.pagination.refresh(resultado.count);
    console.log(resultado);
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
      this.search();

  this.ui.messageSuccess(`${items.length} elementos eliminados.`);
  }



}
