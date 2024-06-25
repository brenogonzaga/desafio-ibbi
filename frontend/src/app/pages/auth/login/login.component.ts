import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@root/app/services/auth.service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CheckboxModule,
    InputTextModule,
    ButtonModule,
    ReactiveFormsModule,
    PasswordModule,
    RouterLink,
    CardModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  credentialsFormGroup = new FormGroup({
    username: new FormControl('', {
      validators: [Validators.required],
    }),
    password: new FormControl('', {
      validators: [Validators.required],
    }),
  });

  constructor(private authService: AuthService, private router: Router) {}

  handleLogin() {
    const { username, password } = this.credentialsFormGroup.value;
    if (this.credentialsFormGroup.invalid || !username || !password) {
      this.handleInvalidForm();
      return;
    }
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    this.authService.login(formData).subscribe((response) => {
      const { access_token, name, role } = response.body;
      this.handleLoginSuccess(access_token, name, role);
    });
  }

  handleLoginSuccess(accessToken: string, userName: string, role: string) {
    localStorage.setItem('access_token', accessToken);
    this.authService.user = { userName, role, accessToken };
    if (role === 'admin') {
      this.router.navigate(['/admin']);
      return;
    }
    this.router.navigate(['/']);
  }

  handleInvalidForm() {}
}
