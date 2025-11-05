import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

export interface Post {
  id: number;
  title: string;
  body: string;
}

@Injectable({
  providedIn: 'root'
})

export class PostsService {
  [x:string]: any;
  
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://jsonplaceholder.typicode.com/posts';

  private getPosts() {
    return this.http.get<Post[]>(this.baseUrl).pipe(map(posts => posts.slice(0, 10)));
  }

  readonly posts = toSignal(this.getPosts(), { initialValue: [] as Post[] });
  /*
  Solución
  este enlace de github ya tiene la solución
  https://github.com/carmelogithub/Angular18APIGetok
  */

}
