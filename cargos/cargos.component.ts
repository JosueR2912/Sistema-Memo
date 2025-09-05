import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServerService } from 'src/app/services/server';
import { Pagination } from 'src/app/models/pagination.model';
import { Cargos } from 'src/app/models/cargos';
import { UiService } from 'src/app/services/ui.service';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-cargos',
  templateUrl: './cargos.component.html',
  styleUrls: ['./cargos.component.scss']
})
export class CargosComponent implements OnInit {
  public cargos: Cargos[] = [];
  public pagination: Pagination = new Pagination();
  public filter: Cargos = new Cargos();
   searchValue: string | undefined;
  
   elimir: boolean = true;


  constructor(public server: ServerService, private router: Router, private ui: UiService) { }

  ngOnInit(): void {
    this.search();
  }
  async search(pagination: Pagination = new Pagination) {
    this.pagination.page = pagination.page;
    let resultado = await this.server.getAllCargos(this.pagination);
    this.cargos = resultado.items;
    this.pagination.refresh(resultado.count);
    console.log(resultado);
  }
  create() {
    this.router.navigate(['cargo']);
  }
  read(id: string) {
    this.router.navigate([`cargo/${id}`]);
  }
  async remove() {
    const items: any = this.cargos.filter((x: any) => x.$_select);
    for (const item of items) {
        await this.server.cargoDelete(item);
    }
    this.search();

    this.ui.messageSuccess(`${items.length} elementos eliminados.`);
  }
 clear(table: Table) {
         table.clear();
         this.searchValue = ''
     }
     async checkableselected(){
        const items: any = this.cargos.filter((x: any) => x.$_select);
       if(items.length <= 0){
         this.elimir = true;
       }else{
         this.elimir = false;
       }
     }

}
