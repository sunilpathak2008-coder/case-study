import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { WizardComponent } from './wizard.component';
import { SuggestionDialogComponent } from './suggestion-dialog/suggestion-dialog.component';
import { PersonalInfoComponent } from './personal/personal-info.component';
import { FamilyFinancialInfoComponent } from './family-financial/family-financial-info.component';
import { SituationDescriptionsComponent } from './situation-desc/situation-descriptions.component';

// Angular Material
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core'; // Add this import


@NgModule({
  declarations: [
    WizardComponent,
    SuggestionDialogComponent,
    PersonalInfoComponent,
    FamilyFinancialInfoComponent,
    SituationDescriptionsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // Material
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatSelectModule,
    MatRadioModule,
    MatProgressBarModule,
    MatIconModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    TranslateModule
  ],
  exports: [
    WizardComponent
  ]
})
export class WizardModule {}
