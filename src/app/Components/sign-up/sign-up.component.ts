import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,RouterLink],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
  signUpForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.signUpForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      terms: [false, Validators.requiredTrue]
    });
  }

  get name() {
    return this.signUpForm.get('name');
  }

  get email() {
    return this.signUpForm.get('email');
  }

  get password() {
    return this.signUpForm.get('password');
  }

  get terms() {
    return this.signUpForm.get('terms');
  }

  signUp() {
    if (this.signUpForm.valid) {
      const { name, email, password } = this.signUpForm.value;
      this.authService.signup(name, email, password).subscribe({
        next: (response) => {
          // Handle successful sign-up (e.g., navigate to a welcome page)
          this.router.navigate(['/add-sale']); 
        },
        error: (err) => {
          console.error('Sign-up failed', err);
        }
      });
    }
  }
}