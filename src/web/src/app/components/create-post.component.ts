import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PostsService } from '../services/posts.service';

@Component({
  selector: 'app-create-post',
  template: `
    <div class="create-post-container">
      <h1>Create Post</h1>
      <form (ngSubmit)="onCreate()">
        <div>
          <label>Content:</label>
          <textarea [(ngModel)]="content" name="content" rows="5" required></textarea>
        </div>
        <div>
          <label>Image URL (optional):</label>
          <input type="text" [(ngModel)]="imageUrl" name="imageUrl" />
        </div>
        <button type="submit">Post</button>
      </form>
      <div *ngIf="errorMessage" class="error">{{ errorMessage }}</div>
    </div>
  `,
  styleUrls: ['./create-post.component.scss']
})
export class CreatePostComponent {
  content = '';
  imageUrl = '';
  errorMessage = '';

  constructor(private postsService: PostsService, private router: Router) { }

  onCreate(): void {
    this.postsService.createPost(this.content, this.imageUrl).subscribe({
      next: () => {
        this.router.navigate(['/feed']);
      },
      error: (err: any) => {
        this.errorMessage = err.error || 'Failed to create post';
      }
    });
  }
}
