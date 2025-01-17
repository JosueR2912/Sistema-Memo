import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Cargos } from 'src/app/models/cargos';
import { clone } from 'src/app/services';
import { ServerService } from 'src/app/services/server';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-cargo',
  templateUrl: './cargo.component.html',
  styleUrls: ['./cargo.component.scss']
})
export class CargoComponent implements OnInit {
  public cargos: Cargos[] = [];
  public id: string = '';
  public body: Cargos = new Cargos();
  public cache: Cargos = new Cargos();
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
      nombre: new FormControl([this.body.nombre, Validators.required]),
      status: new FormControl(this.body.status, Validators.required),
    });
  }
  async init() {
    const select = await this.server.getCargo(this.id);
    if (select?.response) {

        this.body = clone(select.response[0]);
    }

    this.cache = clone(this.body);
}
async submit() {
  console.log(this.body);
  if (this.form.valid) {
      if (!this.id) {
          const result = await this.server.createCargo(this.body);
          if (result) {
              this.ui.messageSuccess('Cargo fue creado con exito');
              console.log(result);
              this.router.navigate([`cargo/${result}`]);
          }
      } else {
          const result = await this.server.editCargo(this.body);
          if (result) {
              this.ui.messageSuccess('Cargo fue actualizado con exito');
              await this.init();
          }
      }
  } else {
      this.touch();
      this.ui.messageError('Por favor rellene los campos');
  }
}

list() {
  this.router.navigate(['cargos']);
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
