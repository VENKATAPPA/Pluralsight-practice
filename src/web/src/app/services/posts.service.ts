import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private apiUrl = `${environment.apiBaseUrl}/posts`;

  constructor(private http: HttpClient) { }

  getFeed(page: number = 1, pageSize: number = 20): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/feed?page=${page}&pageSize=${pageSize}`);
  }

  getPost(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createPost(content: string, imageUrl?: string): Observable<any> {
    return this.http.post(`${this.apiUrl}`, { content, imageUrl });
  }

  updatePost(id: number, content: string, imageUrl?: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, { content, imageUrl });
  }

  deletePost(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  likePost(postId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${postId}/likes/like`, {});
  }

  unlikePost(postId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${postId}/likes/unlike`, {});
  }
}
