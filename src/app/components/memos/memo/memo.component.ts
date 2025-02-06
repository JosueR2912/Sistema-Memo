import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ServerService } from 'src/app/services/server';
import { Memos } from 'src/app/models/memos';
import { Pagination } from 'src/app/models/pagination.model';
import { UiService } from 'src/app/services/ui.service';
import { Departamentos } from 'src/app/models/departamentos';
import { Users } from 'src/app/models/users';
import { Cargos } from 'src/app/models/cargos';
import { Firma } from 'src/app/models/firmas';
import { jsPDF } from "jspdf";

@Component({
  selector: 'app-memo',
  templateUrl: './memo.component.html',
  styleUrls: ['./memo.component.scss']
})
export class MemoComponent implements OnInit {
  public id: string = '';
  public body: Memos = new Memos();
  public firmas: Firma[] = [];
  public cargos: Cargos[] = [];
  public users: Users[] = [];
  public departamentos: Departamentos[] = [];
  public cache: Memos = new Memos();
  public editable: boolean = true;

  constructor(public server: ServerService,
    private ui: UiService,
    private router: Router, private activeRoute: ActivatedRoute) { }

 
  async ngOnInit(){
    this.firmas = (await this.server.getAllFirmas(new Pagination(1, 1000000)))?.items;
    this.cargos = (await this.server.getAllCargos(new Pagination(1, 1000000)))?.items;
    this.departamentos = (await this.server.getAllDepartamentos(new Pagination(1, 1000000)))?.items;
    this.users = (await this.server.getAllUsers(new Pagination(1, 1000000)))?.items;
    const params: any = this.activeRoute.snapshot.params;
    this.id = params.id;
    if (this.id) {
      await this.init();
    }
    await this.ChangeView();
  }

  async init() {
      const select = await this.server.getMemo(this.id);
      if (select?.response) {
        this.body = select.response[0];
        console.log(this.body);
        this.users = (await this.server.getAllUsers(new Pagination(1, 1000000)))?.items;
        this.departamentos = (await this.server.getAllDepartamentos(new Pagination(1, 1000000)))?.items;
      } else {

      }
  }
  getdepartamento(id: number) {
    return this.departamentos.find(x => x.id === id)?.nombre_departamento;
  }
  getUser(id: number) {
    const atentanmente = this.users.find(x => x.id === id);
    return atentanmente?.grado_academico + ' ' + atentanmente?.nombre + ' ' + atentanmente?.apellido;
  }
  getFirma(id: number) {
    let auxUser = this.users.find(x => x.id === id);
    return this.firmas.find(x => x.id === auxUser?.id_firma)?.direccion;
  }
  getCargoUser(id: number) {
    const aux = this.users.find(x => x.id === id);
    const cargo = this.cargos.find(x => x.id === aux?.id_cargo);
    return cargo?.nombre;
  }

  async generatePDF() {
    const doc = new jsPDF();
    doc.addImage("../../../../assets/img/LOGOS CORPOLARA 2.png", 'PNG', 25.4, 10, 55, 10);
    doc.setFontSize(15);
    doc.setFont("Times", "bold");
    doc.text("M E M O R A N D O", 83, 30);
    doc.setFontSize(12);
    doc.text('N° ' + this.body.codigo_memo,25.4, 40);
    let aux = new Date(this.body.fecha);
    if (this.body.copia_para !== 0) {
      doc.text('Para: ' + this.getdepartamento(this.body.toDepartamento),25.4, 45);
      doc.text('Copia para: ' + this.getCopias(),25.4, 50);
      doc.text( 'De: ' + this.getdepartamento(this.body.fromDepartamento),25.4, 55);
      doc.text('Fecha: ' + aux.getDate() + '/' + (aux.getMonth() + 1) + '/' + aux.getFullYear(),25.4, 60);
      doc.text('Asunto: ' + this.body.asunto,25.4, 65);
      doc.setFont("Times", "normal");
      doc.text(this.body.contenido, 30,75);
    } else{
      doc.text('Para: ' + this.getdepartamento(this.body.toDepartamento),25.4, 45);
    doc.text( 'De: ' + this.getdepartamento(this.body.fromDepartamento),25.4, 50);
    doc.text('Fecha: ' + aux.getDate() + '/' + (aux.getMonth() + 1) + '/' + aux.getFullYear(),25.4, 55);
    doc.text('Asunto: ' + this.body.asunto,25.4, 60);
    doc.setFont("Times", "normal");
    doc.text(this.body.contenido, 30,70);
    }
    doc.setFont("Times", "bold");
    doc.text("Atentamente", 90, 220);
    doc.addImage(`${this.getFirma(this.body.id_user)}`, 'PNG', 80, 222, 55, 30);
    doc.text(`${this.getUser(this.body.id_user)}`, 80, 250);
    doc.text(`${this.getCargoUser(this.body.id_user)}`, 98, 255);
    doc.text(`${this.body.redactadoPor}`, 25.4, 262);
    doc.addImage("../../../../assets/img/footerMemo.png", 'PNG', 5, 265, 205, 35);
    doc.save(`Memo_${this.body.codigo_memo}.pdf`);
  }

  async changeStatus() {
    const select = await this.server.editMemo(this.body);
    this.ui.messageSuccess('Status cambiado');
    console.log(select);
  }

  async ChangeView(){
    if(this.server.user.tipo != 'admin' && this.body.id_user != this.server.user.id && this.body.status == 'SIN ATENDER'){
      this.body.status = 'EN PROCESO';
      let select = await this.server.editMemo(this.body);
      console.log(select);
    }
  }
  getCopias(){
    let aux = this.body.copia_para.split(',');
    let texto = '';
    for (const copia of aux) {
      texto += `${this.getdepartamento(parseInt(copia))}, `;
    }
    return texto.slice(0, -2);
    
  }

}