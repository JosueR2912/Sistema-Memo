import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Sidebar } from 'primeng/sidebar';
import { ServerService } from 'src/app/services/server';


@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
    public items: MenuItem[] = [];
    public itemsUser: MenuItem[] = [];
    sidebarVisible: boolean = false;

    @ViewChild('sidebarRef') sidebarRef!: Sidebar;

    closeCallback(e: Event): void {
        this.sidebarRef.close(e);
    }


    constructor(public server: ServerService, private router: Router) { }
    
    ngOnInit() {
        console.log(this.server.user);
        this.itemsUser = [
            {
                label: 'Configuracion',
                icon: 'pi pi-fw pi-cog',
                routerLink: `/user/${this.server.user?.id}`
            },
            {
                label: 'Salir',
                icon: 'pi pi-fw pi-sign-out',
                command: ((() => {
                    this.server.logout();
                    this.router.navigate(['login']);
                }).bind(this))
            }
        ]
        this.items = this.server.user?.tipo === 'admin' ? [
            {
                items:[{
                    label: 'Inicio',
                    icon: 'pi pi-fw pi-home',
                    routerLink: '/'}
                ]
                
            },
            {
                label: 'Usuarios',
                icon: 'pi pi-fw pi-user',
                items: [
                    {
                        label: 'Lista de usuarios',
                        icon: 'pi pi-list',
                        routerLink: '/users'
                    },
                    {
                        label: 'Crear',
                        icon: 'pi pi-user',
                        routerLink: '/user'
                    },
                ]
            },
            {
                label: 'Departamentos',
                icon: 'pi pi-fw pi-building',
                items: [
                    {
                        label: 'Lista de departamentos',
                        icon: 'pi pi-list',
                        routerLink: '/departamentos'
                    },
                    {
                        label: 'Crear',
                        icon: 'pi pi-file-plus',
                        routerLink: '/departamento'
                    },
                ]
            },
            {
                label: 'Cargos',
                icon: 'pi pi-fw pi-briefcase',
                items: [
                    {
                        label: 'Lista',
                        icon: 'pi pi-list',
                        routerLink: '/cargos'
                    },
                    {
                        label: 'Crear',
                        icon: 'pi pi-file-plus',
                        routerLink: '/cargo'
                    },
                ]
            },
            {
                label: 'Memos',
                icon: 'pi pi-fw pi-dollar',
                routerLink: '/memos',
                items: [
                    {
                        label: 'Memos Generales',
                        icon: 'pi pi-fw pi-align-left',
                        routerLink: '/memos'
                    },
                    {
                        label: 'Reporte Memos',
                        icon: 'pi pi-file-export pi-align-left',
                        routerLink: '/reporte'
                    },
                ]
            },
            {
                label: 'Profile',
                icon: 'pi pi-fw pi-power-off',
                items:[{
                    label: 'Configuracion de Usuario',
                    icon: 'pi pi-fw pi-cog',
                    routerLink: `/user/${this.server.user?.id}`
                },{
                    label: 'Salir',
                    icon: 'pi pi-fw pi-sign-out',
                    command: ((() => {
                        this.server.logout();
                        this.router.navigate(['login']);
                    }).bind(this))
                }]}
        ] : this.server.user?.tipo === 'normal' ? [
            {
                items:[{
                    label: 'Inicio',
                    icon: 'pi pi-fw pi-home',
                    routerLink: '/'}
                ]
                
            },
            {
                label: 'Memos',
                icon: 'pi pi-fw pi-user',
                items: [
                    {
                    label: 'Eviar nuevo memo',
                    icon: 'pi pi-send',
                    routerLink: '/memoCreate'
                    },
                    {
                        label: 'Memos Recibidos',
                        icon: 'pi pi-inbox',
                        routerLink: '/memos'
                    },
                    {
                        label: 'Memos Enviados',
                        icon: 'pi pi-list',
                        routerLink: '/memoEnv'
                    },
                ]
            },
            {
                label: 'Profile',
                icon: 'pi pi-fw pi-power-off',
                items:[{
                    label: 'Configuracion de Usuario',
                    icon: 'pi pi-fw pi-cog',
                    routerLink: `/user/${this.server.user?.id}`
                },{
                    label: 'Salir',
                    icon: 'pi pi-fw pi-sign-out',
                    command: ((() => {
                        this.server.logout();
                        this.router.navigate(['login']);
                    }).bind(this))
                }]}
        ] : [  {
            label: 'Inicio',
            icon: 'pi pi-fw pi-home',
            routerLink: '/'
        },
            {
                label: 'Salir',
                icon: 'pi pi-fw pi-power-off',
                command: ((() => {
                    this.server.logout();
                    this.router.navigate(['login']);
                }).bind(this))
            }
        ];
    }
}
