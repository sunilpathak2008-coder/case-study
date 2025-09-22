import { Component, Input } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

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

  maxDate = new Date();

  constructor(public translate: TranslateService) {}

  ngOnInit() {
    // Only require DOB, no pattern
    if (this.form1.get('dob')) {
      this.form1.get('dob')?.setValidators([
        Validators.required
      ]);
      this.form1.get('dob')?.updateValueAndValidity();
    }
    // Subscribe to form changes and update localStorage
    this.form1.valueChanges.subscribe(val => {
      localStorage.setItem('wizard_personal_info', JSON.stringify(val));
    });
  }

  handleCountryChange(event: any) {
    this.onCountryChange && this.onCountryChange(event);
    // Optionally, update phone validation based on country
    const selectedCountry = this.countries.find(c => c.code === event);
    if (this.form1 && selectedCountry) {
      let pattern = /^[0-9]{6,15}$/;
      if (selectedCountry.code === '+91') pattern = /^[6-9][0-9]{9}$/; // India: 10 digits, starts with 6-9
      if (selectedCountry.code === '+1') pattern = /^[2-9][0-9]{9}$/; // US: 10 digits, starts with 2-9
      if (selectedCountry.code === '+971') pattern = /^[5][0-9]{8}$/; // UAE: 9 digits, starts with 5
      // Add more country-specific patterns as needed
      this.form1.get('phone')?.setValidators([Validators.required, Validators.pattern(pattern)]);
      this.form1.get('phone')?.updateValueAndValidity();
    }
  }

  getPhoneError(): string {
    const countryCode = this.form1.get('country')?.value;
    if (countryCode === '+91') {
      return this.form1.get('phone')?.hasError('pattern') ? this.translate.instant('ERRORS.PHONE_INDIA') : this.translate.instant('ERRORS.PHONE_REQUIRED');
    }
    if (countryCode === '+1') {
      return this.form1.get('phone')?.hasError('pattern') ? this.translate.instant('ERRORS.PHONE_US') : this.translate.instant('ERRORS.PHONE_REQUIRED');
    }
    if (countryCode === '+971') {
      return this.form1.get('phone')?.hasError('pattern') ? this.translate.instant('ERRORS.PHONE_UAE') : this.translate.instant('ERRORS.PHONE_REQUIRED');
    }
    return this.form1.get('phone')?.hasError('pattern') ? this.translate.instant('ERRORS.PHONE_INVALID') : this.translate.instant('ERRORS.PHONE_REQUIRED');
  }
}
