import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostsService } from '../services/posts.service';

@Component({
  selector: 'app-post-detail',
  template: `
    <div class="post-detail-container">
      <a routerLink="/feed">← Back to Feed</a>
      <div *ngIf="post" class="post">
        <div class="post-header">
          <strong>{{ post.user.displayName }}</strong>
          <span class="username">{{ '@' }}{{ post.user.userName }}</span>
        </div>
        <div class="post-content">{{ post.content }}</div>
        <div *ngIf="post.imageUrl" class="post-image">
          <img [src]="post.imageUrl" alt="post image" />
        </div>
        <div class="post-date">{{ post.createdAt | date }}</div>
      </div>
    </div>
  `,
  styleUrls: ['./post-detail.component.scss']
})
export class PostDetailComponent implements OnInit {
  post: any;

  constructor(
    private route: ActivatedRoute,
    private postsService: PostsService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      this.loadPost(id);
    });
  }

  loadPost(id: number): void {
    this.postsService.getPost(id).subscribe({
      next: (post) => {
        this.post = post;
      },
      error: (err: any) => {
        console.error('Error loading post', err);
      }
    });
  }
}
