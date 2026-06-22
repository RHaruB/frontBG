import { Component, inject, input } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { Button, InputText } from '../../shared/components';



@Component({
  selector: 'app-loggin',
  imports: [ReactiveFormsModule,Button,InputText],
  templateUrl: './loggin.component.html',
  styleUrl: './loggin.component.css'
})
export class LogginComponent {
   private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);

    loginForm: FormGroup = this.fb.group({
        usuario: ['', [Validators.required]],
        password: ['', [Validators.required]]
    });

    error: string = '';

    onSubmit(): void {
        if (this.loginForm.invalid) {
            this.loginForm.markAllAsTouched();
            return;
        }

        this.error = '';

        const { usuario, password } = this.loginForm.value;

        this.authService.login(usuario, password).subscribe({
            next: () => {
                this.router.navigate(['/']);
            },
            error: (err) => {
                this.error = 'Usuario o contraseña incorrectos';
                console.error('Login error', err);
            }
        });
    }

    get usuarioError(): string {
        const control = this.loginForm.get('usuario');
        if (control?.touched && control?.hasError('required')) {
            return 'El usuario es requerido';
        }
        return '';
    }

    get passwordError(): string {
        const control = this.loginForm.get('password');
        if (control?.touched && control?.hasError('required')) {
            return 'La contraseña es requerida';
        }
        return '';
    }
}
