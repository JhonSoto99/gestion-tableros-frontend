import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/index';
import {TablerosModel, IdeasModel} from 'src/app/tableros/tableros.model';
import {Services} from 'src/app/tableros/services';
import {Router} from '@angular/router';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-tableros',
  templateUrl: './tableros.component.html',
  styleUrls: ['./tableros.component.css']
})
export class TablerosComponent implements OnInit {

  // Creación de variables
  tableros = [];
  crear_tablero = false;
  crear_idea = false;
  id_user: String;
  id_tablero: String;
  aprobada: String;
  modal_aviso_creacion_idea = false;
  modal_aviso_eliminacion_idea = false;
  no_puede_editar_idea = false;
  editar_idea = false;
  info_idea_editar: any;
  info_tablero_idea_editar: any;

  // Creación de formularios
  formTablero: FormGroup;
  formIdea: FormGroup;
  formFiltro: FormGroup;


  constructor(private formBuilder: FormBuilder,
              private httpClient: HttpClient,
              private services: Services,
              public router: Router,
              private route: ActivatedRoute) {

    // se obtiene el parametro id usuario que es enviado por la url para posteriormente ser utilizado en este componente
    this.route.queryParams.subscribe(params => {
      this.id_user = params['id'];
      console.log(this.id_user);
    });
  }

  ngOnInit() {
    // Se crean los formularios y se obtienen los tableros con sus ideas al cargar el componente
    this.createForm();
    this.getTableros();
  }

  // Metodo para crear los formularios
  private createForm() {
    this.formTablero = this.formBuilder.group({
      titulo: ['', [Validators.required, Validators.maxLength(100)]],
      descripcion: ['', [Validators.required, Validators.maxLength(500)]],
      tipo: ['', [Validators.required, Validators.maxLength(30)]],
    });
    this.formIdea = this.formBuilder.group({
      descripcion: ['', [Validators.required, Validators.maxLength(500)]],
    });
    this.formFiltro = this.formBuilder.group({
      titulo_filtro: ['', [Validators.maxLength(100)]],
    });
  }

  // Geters para obtener los valores de los input de los formularios
  get titulo() { return this.formTablero.get('titulo'); }
  get descripcion() { return this.formTablero.get('descripcion'); }
  get tipo() { return this.formTablero.get('tipo'); }
  get descripcion_idea() { return this.formIdea.get('descripcion'); }
  get titulo_filtro() { return this.formFiltro.get('titulo_filtro'); }

  // Funcion para obtener todos los tableros e ideas
  getTableros() {
    this.services.obtenerTableros()
      .subscribe(
        data => {
          console.log(data);
          this.tableros = data;
          console.log("ALL TABLEROS GET");
        },
        error => {
          console.log(`Tableros get error: ${error.message}`);
        }
      );
  }

  // Funcion para crear un tablero
  crearTablero() {
    const tablerosModel: TablerosModel = {
      'titulo': this.titulo.value,
      'descripcion': this.descripcion.value,
      'tipo_tablero': this.tipo.value,
      'creado_por': this.id_user,
    };
    this.services.crearTablero(tablerosModel)
      .subscribe(
        data => {
          console.log(data);

          console.log("TABLERO CREADO");
          this.getTableros();
        },
        error => {
          console.log(`Tablero post error: ${error.message}`);
        }
      );
    this.crear_tablero = false;

  }

  //Funcion para crear una idea
  crearIdea() {
    const ideasModel: IdeasModel = {
      'tablero': this.id_tablero,
      'descripcion': this.descripcion_idea.value,
      'aprobada': this.aprobada,
      'creado_por': this.id_user,
    };
    this.services.crearIdea(ideasModel)
      .subscribe(
        data => {
          console.log(data);

          console.log("Idea CREADA");
          this.getTableros();
        },
        error => {
          console.log(`Idea post error: ${error.message}`);
        }
      );
    this.crear_idea = false;
    this.descripcion_idea.setValue('');
  }

  editarIdeaFormModal(idea, tablero){
    // se valida que solo pueda editar las ideas quien crea el tablero
    if (tablero.creado_por == this.id_user){
      this.info_idea_editar = idea;
      this.info_tablero_idea_editar = tablero;
      this.crear_idea = true;
      this.editar_idea = true;
      this.descripcion_idea.setValue(idea.descripcion);
    } else {
      this.no_puede_editar_idea = true; // Se muetra modal informando que no puede editar una idea
    }
  }

  // Funcion para editar una idea
  editarIdea() {
    const ideasModel: IdeasModel = {
      'tablero': this.info_tablero_idea_editar.id,
      'descripcion': this.descripcion_idea.value,
      'aprobada': this.info_idea_editar.aprobada,
      'creado_por': this.id_user,
    };
      this.services.editarIdea(this.info_idea_editar.id,ideasModel)
        .subscribe(
          data => {
            console.log(data);

            console.log("Idea Editada");
            this.getTableros();
          },
          error => {
            console.log(`Idea post error: ${error.message}`);
          }
        );
      this.crear_idea = false;
      this.editar_idea = false;
    this.descripcion_idea.setValue('');
  }

  // Funcion para cancelar la edicion de una idea
  cancelar() {
    this.crear_idea = false;
    this.editar_idea = false;
    this.descripcion_idea.setValue('');
  }

  // Funcion para eliminar una idea
  eliminarIdea(id, tablero_creado_por){
    if (tablero_creado_por == this.id_user) { // Se vaslida que la idea a eliminar pertenezca al tablero del usuario creador
      this.services.eliminarIdea(id)
        .subscribe(
          data => {
            console.log(data);

            console.log("Idea ELIMINADA");
            this.getTableros();
          },
          error => {
            console.log(`Idea delete error: ${error.message}`);
          }
        );
    } else { // Se muetra modal informando que no puede eliminar la idea
      this.modal_aviso_eliminacion_idea = true;
    }

  }

  // Funcion para validar la creacion de una nueva idea, segun el tipo de tablero, si es publico o privado
  setIdTableroNuevaIdea(id_tablero, tipo_tablero, creado_por){
    this.id_tablero=id_tablero;

    if (tipo_tablero == 'PUBLICO') {
      // Si es publico y la idea es agregada por el mismo creador esta se cre4a como aprobada
        if (this.id_user == creado_por) {
          this.aprobada = 'SI';
        } else {
          this.aprobada = 'NO';
        }
        this.crear_idea = true;
    } else if(tipo_tablero == 'PRIVADO') {
      // Si es privado y la idea es aagregada por otro usuario, no permite hacerlo, muestra un modal
      if (this.id_user == creado_por) {
        this.aprobada = 'SI';
        this.crear_idea = true;
      } else {
        this.modal_aviso_creacion_idea = true;
      }

    }


  }

  // Funcion para aprobar las ideas creadas por otros usuarios
  aprobarIdea(idea, tablero){
    // se valida que solo pueda aprobar las ideas el usuario asignado al tablero
    if (tablero.creado_por == this.id_user) {
      this.services.aprobarIdea(idea.id)
        .subscribe(
          data => {
            console.log(data);
            console.log("Idea APROBADA");
            this.getTableros();
          },
          error => {
            console.log(`Idea aprobada error: ${error.message}`);
          }
        );
    } else { // Se muetra modal informando que no puede editat la idea
      this.no_puede_editar_idea = true;
    }
  }

  // Funcion para eliminar un tablero
  eliminarTablero(id) {
    this.services.eliminarTablero(id)
      .subscribe(
        data => {
          console.log(data);
          console.log("TABLERO ELIMINADO");
          this.getTableros();
        },
        error => {
          console.log(`TABLERO ELIMINADO error: ${error.message}`);
        }
      );
  }

  onKeyUpBuscador(value) {
    this.services.obtenerTableros(value)
      .subscribe(
        data => {
          console.log(data);
          this.tableros = data;
          console.log("ALL TABLEROS GET");
        },
        error => {
          console.log(`Tableros get error: ${error.message}`);
        }
      );
  }

}
