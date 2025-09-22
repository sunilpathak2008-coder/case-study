import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { SuggestionDialogComponent } from './suggestion-dialog/suggestion-dialog.component';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { DD_MM_YYYY_FORMAT } from '../../utils/date-formats.config';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: DD_MM_YYYY_FORMAT },
  ]
})
export class WizardComponent implements OnInit {
  form1!: FormGroup;
  form2!: FormGroup;
  form3!: FormGroup;
  currentStep = 1;
  totalSteps = 3;
  selectedCountryCode = '';
  formSubmitted = false;
  maxDate = new Date();

  // country list with codes
  countries = [
    { name: 'India', code: '+91' },
    { name: 'United States', code: '+1' },
    { name: 'United Kingdom', code: '+44' },
    { name: 'UAE', code: '+971' }
  ];

  // employment options
  employmentOptions = [
    'Unemployed',
    'Employed',
    'Self-Employed',
    'Student',
    'Retired'
  ];

  // Helper methods for translations
  getCountryTranslationKey(countryName: string): string {
    return 'COUNTRIES.' + countryName.replace(/\s+/g, '_').toUpperCase();
  }

  getEmploymentTranslationKey(employment: string): string {
    return 'EMPLOYMENT.' + employment.toUpperCase().replace('-', '_');
  }

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) {
    this.initForms();
  }

  ngOnInit(): void {
    this.loadFromStorage();
  }

  // ---------------- INIT FORMS ----------------
  private initForms(): void {
    this.form1 = this.fb.group({
      name: ['', Validators.required],
      nationalId: ['', Validators.required],
      dob: ['', Validators.required],
      gender: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      country: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{6,15}$/)]],
      email: ['', [Validators.required, Validators.email]]
    });

    this.form2 = this.fb.group({
      maritalStatus: ['', Validators.required],
      dependents: [0, [Validators.required, Validators.min(0)]],
      employmentStatus: ['', Validators.required],
      monthlyIncome: [0, [Validators.required, Validators.min(0)]],
      housingStatus: ['', Validators.required]
    });

    this.form3 = this.fb.group({
      financialSituation: ['', Validators.required],
      employmentCircumstances: ['', Validators.required],
      reason: ['', Validators.required]
    });
  }

  // ---------------- STEP NAVIGATION ----------------
  nextStep(): void {
    if (this.isStepValid() && this.currentStep < this.totalSteps) {
      this.currentStep++;
      this.saveToStorage();
    } else {
      this.form1.markAllAsTouched();
      this.form2.markAllAsTouched();
      this.form3.markAllAsTouched();
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  isStepValid(): boolean {
    if (this.currentStep === 1) return this.form1.valid;
    if (this.currentStep === 2) return this.form2.valid;
    if (this.currentStep === 3) return this.form3.valid;
    return false;
  }

  // ---------------- COUNTRY CHANGE ----------------
  onCountryChange(code: string): void {
    this.selectedCountryCode = code.replace('+', '');
  }

  // ---------------- STORAGE HELPERS ----------------
  private saveToStorage(): void {
    const data = {
      form1: this.form1.value,
      form2: this.form2.value,
      form3: this.form3.value,
      currentStep: this.currentStep
    };
    localStorage.setItem('wizardData', JSON.stringify(data));
  }

  private loadFromStorage(): void {
    const raw = localStorage.getItem('wizardData');
    if (raw) {
      try {
        const data = JSON.parse(raw);
        if (data.form1) this.form1.patchValue(data.form1);
        if (data.form2) this.form2.patchValue(data.form2);
        if (data.form3) this.form3.patchValue(data.form3);
        if (data.currentStep) this.currentStep = data.currentStep;
      } catch (err) {
        console.error('Error loading from storage:', err);
        localStorage.removeItem('wizardData');
      }
    }
  }

  // ---------------- SUBMIT ----------------
  onSubmit(): void {
    if (!this.isStepValid()) {
      alert('❌ Please complete all required fields before submitting.');
      return;
    }

    const formData = {
      ...this.form1.value,
      ...this.form2.value,
      ...this.form3.value
    };

    this.http.post('https://jsonplaceholder.typicode.com/posts', formData)
      .subscribe({
        next: (res) => {
          console.log('Submitted successfully:', res);
          this.formSubmitted = true;
          this.translate.get('FORM_SUBMITTED_SUCCESS').subscribe((msg: string) => {
            this.snackBar.open(msg, '', {
              duration: 3000,
              panelClass: ['snackbar-success']
            });
          });
          // Reset everything
          this.resetWizard();
        },
        error: (err) => {
          console.error('Submit error:', err);
        }
      });
  }


  private resetWizard(): void {
    this.form1.reset();
    this.form2.reset();
    this.form3.reset();
    this.currentStep = 1;
    this.selectedCountryCode = '';
    localStorage.removeItem('wizardData');
  }

  // ---------------- SUGGESTION DIALOG ----------------
  openHelp(field: string): void {
    const dialogRef = this.dialog.open(SuggestionDialogComponent, {
      width: '500px',
      data: { field }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this.form3.get(field)) {
          this.form3.patchValue({ [field]: result });
        }
      }
    });
  }

}