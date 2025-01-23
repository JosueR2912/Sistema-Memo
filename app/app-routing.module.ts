import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AuthenticableGuard, LoginGuard } from './services/authenticable.guard';
import { HomeComponent } from './components/home/home.component';
import { UsersComponent} from './components/users/users.component';
import { UserComponent } from './components/users/user/user.component';
import { DepartamentosComponent } from './components/departamentos/departamentos.component';
import { DepartamentoComponent } from './components/departamentos/departamento/departamento.component';
import { CargosComponent } from './components/cargos/cargos.component';
import { CargoComponent } from './components/cargos/cargo/cargo.component';
import { MemosComponent } from './components/memos/memos.component';
import { MemoComponent } from './components/memos/memo/memo.component';
import { MemoCreateComponent } from './components/memos/memo-create/memo-create.component';
import { MemosEnvComponent } from './components/memos/memos-env/memos-env.component';
import { ReporteComponent } from './components/reporte/reporte.component';

const routes: Routes = [
    {path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
    { path: '', component: HomeComponent, canActivate: [AuthenticableGuard] },
    { path: 'users', component: UsersComponent, canActivate: [AuthenticableGuard] },
    {path: 'user', component: UserComponent, canActivate: [AuthenticableGuard] },
    {path: 'user/:id', component: UserComponent, canActivate: [AuthenticableGuard] },
    {path: 'departamentos', component: DepartamentosComponent, canActivate: [AuthenticableGuard] },
    {path: 'departamento', component: DepartamentoComponent, canActivate: [AuthenticableGuard] },
    {path: 'departamento/:id', component: DepartamentoComponent, canActivate: [AuthenticableGuard] },
    {path: 'cargos', component: CargosComponent, canActivate: [AuthenticableGuard] },
    {path: 'cargo', component: CargoComponent, canActivate: [AuthenticableGuard] },
    {path: 'cargo/:id', component: CargoComponent, canActivate: [AuthenticableGuard] },
    {path: 'memos', component: MemosComponent, canActivate: [AuthenticableGuard] },
    {path: 'memo/:id', component: MemoComponent, canActivate: [AuthenticableGuard] },
    {path: 'memoCreate', component: MemoCreateComponent, canActivate: [AuthenticableGuard] },
    {path: 'memoCreate/:id', component: MemoCreateComponent, canActivate: [AuthenticableGuard] },
    {path: 'memoEnv', component:  MemosEnvComponent, canActivate: [AuthenticableGuard] },
    {path: 'reporte', component: ReporteComponent, canActivate: [AuthenticableGuard] }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
