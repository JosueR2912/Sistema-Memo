import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Users } from 'src/app/models/users';
import { clone } from 'src/app/services';
import { ServerService } from 'src/app/services/server';
import { UiService } from 'src/app/services/ui.service';
import { Cargos } from 'src/app/models/cargos';
import { Roles } from 'src/app/models/roles';
import { Pagination } from 'src/app/models/pagination.model';
import { Departamentos } from 'src/app/models/departamentos';
import { Firma } from 'src/app/models/firmas';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  public cargos: Cargos[] = [];
  public roles: Roles[] = [];
  public departamentos: Departamentos[] = [];
  public id: string = '';
  public body: Users = new Users();
  public cache: Users = new Users();
  public editable: boolean = true;
  public form!: FormGroup;
  public firmas: Firma[] = [];
  public firma: Firma= new Firma();

  constructor(public server: ServerService,
    private ui: UiService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

 async ngOnInit() {
   this.firmas= (await this.server.getAllFirmas(new Pagination(1, 1000000)))?.items;
    this.departamentos = (await this.server.getAllDepartamentos(new Pagination(1, 1000000)))?.items;
    this.cargos = (await this.server.getAllCargos(new Pagination(1, 1000000)))?.items;
    const params: any = this.activatedRoute.snapshot.params;
    this.id = params.id;

        if (this.id) {
            await this.init();
        }

        this.form = new FormGroup({
          nombre: new FormControl([this.body.nombre, Validators.required]),
          seg_nombre: new FormControl([this.body.seg_nombre, Validators.required]),
          apellido: new FormControl([this.body.apellido, Validators.required]),
          seg_apellido: new FormControl([this.body.seg_apellido, Validators.required]),
          username: new FormControl([this.body.username, Validators.required]),
          password: new FormControl([this.body.password, Validators.required]),
          email: new FormControl([this.body.correo, Validators.required]),
          grado_academico: new FormControl(this.body.grado_academico, Validators.required),
          cargo: new FormControl(this.body.id_cargo, Validators.required),
          role: new FormControl(this.body.id_role, Validators.required),
          departamento: new FormControl([this.body.id_depart, Validators.required]) 
      });
      this.body.id_firma = 1;
  }
  async init() {
    const select = await this.server.getUser(this.id);
    if (select?.response) {

        this.body = clone(select.response[0]);
    }

    this.cache = clone(this.body);
}


async submit() {
  console.log(this.body);
  if (this.form.valid) {
      if (!this.id) {
        const result = await this.server.createUser(this.body);
          if (result) {
              this.ui.messageSuccess('User fue creado con exito');
              console.log(result);
              this.router.navigate([`user/${result}`]);
          }
      } else {
          const result = await this.server.editUser(this.body);
          if (result) {
              this.ui.messageSuccess('User fue actualizado con exito');
              await this.init();
          }
      }
  } else {
      this.touch();
      this.ui.messageError('Por favor rellene los campos');
  }
}

restore() {
//      this.body = new User(clone(this.cache));
//        this.editable = false;
}

list() {
  this.router.navigate(['users']);
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

async onFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  if(target.files){
    const file = target.files[0];
   await this.saveFirma(file)
  }
}

async saveFirma(file:File){
  const nombre = file.name
  const ruta = `../../../../assets/firmas/${nombre}`
  console.log(nombre);
  this.firma.nombre = nombre;
  this.firma.direccion = ruta;
  console.log(this.firma);
    if(this.body.id_firma == 1){
      const result = await this.server.createFirma(this.firma);
      if(result){
        this.body.id_firma = result;
        console.log(result)
        this.ui.messageSuccess('Firma fue creada con exito');
      }
    }else{
      const result = await this.server.editFirma(this.firma);
      if(result){
        this.ui.messageSuccess('Firma fue actualizada con exito');
        console.log(result.id);
        this.body.id_firma = result;
      }
    }
}


}
