import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-profile',
  template: `
    <div class="profile-container">
      <a routerLink="/feed">← Back to Feed</a>
      <div *ngIf="user" class="profile">
        <h1>{{ user.displayName }}</h1>
        <p class="username">{{ '@' }}{{ user.userName }}</p>
        <p *ngIf="user.bio" class="bio">{{ user.bio }}</p>
        <p class="joined">Joined {{ user.createdAt | date }}</p>
        <button *ngIf="!isOwnProfile" (click)="toggleFollow()">
          {{ isFollowing ? 'Unfollow' : 'Follow' }}
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: any;
  isOwnProfile = false;
  isFollowing = false;

  constructor(
    private route: ActivatedRoute,
    private usersService: UsersService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      this.loadProfile(id);
    });
  }

  loadProfile(id: number): void {
    this.usersService.getUser(id).subscribe({
      next: (user) => {
        this.user = user;
      },
      error: (err: any) => {
        console.error('Error loading profile', err);
      }
    });
  }

  toggleFollow(): void {
    if (this.isFollowing) {
      this.usersService.unfollow(this.user.id).subscribe({
        next: () => {
          this.isFollowing = false;
        }
      });
    } else {
      this.usersService.follow(this.user.id).subscribe({
        next: () => {
          this.isFollowing = true;
        }
      });
    }
  }
}
