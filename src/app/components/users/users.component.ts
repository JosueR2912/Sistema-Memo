import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { ServerService } from 'src/app/services/server';
import { Router } from '@angular/router';
import { Users } from 'src/app/models/users';
import { Pagination } from 'src/app/models/pagination.model';
import { Departamentos } from 'src/app/models/departamentos';
import { Roles } from 'src/app/models/roles';
import { Cargos } from 'src/app/models/cargos';
import { UiService } from 'src/app/services/ui.service';
import { Table } from 'primeng/table';



@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  public users: Users[] = [];
  public usersInf: any[] = [];
  public departamentos: Departamentos[] = [];
  public roles: Roles[] = [];
  public cargos: Cargos[] = [];
  public filter: Users = new Users();
  public pagination: Pagination = new Pagination();
   searchValue: string | undefined;
  
   elimir: boolean = true;

    

  constructor(public server: ServerService, private router: Router , private ui: UiService, private cd: ChangeDetectorRef) { }
 

  async ngOnInit(){
    this.usersInf = await this.server.getUsersInf();
    this.cd.detectChanges();
    await this.checkableselected();
    
    console.log(this.usersInf);
  }
  read(id: string) {
    this.router.navigate([`user/${id}`]);
}
create() {
  this.router.navigate(['user']);
}

async remove() {
  const items: any = this.usersInf.filter((x: any) => x.$_select);
  for (const item of items) {
      await this.server.logicDeleteusers(item);
  }

  this.ui.messageSuccess(`${items.length} elementos eliminados.`);
}


  clear(table: Table) {
        table.clear();
        this.searchValue = ''
    }
    async checkableselected(){
       const items: any = this.usersInf.filter((x: any) => x.$_select);
      if(items.length <= 0){
        this.elimir = true;
      }else{
        this.elimir = false;
      }
    }

}
