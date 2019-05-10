import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {TablerosModel, IdeasModel} from './tableros.model';


@Injectable({
  providedIn: 'root'
})

export class Services {

  private httpOptions: any;

  constructor(private httpClient: HttpClient) {
    this.httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };


  }

  // Servicio para crear tableros
  crearTablero(tablerosModel: TablerosModel): Observable<any> {
    return this.httpClient.post(`/back/api/v1/tableros/tablero/`, tablerosModel);
  }

  // Servicio para obtener tableros con sus ideas
  obtenerTableros(titulo?): Observable<any> {
    return this.httpClient.get(`/back/api/v1/tableros/get_tableros/?titulo=${titulo}`);
  }

  // Servicio para crear una idea
  crearIdea(ideasModel: IdeasModel): Observable<any> {
    return this.httpClient.post(`/back/api/v1/tableros/idea/`, ideasModel);
  }

  // servicio para eliminar una idea
  eliminarIdea(id): Observable<any> {
    return this.httpClient.delete(`/back/api/v1/tableros/idea/${id}/`);
  }

  // Servicio para eliminar un tablero
  eliminarTablero(id): Observable<any> {
    return this.httpClient.delete(`/back/api/v1/tableros/tablero/${id}/`);
  }

  // Servicio para editar una idea
  editarIdea(id, ideasModel: IdeasModel): Observable<any> {
    return this.httpClient.put(`/back/api/v1/tableros/idea/${id}/`, ideasModel);
  }

  // Servicio para aprobar una idea
  aprobarIdea(id): Observable<any> {
    return this.httpClient.get(`/back/api/v1/tableros/aprobar_idea/?id=${id}`,);
  }


}
