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
  getProvidencia(id:number):any{
    return this.users.find(x => x.id == id)?.providencia;
  }

  async generatePDF() {
    const doc = new jsPDF({
      format:"letter"
    });
    doc.addImage("../../../../assets/img/CINTILLO SUPERIOR - HOJA MEMBRETADA.png", 'PNG', 25, 5, 175, 15);
    doc.setFontSize(15);
    doc.setFont("Times", "bold");
    doc.text("M E M O R A N D O", 83, 30);
    doc.setFontSize(12);
    doc.text('N° ' + this.body.codigo_memo,25.4, 40);
    let aux = new Date(this.body.fecha);
    if (this.body.copia_para !== 0 && this.getCopias()!= "undefined") {
      doc.text('Para: ' + this.getdepartamento(this.body.toDepartamento),25.4, 45);
      let ymain = 45;
      let copias = doc.splitTextToSize('Copia para: ' + this.getCopias(), doc.internal.pageSize.width - 48);
      for(let i = 0; i < copias.length; i++){
        ymain += 5;
        doc.text(copias[i],25.4,ymain);
      }
      //doc.text(copias,25.4, 50);
      doc.text( 'De: ' + this.getdepartamento(this.body.fromDepartamento),25.4, ymain + 5);
      doc.text('Fecha: ' + aux.getDate() + '/' + (aux.getMonth() + 1) + '/' + aux.getFullYear(),25.4, ymain + 10);
      doc.text('Asunto: ' + this.body.asunto,25.4, ymain + 15);
      doc.setFont("Times", "normal");
      let lines = doc.splitTextToSize(this.body.contenido, doc.internal.pageSize.width - 48);
      let y = ymain + 25;
    // for(let i = 0; i < lines.length; i++){
    //   if(y > 180){
    //     doc.addImage("../../../../assets/img/LOGOS CORPOLARA 2.png", 'PNG', 25.4, 10, 55, 10);
    //     doc.addImage("../../../../assets/img/footerMemo.png", 'PNG', 5, 245, 205, 35);
    //     doc.addPage();
    //     y = 50;
    //   }
    //   doc.text(lines[i], 30, y);
    //   y += 5;}
    await this.formatText(lines, doc, y);
    } else{
    doc.text('Para: ' + this.getdepartamento(this.body.toDepartamento),25.4, 45);
    doc.text( 'De: ' + this.getdepartamento(this.body.fromDepartamento),25.4, 50);
    doc.text('Fecha: ' + aux.getDate() + '/' + (aux.getMonth() + 1) + '/' + aux.getFullYear(),25.4, 55);
    doc.text('Asunto: ' + this.body.asunto,25.4, 60);
    doc.setFont("Times", "normal");
    let lines = doc.splitTextToSize(this.body.contenido, doc.internal.pageSize.width - 48);
    let y = 70;
    // for(let i = 0; i < lines.length; i++){
    //   if(y > 180){
    //     doc.addImage("../../../../assets/img/LOGOS CORPOLARA 2.png", 'PNG', 25.4, 10, 55, 10);
    //     doc.addImage("../../../../assets/img/footerMemo.png", 'PNG', 5, 245, 205, 35);
    //     doc.addPage();
    //     y = 50;
    //   }
    //   doc.text(lines[i], 30, y);
    //   y += 5;
    // }
    await this.formatText(lines, doc, y);
    
    }
    doc.setFont("Times", "bold");
    doc.text("Atentamente", 95, 185);
    doc.addImage(`${this.getFirma(this.body.id_user)}`, 'PNG', 85, 187, 55, 30);
    let cargo = doc.getTextWidth(`${this.getCargoUser(this.body.id_user)}`);
    let nombre = doc.getTextWidth(`${this.getUser(this.body.id_user)}`);
    let xcargo = (doc.internal.pageSize.width - cargo) / 2;
    let xnombre = (doc.internal.pageSize.width - nombre) / 2;
    doc.text(`${this.getUser(this.body.id_user)}`, xnombre, 215);
    doc.text(`${this.getCargoUser(this.body.id_user)}`, xcargo, 220);
    let lines = doc.splitTextToSize(`Segun Providencia Administrativa ${this.getProvidencia(this.body.id_user)}`, doc.internal.pageSize.width - 80);
    doc.text(`${this.body.redactadoPor}`, 25.4, 240);
    doc.setFontSize(8)
    let y = 225
    let x= 65
    if(this.getProvidencia(this.body.id_user) != ''){
      for(let i = 0;i < lines.length; i++ ){
        let aux = doc.getTextWidth(lines[i]);
        let auxX = (doc.internal.pageSize.width - aux) / 2;
       // if(i == 2){
        // doc.text(lines[i],x + 23 ,y)
        //}else{
         // doc.text(lines[i], x, y);
        //}
        doc.text(lines[i], auxX,y);
        y += 5
        //x -= 2 
       }
    }
    
   
    doc.addImage("../../../../assets/img/CINTILLO 2.png", 'PNG', 0, 245, 220, 35);
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
    if(aux[0] != "0" || aux[0] != ""){
      for (const copia of aux) {
        texto += `${this.getdepartamento(parseInt(copia))}, `;
      }
      return texto.slice(0, -2);
    }
    return texto
   
    
  }

async formatText(text:string, doc:any, y:number){
   let lines = doc.splitTextToSize(text, doc.internal.pageSize.width - 48);
  let textAux: string[] = [''];
  let auxCountline = 0;
  let countPage = 0;
  const initialY = y; // Guarda la posición Y inicial

  for (let i = 0; i < lines.length; i++) {
    if (y < 180) {
      textAux[countPage] += lines[auxCountline]; // Agrega una nueva línea
      auxCountline++;
    } else {
      // Agrega imágenes antes de cambiar de página
      doc.addImage("../../../../assets/img/CINTILLO 2.png", 'PNG', 0, 245, 220, 35);
      doc.addImage("../../../../assets/img/CINTILLO SUPERIOR - HOJA MEMBRETADA.png", 'PNG', 25, 5, 175, 15);
      doc.addPage();

      // Incrementa el contador de páginas
      countPage++;
      y = initialY; // Reinicia la posición Y al comienzo de la nueva página
      textAux[countPage] = ''; // Inicia una nueva línea para la nueva página
      textAux[countPage] += lines[auxCountline]; // Agrega la línea actual
      auxCountline++;
    }
    y += 5; // Incrementa la posición Y
  }

  // Justificar el texto en cada página
  for (let i = 0; i <= countPage; i++) {
    doc.setPage(i + 1); // Cambia a la página correspondiente
    // Reinicia Y al valor inicial para cada página
    let currentY = initialY;
    if(i > 0 ){
      currentY = 30;
    } 
    doc.text(textAux[i], 25.4, currentY, { align: 'justify', maxWidth: doc.internal.pageSize.width - 48, lineHeightFactor: 1.5 });
    currentY += 5 * textAux[i].split('\n').length; // Actualiza la posición Y para la próxima línea si es necesario
  }
}

}