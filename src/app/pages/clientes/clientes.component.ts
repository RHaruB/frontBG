import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../../services/cliente.service';
import { ClienteResponse, ClienteRequest } from '../../interfaces/api-models.interface';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {
  clientes: ClienteResponse[] = [];
  
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
  formIdentificacion: string = '';
  formNombre: string = '';
  formTelefono: string = '';
  formEmail: string = '';

  constructor(private clienteService: ClienteService) {}

  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.clienteService.getAll(
      this.filtro,
      this.paginaActual,
      this.registrosPorPagina,
      this.soloActivos
    ).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.codigo === 200) {
          this.clientes = response.datos;
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
        this.errorMessage = 'Error al cargar los clientes del servidor.';
        console.error(err);
      }
    });
  }

  onBuscar(): void {
    this.paginaActual = 1;
    this.cargarClientes();
  }

  onResetFiltros(): void {
    this.filtro = '';
    this.soloActivos = true;
    this.paginaActual = 1;
    this.cargarClientes();
  }

  cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
      this.cargarClientes();
    }
  }

  // Open Modal for Create
  openCreateModal(): void {
    this.isEditMode = false;
    this.showModal = true;
    this.formId = 0;
    this.formIdentificacion = '';
    this.formNombre = '';
    this.formTelefono = '';
    this.formEmail = '';
    this.errorMessage = '';
  }

  // Open Modal for Edit
  openEditModal(cliente: ClienteResponse): void {
    this.isEditMode = true;
    this.showModal = true;
    this.formId = cliente.clienteID;
    this.formIdentificacion = cliente.identificacion;
    this.formNombre = cliente.nombre;
    this.formTelefono = cliente.telefono || '';
    this.formEmail = cliente.email || '';
    this.errorMessage = '';
  }

  closeModal(): void {
    this.showModal = false;
  }

  guardarCliente(): void {
    if (!this.formIdentificacion.trim() || !this.formNombre.trim()) {
      this.errorMessage = 'La identificación y el nombre son campos obligatorios.';
      return;
    }

    const payload: ClienteRequest = {
      id: this.formId,
      identificacion: this.formIdentificacion,
      nombre: this.formNombre,
      telefono: this.formTelefono,
      email: this.formEmail
    };

    const action = this.isEditMode 
      ? this.clienteService.edit(payload) 
      : this.clienteService.create(payload);

    this.isLoading = true;
    this.errorMessage = '';

    action.subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.codigo === 200) {
          this.successMessage = this.isEditMode 
            ? 'Cliente actualizado con éxito.' 
            : 'Cliente registrado con éxito.';
          
          this.closeModal();
          this.cargarClientes();

          // Auto clear success message
          setTimeout(() => this.successMessage = '', 3000);
        } else {
          this.errorMessage = response.mensaje;
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.mensaje || 'Error al guardar el cliente.';
        console.error(err);
      }
    });
  }

  eliminarCliente(id: number): void {
    if (confirm('¿Está seguro de eliminar/desactivar este cliente?')) {
      this.clienteService.delete(id).subscribe({
        next: (response) => {
          if (response.codigo === 200) {
            this.successMessage = 'Cliente eliminado/desactivado con éxito.';
            this.cargarClientes();
            setTimeout(() => this.successMessage = '', 3000);
          } else {
            alert(response.mensaje);
          }
        },
        error: (err) => {
          console.error(err);
          alert(err.error?.mensaje || 'Error al eliminar el cliente.');
        }
      });
    }
  }
}
