import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../data-access/auth.service';
import { CommonModule } from '@angular/common';

interface SignUpForm{
  nombre: FormControl<string | null>;
  apellido: FormControl<string | null>;
  email: FormControl<string | null>;
  password: FormControl<string | null>;
  rolId: FormControl<number | null>;
}

@Component({
  selector: 'app-auth-sign-up',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: `./auth-sign-up.component.html`,
  styleUrl: './auth-sign-up.component.scss'
})
export default class AuthSignUpComponent {
  private _formBuilder = inject(FormBuilder);
  private _authService = inject(AuthService);

  roles = [
    { id: 2, nombre: 'Cajero' },
    { id: 3, nombre: 'Cocinero' },
    { id: 4, nombre: 'Mozo' },
  ];

  form = this._formBuilder.group<SignUpForm>({
    nombre: this._formBuilder.control(null, [Validators.required]),
    apellido: this._formBuilder.control(null, [Validators.required]),
    email: this._formBuilder.control(null, [Validators.required, Validators.email]),
    password: this._formBuilder.control(null, [Validators.required, Validators.minLength(6)]),
    rolId: this._formBuilder.control(null, [Validators.required]),
  });

  submit() {
    if (this.form.invalid) return;

    this._authService.signUp({
      nombre: this.form.value.nombre ?? '',
      apellido: this.form.value.apellido ?? '',
      email: this.form.value.email ?? '',
      password: this.form.value.password ?? '',
      rolId: this.form.value.rolId ?? 0,
    }).subscribe({
      next: () => alert('Usuario registrado exitosamente'),
      error: (error) => {
        console.error('Error al registrar usuario:', error);
        alert(error?.error?.message || 'Error al registrar usuario');
      }
    });
  }
}
