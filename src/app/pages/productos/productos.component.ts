import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductoService } from '../../services/producto.service';
import { ProductoResponse, ProductoRequest } from '../../interfaces/api-models.interface';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {
  productos: ProductoResponse[] = [];
  
  // Search & Pagination state
  filtro: string = '';
  paginaActual: number = 1;
  registrosPorPagina: number = 10;
  soloActivos: boolean = true;
  totalRegistros: number = 0;
  totalPaginas: number = 0;

  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  // Modal State
  showModal: boolean = false;
  isEditMode: boolean = false;
  
  // Form State
  formId: number = 0;
  formNombre: string = '';
  formPrecio: number = 0;
  formStock: number = 0;

  constructor(private productoService: ProductoService) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.productoService.getAll(
      this.filtro,
      this.paginaActual,
      this.registrosPorPagina,
      this.soloActivos
    ).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.codigo === 200) {
          this.productos = response.datos;
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
        this.errorMessage = 'Error al cargar los productos del servidor.';
        console.error(err);
      }
    });
  }

  onBuscar(): void {
    this.paginaActual = 1;
    this.cargarProductos();
  }

  onResetFiltros(): void {
    this.filtro = '';
    this.soloActivos = true;
    this.paginaActual = 1;
    this.cargarProductos();
  }

  cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
      this.cargarProductos();
    }
  }

  // Open Modal for Create
  openCreateModal(): void {
    this.isEditMode = false;
    this.showModal = true;
    this.formId = 0;
    this.formNombre = '';
    this.formPrecio = 0;
    this.formStock = 0;
    this.errorMessage = '';
  }

  // Open Modal for Edit
  openEditModal(producto: ProductoResponse): void {
    this.isEditMode = true;
    this.showModal = true;
    this.formId = producto.productoID;
    this.formNombre = producto.nombre;
    this.formPrecio = producto.precioUnitario;
    this.formStock = producto.stockActual;
    this.errorMessage = '';
  }

  closeModal(): void {
    this.showModal = false;
  }

  guardarProducto(): void {
    if (!this.formNombre.trim()) {
      this.errorMessage = 'El nombre del producto es obligatorio.';
      return;
    }
    if (this.formPrecio < 0) {
      this.errorMessage = 'El precio unitario no puede ser negativo.';
      return;
    }
    if (this.formStock < 0) {
      this.errorMessage = 'El stock inicial no puede ser negativo.';
      return;
    }

    const payload: ProductoRequest = {
      id: this.formId,
      nombre: this.formNombre,
      precioUnitario: this.formPrecio,
      stockActual: this.formStock
    };

    const action = this.isEditMode 
      ? this.productoService.edit(payload) 
      : this.productoService.create(payload);

    this.isLoading = true;
    this.errorMessage = '';

    action.subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.codigo === 200) {
          this.successMessage = this.isEditMode 
            ? 'Producto actualizado con éxito.' 
            : 'Producto registrado con éxito.';
          
          this.closeModal();
          this.cargarProductos();

          // Auto clear success message
          setTimeout(() => this.successMessage = '', 3000);
        } else {
          this.errorMessage = response.mensaje;
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.mensaje || 'Error al guardar el producto.';
        console.error(err);
      }
    });
  }

  eliminarProducto(id: number): void {
    if (confirm('¿Está seguro de eliminar/desactivar este producto?')) {
      this.productoService.delete(id).subscribe({
        next: (response) => {
          if (response.codigo === 200) {
            this.successMessage = 'Producto eliminado/desactivado con éxito.';
            this.cargarProductos();
            setTimeout(() => this.successMessage = '', 3000);
          } else {
            alert(response.mensaje);
          }
        },
        error: (err) => {
          console.error(err);
          alert(err.error?.mensaje || 'Error al eliminar el producto.');
        }
      });
    }
  }
}
