import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  template: `
    <nav class="navbar">
      <h1>SocialMediaApp</h1>
      <div class="nav-links">
        <a routerLink="/feed" *ngIf="isLoggedIn">Feed</a>
        <a routerLink="/create-post" *ngIf="isLoggedIn">Create Post</a>
        <span *ngIf="isLoggedIn" class="user-info">{{ currentUserName }}</span>
        <button (click)="logout()" *ngIf="isLoggedIn">Logout</button>
      </div>
    </nav>
    <router-outlet></router-outlet>
  `,
  styles: [`
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #333;
      color: white;
      padding: 15px 20px;
    }
    .navbar h1 {
      margin: 0;
    }
    .nav-links {
      display: flex;
      gap: 20px;
      align-items: center;
    }
    .nav-links a {
      color: white;
      text-decoration: none;
    }
    .user-info {
      color: #ccc;
    }
    button {
      padding: 8px 15px;
      background: red;
      color: white;
      border: none;
      cursor: pointer;
    }
  `]
})
export class AppComponent {
  isLoggedIn = false;
  currentUserName = '';

  constructor(private authService: AuthService, private router: Router) {
    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
      this.currentUserName = user?.displayName || '';
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
