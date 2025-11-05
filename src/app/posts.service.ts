import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
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

  // define la URL base para las peticiones HTTP. Es privada porque solo la usas dentro del servicio.
  private baseUrl: string = "https://jsonplaceholder.typicode.com/posts";

  // declara la propiedad post como una señal reactiva que contendrá un array de Post. Aún no se inicializa.
  post:Signal<Post[]>;
  
  // declaramos constructor que recibe http client. 
  // llama a getPosts(), que devuelve un Observable<Post[]>
  // lo convierte en una señal usando toSignal, con un valor inicial de un array vacío, evitando undefined
  constructor(private http:HttpClient) { 
    this.post=toSignal(this.getPosts(), {initialValue: []});
  }

  // esto hace una petición GET a la URL y devuelve un observable con los 10 primeros posts.
  getPosts(){
    return this.http.get<Post[]>(this.baseUrl).pipe(map(posts => posts.slice(0,10)));
  }

  // ANTES ESTABA ASÍ:
  // post = toSignal(this.getPosts()); ahora está en el constructor
  // esta línea se ejecutaba antes de que se llamase al constructor,
  // En ese momento, this.http todavía es undefined, porque el constructor aún no se ha ejecutado.
  // Entonces this.getPosts() llama a this.http.get(...), lo que da este error:

  /*
  export class PostsService { 
  
  private baseUrl: string = 'https://jsonplaceholder.typicode.com/posts'; 
  
  constructor(private http: HttpClient) {
   
  } 
  
  getPosts() { 
    return this.http.get<Post[]>(this.baseUrl).pipe(map(posts => posts.slice(0, 10))); 
  } 
    
  post=toSignal(this.getPosts()); 
  }
  */

  // aquí el fallo es que this.http del método getPosts() es undefined cuando se llama desde la inicialización de la propiedad post, porque el constructor aún no se ha ejecutado y no se ha asignado el valor a this.http.
  // Por eso, al mover la inicialización de post al constructor, garantizamos que this.http ya está definido cuando se llama a getPosts(), garantizamos que está definido porque post se inicializa después de que el constructor haya asignado el valor a this.http. De la otra manera, (la incorrecta) post se inicializaba antes de que el constructor se ejecutase porque las propiedades de clase se inicializan antes que el constructor.

  // el valor a this.http se asigna cuando Angular inyecta la dependencia HttpClient al crear la instancia del servicio PostsService.
  // angular inyecta la dependencia en el momento de crear la instancia del servicio, justo antes de ejecutar el constructor.
  // crear la instancia del servicio PostsService significa que angular llama al constructor del servicio, pasando la instancia de HttpClient como argumento.

  /*
  Solución:  https://github.com/carmelogithub/Angular18APIGetok
  y https://institutosnebrija.blackboard.com/ultra/stream/assessment/_89795_1/overview/attempt/create?courseId=_1813_1
  */

}
