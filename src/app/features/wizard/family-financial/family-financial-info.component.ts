import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-family-financial-info',
  templateUrl: './family-financial-info.component.html',
  styleUrls: ['./family-financial-info.component.scss']
})
export class FamilyFinancialInfoComponent {
  @Input() form2!: FormGroup;
  @Input() employmentOptions: string[] = [];
  @Input() getEmploymentTranslationKey!: (employment: string) => string;
  @Input() isStepValid!: () => boolean;
}
