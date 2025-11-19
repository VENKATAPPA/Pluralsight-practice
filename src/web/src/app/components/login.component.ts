import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="auth-container">
      <h1>Login</h1>
      <form (ngSubmit)="onLogin()">
        <div>
          <label>Username or Email:</label>
          <input type="text" [(ngModel)]="userName" name="userName" required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" [(ngModel)]="password" name="password" required />
        </div>
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <a routerLink="/register">Register</a></p>
      <div *ngIf="errorMessage" class="error">{{ errorMessage }}</div>
    </div>
  `,
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  userName = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) { }

  onLogin(): void {
    this.authService.login(this.userName, this.password).subscribe({
      next: (response) => {
        this.authService.saveToken(response.token);
        this.authService.loadCurrentUser();
        this.router.navigate(['/feed']);
      },
      error: (err) => {
        this.errorMessage = err.error || 'Login failed';
      }
    });
  }
}
