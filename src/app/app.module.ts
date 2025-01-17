import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {InputTextModule} from 'primeng/inputtext';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {TableModule} from 'primeng/table';
import {DropdownModule} from 'primeng/dropdown';
import {MultiSelectModule} from 'primeng/multiselect';
import {MenubarModule} from 'primeng/menubar';
import {ToastModule} from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import {CheckboxModule} from 'primeng/checkbox';
import {DialogModule} from 'primeng/dialog';
import { NavbarComponent } from './components/ui/navbar/navbar.component';
import { PaginatorComponent } from './components/ui/paginator/paginator.component';
import { MessageService } from 'primeng/api';
import { LoginComponent } from './components/login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './components/home/home.component';
import { UsersComponent } from './components/users/users.component';
import { UserComponent } from './components/users/user/user.component';
import { SidebarModule } from 'primeng/sidebar';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { StyleClassModule } from 'primeng/styleclass';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { DepartamentosComponent } from './components/departamentos/departamentos.component';
import { DepartamentoComponent } from './components/departamentos/departamento/departamento.component';
import { CargosComponent } from './components/cargos/cargos.component';
import { CargoComponent } from './components/cargos/cargo/cargo.component';
import { MemosComponent } from './components/memos/memos.component';
import { MemoCreateComponent } from './components/memos/memo-create/memo-create.component';
import { MemoComponent } from './components/memos/memo/memo.component';
import { MemosEnvComponent } from './components/memos/memos-env/memos-env.component';
import { ReporteComponent } from './components/reporte/reporte.component';
import { MessageModule } from 'primeng/message';

@NgModule({
    declarations: [
        AppComponent,
        NavbarComponent,
        PaginatorComponent,
        LoginComponent,
        HomeComponent,
        UsersComponent,
       UserComponent,
       DepartamentosComponent,
       DepartamentoComponent,
       CargosComponent,
       CargoComponent,
       MemosComponent,
       MemoCreateComponent,
       MemoComponent,
       MemosEnvComponent,
       ReporteComponent
       
    ],
    imports: [
        MessageModule,
        TieredMenuModule,
        MenuModule,
        SidebarModule,
        ButtonModule,
        RippleModule,
        AvatarModule,
        StyleClassModule,
        TagModule,
        BrowserModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        AppRoutingModule,
        FormsModule,
        SidebarModule,
        CommonModule,
        InputTextModule,
        InputTextareaModule,
        TableModule,
        DropdownModule,
        MultiSelectModule,
        MenubarModule,
        ToastModule,
        CheckboxModule,
        DialogModule,
        HttpClientModule
    ],
    providers: [MessageService],
    bootstrap: [AppComponent],
    schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
