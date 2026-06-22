import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './components/layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ClientesComponent } from './pages/clientes/clientes.component';
import { ProductosComponent } from './pages/productos/productos.component';
import { FacturasListComponent } from './pages/facturas/facturas-list/facturas-list.component';
import { FacturaNuevaComponent } from './pages/facturas/factura-nueva/factura-nueva.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'clientes', component: ClientesComponent },
      { path: 'productos', component: ProductosComponent },
      { path: 'facturas', component: FacturasListComponent },
      { path: 'facturas/nueva', component: FacturaNuevaComponent },
      { path: 'usuarios', component: UsuariosComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
