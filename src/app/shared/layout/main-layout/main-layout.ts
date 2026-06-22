import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '@features/auth/services/auth.service';

interface MenuItem {
    label: string;
    icon: string;
    route?: string;
    expanded?: boolean;
    children?: MenuItem[];
}

import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
    selector: 'app-main-layout',
    standalone: true,
    imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, ToastModule, ConfirmDialogModule],
    templateUrl: './main-layout.html',
    styleUrl: './main-layout.css'
})
export class MainLayout {
    private authService = inject(AuthService);
    private router = inject(Router);

    isSidebarCollapsed = signal(false);
    userName = signal('Usuario');

    constructor() {
        const usuario = this.authService.obtenerUsuario();
        if (usuario) {
            this.userName.set(usuario.nombre);
        }
    }

    menuItems: MenuItem[] = [
        {
            label: 'Usuarios',
            icon: 'pi pi-users',
            route: '/usuarios'
        },
        {
            label: 'Clientes',
            icon: 'pi pi-address-book',
            route: '/clientes'
        },
        {
            label: 'Productos',
            icon: 'pi pi-box',
            route: '/productos'
        },
        {
            label: 'Facturas',
            icon: 'pi pi-file-edit',
            expanded: false,
            children: [
                {
                    label: 'Listado',
                    icon: 'pi pi-list',
                    route: '/facturas'
                },
                {
                    label: 'Nueva Factura',
                    icon: 'pi pi-plus',
                    route: '/facturas/nueva'
                }
            ]
        }
    ];

    toggleSidebar() {
        this.isSidebarCollapsed.set(!this.isSidebarCollapsed());
    }

    toggleSubmenu(item: MenuItem) {
        if (item.children) {
            item.expanded = !item.expanded;
        }
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}
