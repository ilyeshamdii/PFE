import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BadgeComponent } from './badge/badge.component';
import { AttestationsComponent } from './attestations/attestations.component';
import { AbsencesComponent } from './absences/absences.component';
import { QuestionsRhComponent } from './questions-rh/questions-rh.component';

const routes: Routes = [

  {path: '', redirectTo: '/dashboard', pathMatch: 'full' , data: {title: 'Administrateur'}},
  { path: 'dashboard', component: DashboardComponent , data: {title: 'Administrateur'}},

  { path: 'badge', component: BadgeComponent , data: {title: 'Administrateur'}},
  { path: 'attestations', component: AttestationsComponent , data: {title: 'Administrateur'}},
  { path: 'absences', component: AbsencesComponent , data: {title: 'Administrateur'}},
  { path: 'QuestionsRh', component: QuestionsRhComponent , data: {title: 'Administrateur'}},


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }