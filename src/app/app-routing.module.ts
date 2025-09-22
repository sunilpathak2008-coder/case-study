import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WizardComponent } from './features/wizard/wizard.component';

const routes: Routes = [
  { path: '', redirectTo: 'wizard', pathMatch: 'full' },
  { path: 'wizard', component: WizardComponent },
  { path: '**', redirectTo: 'wizard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
