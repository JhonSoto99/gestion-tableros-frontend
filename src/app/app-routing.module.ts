import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TablerosComponent } from './tableros/tableros.component';

// Registro de las rutas
const routes: Routes = [
  { path: '', component: HomeComponent,  pathMatch: 'full', data: { title: 'Login' } },
  { path: 'tableros', component: TablerosComponent,  pathMatch: 'full', data: { title: 'Tableros' } },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }



