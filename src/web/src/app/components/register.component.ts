import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  template: `
    <div class="auth-container">
      <h1>Register</h1>
      <form (ngSubmit)="onRegister()">
        <div>
          <label>Username:</label>
          <input type="text" [(ngModel)]="userName" name="userName" required />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" [(ngModel)]="email" name="email" required />
        </div>
        <div>
          <label>Display Name:</label>
          <input type="text" [(ngModel)]="displayName" name="displayName" />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" [(ngModel)]="password" name="password" required />
        </div>
        <button type="submit">Register</button>
      </form>
      <p>Already have an account? <a routerLink="/login">Login</a></p>
      <div *ngIf="errorMessage" class="error">{{ errorMessage }}</div>
    </div>
  `,
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  userName = '';
  email = '';
  displayName = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) { }

  onRegister(): void {
    this.authService.register(this.userName, this.email, this.password, this.displayName).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        this.errorMessage = err.error || 'Registration failed';
      }
    });
  }
}
