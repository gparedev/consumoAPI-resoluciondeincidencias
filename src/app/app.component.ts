import { Component, Signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PostsService } from './posts.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'proyectoAPI';
  posts: Signal<any>;

  // esto sirve para inyectar el servicio en el componente
  constructor(private servicio: PostsService) {

    this.posts = this.servicio.posts;
    console.log(this.posts);
  }


}
