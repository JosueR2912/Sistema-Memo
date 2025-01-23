import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Departamentos } from 'src/app/models/departamentos';
import { clone } from 'src/app/services';
import { ServerService } from 'src/app/services/server';
import { UiService } from 'src/app/services/ui.service';


@Component({
  selector: 'app-departamento',
  templateUrl: './departamento.component.html',
  styleUrls: ['./departamento.component.scss']
})
export class DepartamentoComponent implements OnInit {
  public departamentos: Departamentos[] = [];
  public id: string = '';
  public body: Departamentos = new Departamentos();
  public cache: Departamentos = new Departamentos();
  public editable: boolean = true;
  public form!: FormGroup;

  constructor(public server: ServerService,
    private ui: UiService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

 async ngOnInit(){
    const params: any = this.activatedRoute.snapshot.params;
    this.id = params.id;

    if (this.id) {
      await this.init();
    }

    this.form = new FormGroup({
      nombre: new FormControl([this.body.nombre_departamento, Validators.required]),
      codigo_departamento: new FormControl([this.body.codigo_departamento, Validators.required]),
      status: new FormControl(this.body.status, Validators.required),
    });
  }

  async init() {
    const select = await this.server.getDepartamento(this.id);
    if (select?.response) {

        this.body = clone(select.response[0]);
    }

    this.cache = clone(this.body);
}
async submit() {
  console.log(this.body);
  if (this.form.valid) {
      if (!this.id) {
          const result = await this.server.createDepartamento(this.body);
          if (result) {
              this.ui.messageSuccess('Departamento fue creado con exito');
              console.log(result);
              this.router.navigate([`departamento/${result}`]);
          }
      } else {
          const result = await this.server.editDepartamento(this.body);
          if (result) {
              this.ui.messageSuccess('Departamento fue actualizado con exito');
              await this.init();
          }
      }
  } else {
      this.touch();
      this.ui.messageError('Por favor rellene los campos');
  }
}

list() {
  this.router.navigate(['departamentos']);
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


}
