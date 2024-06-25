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
  selector: 'app-signup',
  standalone: true,
  imports: [
    CheckboxModule,
    InputTextModule,
    ButtonModule,
    RouterLink,
    ReactiveFormsModule,
    PasswordModule,
    CardModule,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignUpComponent {
  credentialsFormGroup = new FormGroup({
    name: new FormControl('', {
      validators: [Validators.required],
    }),
    username: new FormControl('', {
      validators: [Validators.required],
    }),
    email: new FormControl('', {
      validators: [Validators.required],
    }),
    password: new FormControl('', {
      validators: [Validators.required],
    }),
  });

  constructor(private authService: AuthService, private router: Router) {}

  handleSignup() {
    const { name, email, username, password } = this.credentialsFormGroup.value;
    if (this.credentialsFormGroup.invalid) {
      this.handleInvalidForm();
      return;
    }

    this.authService
      .signup(this.credentialsFormGroup.value)
      .subscribe((response) => {
        if (response.ok) {
          this.handleLoginSuccess();
        }
      });
  }

  handleLoginSuccess() {
    this.router.navigate(['/entrar']);
  }

  handleInvalidForm() {}
}
