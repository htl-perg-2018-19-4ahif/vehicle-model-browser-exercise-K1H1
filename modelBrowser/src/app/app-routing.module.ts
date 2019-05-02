import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AboutComponent } from './about/about.component';
import { FilterComponent } from './filter/filter.component';


const routes: Routes = [
  { path: 'about', component: AboutComponent },
  { path: 'filter', component: FilterComponent },

  { path: '', redirectTo: '/about', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
