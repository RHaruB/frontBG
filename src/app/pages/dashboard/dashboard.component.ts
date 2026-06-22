import { Component, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ClienteService } from '../../services/cliente.service';
import { ProductoService } from '../../services/producto.service';
import { FacturaService } from '../../services/factura.service';
import { FacturaResponse } from '../../interfaces/api-models.interface';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  // Get user details
  vendedorName = computed(() => this.authService.currentUserSignal()?.nombre || 'Vendedor');

  totalClientes = 0;
  totalProductos = 0;
  totalFacturas = 0;
  sumaVentas = 0;
  recentInvoices: FacturaResponse[] = [];
  
  isLoading = true;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private clienteService: ClienteService,
    private productoService: ProductoService,
    private facturaService: FacturaService
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.isLoading = true;
    this.errorMessage = '';

    // Fetch stats in parallel
    forkJoin({
      clientes: this.clienteService.getAll('', 1, 1, true),
      productos: this.productoService.getAll('', 1, 1, true),
      facturas: this.facturaService.list({ pagina: 1, registrosPorPagina: 5 })
    }).subscribe({
      next: (res) => {
        this.isLoading = false;
        
        // Populate counts from pagination
        this.totalClientes = res.clientes.paginacion?.totalRegistros || 0;
        this.totalProductos = res.productos.paginacion?.totalRegistros || 0;
        
        if (res.facturas && res.facturas.datos) {
          this.recentInvoices = res.facturas.datos;
          this.totalFacturas = res.facturas.paginacion?.totalRegistros || 0;
          
          // Let's sum totals if available or make a guess based on recent ones.
          // Since we paginate, we'll request a summary or estimate sales based on the loaded ones.
          // To be precise, we can sum the total of the recent invoices for visual presentation.
          this.sumaVentas = res.facturas.datos.reduce((acc, current) => acc + (current.total || 0), 0);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'No se pudieron cargar algunas estadísticas. Asegúrese de que el backend y la base de datos estén activos.';
        console.error(err);
      }
    });
  }
}
