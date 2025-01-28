import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ServerService } from 'src/app/services/server';
import { Pagination } from 'src/app/models/pagination.model';
import { Memos } from 'src/app/models/memos';
import { clone } from 'src/app/services';
import { Users } from 'src/app/models/users';
import { Departamentos } from 'src/app/models/departamentos';
import { UiService } from 'src/app/services/ui.service';
import Swal from 'sweetalert2';
import { Cargos } from 'src/app/models/cargos';
import { Firma } from 'src/app/models/firmas';
import { Dialog } from 'primeng/dialog';


@Component({
  selector: 'app-memo-create',
  templateUrl: './memo-create.component.html',
  styleUrls: ['./memo-create.component.scss']
})
export class MemoCreateComponent implements OnInit {
  public pagination: Pagination = new Pagination();
  public memos: Memos[] = [];
  public users: Users[] = [];
  public departamentos: Departamentos[] = [];
  public id: string = '';
  public body: Memos = new Memos();
  public cache: Memos = new Memos();
  public editable: boolean = true;
  public form!: FormGroup;
  public memosFilter: Memos[] = [];
  public countMemos: any = 0;
  public usersFilter: Users[] = [];
  public firmas: any[] = [];
  public cargos: any[] = [];

  constructor(public server: ServerService,
    private ui: UiService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

    visible: boolean = false;

    showDialog() {
        this.visible = true;
    }

  async ngOnInit(){
    this.users = (await this.server.getAllUsers(new Pagination(1, 1000000)))?.items;
    this.firmas = (await this.server.getAllFirmas(new Pagination(1, 1000000)))?.items;
    this.cargos = (await this.server.getAllCargos(new Pagination(1, 1000000)))?.items;
    const params: any = this.activatedRoute.snapshot.params;
    this.id = params.id;
    this.body.toDepartamento = 0;
    this.body.copia_para = 0;

    if (this.id) {
      await this.init();
    }

    this.memos = (await this.server.getAllMemos(new Pagination(1, 1000000)))?.items || [];
    this.departamentos = (await this.server.getAllDepartamentos(new Pagination(1, 1000000)))?.items;
    let aux = [];
    for (const departamento of this.departamentos) {
      if (departamento.status == "activo") {
        aux.push(departamento);
      }
    }
    this.departamentos = aux;
    this.memosFilter = this.memos.filter((x: any) => x.fromDepartamento === this.server.user?.id_depart);
    await this.memosFilterDate();
    console.log(this.memosFilter);
  


    this.form = new FormGroup({
      copia_para:new FormControl(this.body.copia_para),
      asunto: new FormControl([this.body.asunto, Validators.required]),
      contenido: new FormControl(this.body.contenido, Validators.required),
      toDepartamento: new FormControl(this.body.toDepartamento, Validators.required),
    });
    this.body.fecha = new Date();
    this.body.de = this.server.user?.nombre + ' ' + this.server.user?.apellido;
    this.body.id_user = this.server.user?.id;
    this.body.status = "SIN ATENDER";
    this.body.status_delete = 'activo';
    this.body.fromDepartamento = this.server.user?.id_depart;
    this.body.codigo_memo = `${this.departamentos[this.server.user?.id_depart - 1].codigo_departamento}-${this.countMemos.padStart(3, '0')}-${new Date().getFullYear()}`; 
  }

  async init() {
    const select = await this.server.getMemo(this.id);
    if (select?.response) {

       this.router.navigate(['/memo/' + this.id]);
    }

    this.cache = clone(this.body);
}


    async submit() {
      Swal.fire({
        title: "Estas seguro que quieres enviar este memo?",
        showDenyButton: true,
        confirmButtonText: "Enviar",
        denyButtonText: `No enviar`
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          Swal.fire("Enviado!", "", "success");
          this.saveMemo();
        } else if (result.isDenied) {
          Swal.fire("Memo no enviado", "", "info");
        }
      });
    
    }

    list() {
      this.router.navigate(['/memos']);
    }
    touch() {
      for (const k in this.form.controls) {
          this.form.controls[k].markAsTouched();
      }
    }

    hasError(field: string) {
      if (this.form.controls[field]?.touched && this.form.controls[field].errors && this.form.controls[field].errors?.['required']) {
          return field + ' es requerido';
      }
      return null;
    }

  async memosFilterDate(){
      let aux = []
      let fechaAct = new Date();
      for (const memo of this.memosFilter) {
        let fecha = new Date(memo.fecha);
        if(fecha.getFullYear() == fechaAct.getFullYear()){
          aux.push(memo);
        }
      }
      this.countMemos = aux.length + 1;
      this.countMemos = this.countMemos.toString();
      console.log(this.countMemos);
    }

    async saveMemo(){
      if (this.form.valid && this.body.toDepartamento !== 0) {
        if (this.body.copia_para == undefined) {
          this.body.copia_para = 0;
        }
        console.log(this.body);
        console.log(this.body.codigo_memo);
        if (!this.id) {
              const result = await this.server.createMemo(this.body);
              if (result) {
                  this.ui.messageSuccess('Memo enviado con exito');
                  console.log(result);
                  this.router.navigate([`memo/${result}`]);
              }
          } 
      } else {
          this.touch();
          this.ui.messageError('Por favor rellene los campos');
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
   
  }


