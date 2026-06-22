import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { UsuarioResponse, UsuarioRequest, UsuarioUpdateRequest } from '../../interfaces/api-models.interface';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  usuarios: UsuarioResponse[] = [];
  
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
  formUsername: string = '';
  formNombre: string = '';
  formEmail: string = '';
  formContrasena: string = '';
  formActivo: boolean = true;

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.usuarioService.getAll(
      this.filtro,
      this.paginaActual,
      this.registrosPorPagina,
      this.soloActivos
    ).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.codigo === 200) {
          this.usuarios = response.datos;
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
        this.errorMessage = 'Error al cargar los usuarios del servidor.';
        console.error(err);
      }
    });
  }

  onBuscar(): void {
    this.paginaActual = 1;
    this.cargarUsuarios();
  }

  onResetFiltros(): void {
    this.filtro = '';
    this.soloActivos = true;
    this.paginaActual = 1;
    this.cargarUsuarios();
  }

  cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
      this.cargarUsuarios();
    }
  }

  // Open Modal for Create
  openCreateModal(): void {
    this.isEditMode = false;
    this.showModal = true;
    this.formId = 0;
    this.formUsername = '';
    this.formNombre = '';
    this.formEmail = '';
    this.formContrasena = '';
    this.formActivo = true;
    this.errorMessage = '';
  }

  // Open Modal for Edit
  openEditModal(usuario: UsuarioResponse): void {
    this.isEditMode = true;
    this.showModal = true;
    this.formId = usuario.usuarioID;
    this.formUsername = usuario.username;
    this.formNombre = usuario.nombre;
    this.formEmail = usuario.email;
    this.formContrasena = '';
    this.formActivo = usuario.activo;
    this.errorMessage = '';
  }

  closeModal(): void {
    this.showModal = false;
  }

  guardarUsuario(): void {
    if (!this.formUsername.trim() || !this.formNombre.trim() || !this.formEmail.trim()) {
      this.errorMessage = 'Los campos de Usuario, Nombre y Email son obligatorios.';
      return;
    }

    if (!this.isEditMode && !this.formContrasena.trim()) {
      this.errorMessage = 'La contraseña es obligatoria para nuevos usuarios.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    if (this.isEditMode) {
      const payload: UsuarioUpdateRequest = {
        id: this.formId,
        username: this.formUsername,
        contrasenaNueva: this.formContrasena.trim() || undefined,
        nombre: this.formNombre,
        email: this.formEmail,
        activo: this.formActivo
      };

      this.usuarioService.edit(payload).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.codigo === 200) {
            this.successMessage = 'Usuario actualizado con éxito.';
            this.closeModal();
            this.cargarUsuarios();
            setTimeout(() => this.successMessage = '', 3000);
          } else {
            this.errorMessage = response.mensaje;
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error?.mensaje || 'Error al actualizar el usuario.';
          console.error(err);
        }
      });
    } else {
      const payload: UsuarioRequest = {
        id: 0,
        username: this.formUsername,
        contrasena: this.formContrasena,
        nombre: this.formNombre,
        email: this.formEmail
      };

      this.usuarioService.create(payload).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.codigo === 200) {
            this.successMessage = 'Usuario registrado con éxito.';
            this.closeModal();
            this.cargarUsuarios();
            setTimeout(() => this.successMessage = '', 3000);
          } else {
            this.errorMessage = response.mensaje;
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error?.mensaje || 'Error al registrar el usuario.';
          console.error(err);
        }
      });
    }
  }

  eliminarUsuario(id: number): void {
    if (confirm('¿Está seguro de eliminar/desactivar este usuario?')) {
      this.usuarioService.delete(id).subscribe({
        next: (response) => {
          if (response.codigo === 200) {
            this.successMessage = 'Usuario desactivado con éxito.';
            this.cargarUsuarios();
            setTimeout(() => this.successMessage = '', 3000);
          } else {
            alert(response.mensaje);
          }
        },
        error: (err) => {
          console.error(err);
          alert(err.error?.mensaje || 'Error al eliminar el usuario.');
        }
      });
    }
  }
}
