import { Component, OnInit } from '@angular/core';
import { ServerService } from 'src/app/services/server';
import { Router } from '@angular/router';
import { Users } from 'src/app/models/users';
import { Pagination } from 'src/app/models/pagination.model';
import { Departamentos } from 'src/app/models/departamentos';
import { Roles } from 'src/app/models/roles';
import { Cargos } from 'src/app/models/cargos';
import { UiService } from 'src/app/services/ui.service';



@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  public users: Users[] = [];
  public departamentos: Departamentos[] = [];
  public roles: Roles[] = [];
  public cargos: Cargos[] = [];
  public filter: Users = new Users();
  public pagination: Pagination = new Pagination();

  constructor(public server: ServerService, private router: Router , private ui: UiService) { }
 

  ngOnInit(): void {
    this.search();
    this.getDepartamentos();
    this.getCargos();
  }
  read(id: string) {
    this.router.navigate([`user/${id}`]);
}
create() {
  this.router.navigate(['user']);
}
async search(pagination: Pagination = new Pagination) {
  this.pagination.page = pagination.page;

  let resultado = await this.server.getAllUsers(this.pagination);
  this.users = resultado.items;
  this.pagination.refresh(resultado.count);
  console.log(resultado);
}

async remove() {
  const items: any = this.users.filter((x: any) => x.$_select);
  for (const item of items) {
      await this.server.logicDeleteusers(item);
  }

  this.search();

  this.ui.messageSuccess(`${items.length} elementos eliminados.`);
}

  async getUsers() {
    this.users = (await this.server.getAllUsers(new Pagination(1, 1000)))?.items;
    console.log(this.users);
  }
  async getDepartamentos() {
    this.departamentos = (await this.server.getAllDepartamentos(new Pagination(1, 1000)))?.items;
    console.log(this.departamentos);
  }
  async getCargos() {
    this.cargos = (await this.server.getAllCargos(new Pagination(1, 1000)))?.items;
    console.log(this.cargos);
  }

}
