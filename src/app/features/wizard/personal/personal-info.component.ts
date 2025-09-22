import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss']
})
export class PersonalInfoComponent {
  @Input() form1!: FormGroup;
  @Input() countries: any[] = [];
  @Input() selectedCountryCode = '';
  @Input() getCountryTranslationKey!: (countryName: string) => string;
  @Input() isStepValid!: () => boolean;
  @Input() onCountryChange!: (code: string) => void;

  handleCountryChange(event: any) {
    this.onCountryChange(event);
  }
}
