import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, map, switchMap, catchError } from 'rxjs/operators';

import {UserModel} from './home.model';


interface AccessData {
  access: string;
  refresh: string;
}

export interface LoginContext {
  user_email: string;
  password: string;
}

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

  getUser(user_email, password): Observable<any> {
    return this.httpClient.get(`/back/miocreate/`);
  }

  // public login(user) {
  //
  //   this.httpClient.post(`/back/api/v1/users/api-token-auth/`, JSON.stringify(user), this.httpOptions).subscribe(
  //     data => {
  //       console.log("fgdfgfdg");
  //     },
  //     err => {
  //       console.log("error al obtener token");
  //     }
  //   );
  // }
  public login(context: LoginContext): Observable<any> {
    return this.httpClient.get(`/back/api/v1/users/login/?email_user=${context.user_email}&password=${context.password}`)
  }

  crearUsuario(userModel: UserModel): Observable<any> {
    return this.httpClient.post(`/back/api/v1/users/user/`, userModel);
  }


}
