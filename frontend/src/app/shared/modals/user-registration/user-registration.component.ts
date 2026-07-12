import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsersServiceService } from '../../../services/data-access/users-service/users-service.service';

@Component({
  selector: 'app-user-registration',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './user-registration.component.html',
  styleUrl: './user-registration.component.scss'
})
export class UserRegistrationComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() usuarioGuardado = new EventEmitter<any>();
  @Input() usuarioParaEditar: any = null;

  // Datos del formulario
  usuarioData: any = {
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    dni: '',
    telefono: '',
    fechaNacimiento: '',
    email: '',
    password: '',
    confirmPassword: '',
    idCargo: null,
    idRol: null
  };

  roles: any[] = [];
  isEditing = false;
  titulo = 'Registro de Usuario';
  loading = false;
  errorMessage = '';

  constructor(private usersService: UsersServiceService) {}

  ngOnInit() {
    // Cargar roles desde el backend
    this.usersService.obtenerRoles().subscribe({
      next: (roles) => {
        this.roles = roles;
      },
      error: (error) => {
        console.error('Error al cargar roles:', error);
        this.errorMessage = 'Error al cargar los roles disponibles';
      }
    });

    if (this.usuarioParaEditar) {
      this.isEditing = true;
      this.titulo = 'Modificar Usuario';
      this.cargarDatosParaEdicion();
    }
  }

cargarDatosParaEdicion() {
  // Backend returns: { id, nombre, apellido, email, rolId, rol, activo, fechaRegistro }
  const apellidos = (this.usuarioParaEditar.apellido || '').split(' ');

  this.usuarioData = {
    idUsuario: this.usuarioParaEditar.id,
    nombre: this.usuarioParaEditar.nombre,
    apellidoPaterno: apellidos[0] || '',
    apellidoMaterno: apellidos.slice(1).join(' ') || '',
    email: this.usuarioParaEditar.email,
    idRol: this.usuarioParaEditar.rolId,
    estado: this.usuarioParaEditar.activo
  };
}
  onSubmit() {
    this.loading = true;
    this.errorMessage = '';

    // Validaciones básicas
    if (!this.validarFormulario()) {
      this.loading = false;
      return;
    }

    // Preparar el DTO según el modelo del backend
    const usuarioDto: any = {
      nombre: this.usuarioData.nombre,
      apellido: `${this.usuarioData.apellidoPaterno} ${this.usuarioData.apellidoMaterno || ''}`.trim(),
      email: this.usuarioData.email,
      rolId: this.usuarioData.idRol
    };

    // Solo incluir password si no estamos editando o si se proporcionó una nueva
    if (!this.isEditing && this.usuarioData.password) {
      usuarioDto.password = this.usuarioData.password;
    }

    const observable = this.isEditing
      ? this.usersService.actualizarUsuarioCompleto(this.usuarioData.idUsuario, usuarioDto)
      : this.usersService.crearUsuarioCompleto(usuarioDto);

    observable.subscribe({
      next: (usuario) => {
        // La operación fue exitosa, el backend retorna el usuario creado/actualizado
        this.usuarioGuardado.emit(usuario);
        this.closeModal();
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error?.error?.message || 'Ocurrió un error al guardar el usuario';
        console.error('Error al guardar usuario:', error);
        this.loading = false;
      }
    });
  }

  validarFormulario(): boolean {
    // Validar que todos los campos requeridos estén llenos
    if (!this.usuarioData.nombre ||
        !this.usuarioData.apellidoPaterno ||
        !this.usuarioData.email ||
        !this.usuarioData.idRol) {
      this.errorMessage = 'Todos los campos marcados como requeridos son obligatorios';
      return false;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.usuarioData.email)) {
      this.errorMessage = 'Por favor ingrese un email válido';
      return false;
    }

    // Validar contraseña solo en creación
    if (!this.isEditing && (!this.usuarioData.password || this.usuarioData.password !== this.usuarioData.confirmPassword)) {
      this.errorMessage = 'Las contraseñas no coinciden o están vacías';
      return false;
    }

    return true;
  }

  closeModal() {
    this.close.emit();
  }
}