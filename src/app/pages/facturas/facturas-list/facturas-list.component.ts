import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FacturaService } from '../../../services/factura.service';
import { ClienteService } from '../../../services/cliente.service';
import { UsuarioService } from '../../../services/usuario.service';
import { 
  FacturaResponse, 
  FacturaFiltroRequest, 
  ClienteResponse, 
  UsuarioResponse 
} from '../../../interfaces/api-models.interface';

@Component({
  selector: 'app-facturas-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './facturas-list.component.html',
  styleUrls: ['./facturas-list.component.css']
})
export class FacturasListComponent implements OnInit {
  facturas: FacturaResponse[] = [];
  clientes: ClienteResponse[] = [];
  vendedores: UsuarioResponse[] = [];

  // Filters state
  filtroNumero: string = '';
  filtroCliente: string = '';
  filtroVendedor: string = '';
  filtroFechaDesde: string = '';
  filtroFechaHasta: string = '';
  filtroMontoDesde?: number;
  filtroMontoHasta?: number;

  // Pagination state
  paginaActual: number = 1;
  registrosPorPagina: number = 10;
  totalRegistros: number = 0;
  totalPaginas: number = 0;

  isLoading: boolean = false;
  errorMessage: string = '';

  // Detail Modal State
  selectedFactura: FacturaResponse | null = null;
  showDetailModal: boolean = false;

  constructor(
    private facturaService: FacturaService,
    private clienteService: ClienteService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.cargarListasFiltro();
    this.cargarFacturas();
  }

  cargarListasFiltro(): void {
    // Load clients (first 50) and sellers (first 50) to populate filter dropdowns
    this.clienteService.getAll('', 1, 50, true).subscribe({
      next: (res) => {
        if (res.codigo === 200) this.clientes = res.datos;
      }
    });

    this.usuarioService.getAll('', 1, 50, true).subscribe({
      next: (res) => {
        if (res.codigo === 200) this.vendedores = res.datos;
      }
    });
  }

  cargarFacturas(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const filtros: FacturaFiltroRequest = {
      pagina: this.paginaActual,
      registrosPorPagina: this.registrosPorPagina,
      numeroFactura: this.filtroNumero.trim() || undefined,
      clienteID: this.filtroCliente ? parseInt(this.filtroCliente) : undefined,
      vendedorID: this.filtroVendedor ? parseInt(this.filtroVendedor) : undefined,
      fechaDesde: this.filtroFechaDesde || undefined,
      fechaHasta: this.filtroFechaHasta || undefined,
      montoDesde: this.filtroMontoDesde !== undefined && this.filtroMontoDesde !== null ? this.filtroMontoDesde : undefined,
      montoHasta: this.filtroMontoHasta !== undefined && this.filtroMontoHasta !== null ? this.filtroMontoHasta : undefined
    };

    this.facturaService.list(filtros).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.codigo === 200) {
          this.facturas = response.datos;
          if (response.paginacion) {
            this.totalRegistros = response.paginacion.totalRegistros;
            this.totalPaginas = response.paginacion.totalPaginas;
          }
        } else {
          this.errorMessage = response.mensaje;
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Error al cargar el listado de facturas.';
        console.error(err);
      }
    });
  }

  onBuscar(): void {
    this.paginaActual = 1;
    this.cargarFacturas();
  }

  onResetFiltros(): void {
    this.filtroNumero = '';
    this.filtroCliente = '';
    this.filtroVendedor = '';
    this.filtroFechaDesde = '';
    this.filtroFechaHasta = '';
    this.filtroMontoDesde = undefined;
    this.filtroMontoHasta = undefined;
    this.paginaActual = 1;
    this.cargarFacturas();
  }

  cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
      this.cargarFacturas();
    }
  }

  openDetailModal(factura: FacturaResponse): void {
    this.isLoading = true;
    this.facturaService.getById(factura.facturaID).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.codigo === 200) {
          this.selectedFactura = res.datos;
          this.showDetailModal = true;
        } else {
          alert(res.mensaje);
        }
      },
      error: (err) => {
        this.isLoading = false;
        alert('Error al cargar detalles de la factura.');
        console.error(err);
      }
    });
  }

  closeDetailModal(): void {
    this.showDetailModal = false;
    this.selectedFactura = null;
  }
}
