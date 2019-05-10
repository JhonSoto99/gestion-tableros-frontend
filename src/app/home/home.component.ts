import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/index';
import {UserModel} from 'src/app/home/home.model';
import {Services} from 'src/app/home/services';
import {finalize} from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  mostrar_notificacion_user_no_existe = false;
  form_registrar_user = false;

  formLogin: FormGroup;
  formRegistroUser: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private httpClient: HttpClient,
              private services: Services,
              public router: Router,
              ) { }

  ngOnInit() {
    this.createForm();
  }
  private createForm() {
    this.formLogin = this.formBuilder.group({
      user_email: ['', [Validators.required, Validators.maxLength(80)]],
      password: ['', [Validators.required, Validators.maxLength(60)]],
    });
    this.formRegistroUser = this.formBuilder.group({
      email_user: ['', [Validators.required, Validators.maxLength(80)]],
      password: ['', [Validators.required, Validators.maxLength(80)]],
      num_documento: ['', [Validators.required, Validators.maxLength(60)]],
      nombres: ['', [Validators.required, Validators.maxLength(60)]],
      apellidos: ['', [Validators.required, Validators.maxLength(60)]],
    });
  }

  get user_email() { return this.formLogin.get('user_email'); }
  get password() { return this.formLogin.get('password'); }

  get email_user() { return this.formRegistroUser.get('email_user'); }
  get password_new() { return this.formRegistroUser.get('password'); }
  get num_documento() { return this.formRegistroUser.get('num_documento'); }
  get nombres() { return this.formRegistroUser.get('nombres'); }
  get apellidos() { return this.formRegistroUser.get('apellidos'); }

  login (){



    this.mostrar_notificacion_user_no_existe = false;
    this.services.login(this.formLogin.value)
      .subscribe(
        data => {
          console.log(data);
          if (data.success) {
            console.log("User loggeado");
            const params = {id: data.id};

            localStorage.setItem('user', data.user);

            this.router.navigate(['tableros'],{ queryParams: params } );

          } else {
            this.mostrar_notificacion_user_no_existe = true;
          }

        },
        error => {
          console.log(`User get error: ${error.message}`);
        }
      );
  }


  crearUsuario (){
    this.mostrar_notificacion_user_no_existe = false;
    const userModel: UserModel = {
      'email_user': this.email_user.value,
      'password': this.password_new.value,
      'num_documento': this.num_documento.value,
      'nombres': this.nombres.value,
      'apellidos': this.apellidos.value,
    };
    this.services.crearUsuario(userModel)
      .subscribe(
        data => {
          console.log(data);
          console.log("Usuario registrado exitosamente");
          this.form_registrar_user=false;
          this.user_email.setValue('');
          this.password.setValue('');
        },
        error => {
          console.log(`User post error: ${error.message}`);
        }
      );
  }

}
