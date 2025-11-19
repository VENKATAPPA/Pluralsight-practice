import { Component, OnInit } from '@angular/core';
import { PostsService } from '../services/posts.service';

@Component({
  selector: 'app-feed',
  template: `
    <div class="feed-container">
      <h1>Feed</h1>
      <a routerLink="/create-post" class="create-btn">Create Post</a>
      <div class="posts">
        <div *ngFor="let post of posts" class="post">
          <div class="post-header">
            <strong>{{ post.user.displayName }}</strong>
            <span class="username">{{ '@' }}{{ post.user.userName }}</span>
            <span class="date">{{ post.createdAt | date }}</span>
          </div>
          <div class="post-content">{{ post.content }}</div>
          <div *ngIf="post.imageUrl" class="post-image">
            <img [src]="post.imageUrl" alt="post image" />
          </div>
          <div class="post-actions">
            <button (click)="like(post.id)">👍 {{ post.likesCount }}</button>
            <button (click)="goToPost(post.id)">💬 {{ post.commentsCount }}</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit {
  posts: any[] = [];

  constructor(private postsService: PostsService) { }

  ngOnInit(): void {
    this.loadFeed();
  }

  loadFeed(): void {
    this.postsService.getFeed().subscribe({
      next: (posts) => {
        this.posts = posts;
      },
      error: (err: any) => {
        console.error('Error loading feed', err);
      }
    });
  }

  like(postId: number): void {
    this.postsService.likePost(postId).subscribe({
      next: () => {
        this.loadFeed();
      }
    });
  }

  goToPost(postId: number): void {
    window.location.href = `/post/${postId}`;
  }
}
