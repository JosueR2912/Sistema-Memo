import { Component, OnInit} from '@angular/core';
import { ServerService } from 'src/app/services/server';

import { Memos } from 'src/app/models/memos';
import { Departamentos } from 'src/app/models/departamentos';
import { Pagination } from 'src/app/models/pagination.model';
import { Users } from 'src/app/models/users';
import { Cargos } from 'src/app/models/cargos';
import { Chart, registerables } from 'chart.js';




Chart.register(...registerables);
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public chart:any
  public memos: Memos[] = [];
  public users: Users[] = [];
  public cargos: Cargos[] = [];
  public departamentos: Departamentos[] = [];
  public date: Date = new Date();


  constructor(public server: ServerService) { }

 async ngOnInit() {
   await this.getMemos();
   await this.getDepartamentos();
   await this.getUsers();
   await this.getCargos();
   console.log(this.memos);
   console.log(this.departamentos);
   if (this.server.user?.tipo == 'admin') {
    await this.generateChart();
   }else{
    await this.generateChartuser();
    await this.generateChartuserRec();
   }
  }


   async generateChart() {
    this.chart = new Chart("myChart", {
      type: 'bar', 
      data: {
        labels: ["Total"],
           datasets: [
          {
            label: "Atendidos",
            data: [`${this.getMemosStatus("ATENDIDO")}`],
            backgroundColor: 'green'
          },
          {
            label: "Pendientes",
            data: [`${this.getMemosStatus("EN PROCESO")}`],
            backgroundColor: 'yellow'
          },
          {
            label: "Sin atender",
            data: [`${this.getMemosStatus("SIN ATENDER")}`],
            backgroundColor: 'red'
          }
        ]
      },
      options: {
        aspectRatio:1
      }

    });
   }
  async getMemos() {
    this.memos = (await this.server.getAllMemos(new Pagination(1, 1000)))?.items;
  }
  async getDepartamentos() {
    this.departamentos = (await this.server.getAllDepartamentos(new Pagination(1, 1000000)))?.items;
  }
  async getUsers() {
    this.users = (await this.server.getAllUsers(new Pagination(1, 1000000)))?.items;
  }
  async getCargos() {
    this.cargos = (await this.server.getAllCargos(new Pagination(1, 1000000)))?.items;
  }


   getMemosStatus(status: string){
   let auxCont = [];
    for (const memo of this.memos) {
      if(memo.status == status){
        auxCont.push(memo);
      }
    }
    return auxCont.length;
  }

  //code for user normal

getMemosUser(){
  let auxCont = [];
  for (const memo of this.memos) {
    if(memo.id_user == this.server.user?.id){
      auxCont.push(memo);
    }
  }
  return auxCont.length;
}

getMemosStatusUser(status: string){
  let auxCont = [];
  for (const memo of this.memos) {
    if(memo.id_user == this.server.user?.id && memo.status == status){
      auxCont.push(memo);
    }
  }
  return auxCont.length;
}
async generateChartuser() {
  this.chart = new Chart("myChartUSer", {
    type: 'bar', 
    data: {
      labels: ["Total"],
         datasets: [
        {
          label: "Atendidos",
          data: [`${this.getMemosStatusUser("ATENDIDO")}`],
          backgroundColor: 'green'
        },
        {
          label: "Pendientes",
          data: [`${this.getMemosStatusUser("EN PROCESO")}`],
          backgroundColor: 'yellow'
        },
        {
          label: "Sin atender",
          data: [`${this.getMemosStatusUser("SIN ATENDER")}`],
          backgroundColor: 'red'
        }
      ]
    },
    options: {
      aspectRatio:1
    }
})
}

getMemosUserRec(){
  let auxCont = [];
  for (const memo of this.memos) {
    if(memo.toDepartamento == this.server.user?.id_depart){
      auxCont.push(memo);
    }
}
  return auxCont.length;
}

getMemosStatusUserRec(status: string){
  let auxCont = [];
  for (const memo of this.memos) {
    if(memo.toDepartamento == this.server.user?.id_depart && memo.status == status){
      auxCont.push(memo);
    }
  }
return auxCont.length;
}
async generateChartuserRec() {
  this.chart = new Chart("myChartUSerRec", {
    type: 'bar', 
    data: {
      labels: ["Total"],
         datasets: [
        
        {
          label: "Atendidos",
          data: [`${this.getMemosStatusUserRec("ATENDIDO")}`],
          backgroundColor: 'green'
        },
        {
          label: "Pendientes",
          data: [`${this.getMemosStatusUserRec("EN PROCESO")}`],
          backgroundColor: 'yellow'
        },
        {
          label: "Sin atender",
          data: [`${this.getMemosStatusUserRec("SIN ATENDER")}`],
          backgroundColor: 'red'
        }
      ]
    },
    options: {
      aspectRatio:1
    }
})
}



}
