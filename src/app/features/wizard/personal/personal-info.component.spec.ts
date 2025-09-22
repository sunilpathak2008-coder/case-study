import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PersonalInfoComponent } from './personal-info.component';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('PersonalInfoComponent', () => {
  let component: PersonalInfoComponent;
  let fixture: ComponentFixture<PersonalInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PersonalInfoComponent],
      imports: [
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        MatRadioModule,
        MatSelectModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        BrowserAnimationsModule
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(PersonalInfoComponent);
    component = fixture.componentInstance;
    component.form1 = new FormGroup({
      name: new FormControl('', Validators.required),
      nationalId: new FormControl('', Validators.required),
      dob: new FormControl('', Validators.required),
      gender: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      state: new FormControl('', Validators.required),
      country: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required)
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.form1).toBeDefined();
    expect(component.form1.valid).toBeFalse();
  });

  it('should restrict DOB to today or earlier', () => {
    const today = new Date();
    component.form1.patchValue({ dob: new Date(today.getFullYear() + 1, 0, 1) });
    fixture.detectChanges();
    expect(component.form1.get('dob')?.value > today).toBeTrue();
    component.form1.patchValue({ dob: today });
    fixture.detectChanges();
    expect(component.form1.get('dob')?.value <= today).toBeTrue();
  });

  it('should validate phone number for India', () => {
    component.form1.patchValue({ country: 'India', phone: '919876543210' });
    fixture.detectChanges();
    expect(component.form1.get('phone')?.valid).toBeTrue();
    component.form1.patchValue({ country: 'India', phone: '12345' });
    fixture.detectChanges();
    expect(component.form1.get('phone')?.valid).toBeTrue();
  });

  it('should validate phone number for US', () => {
    component.form1.patchValue({ country: 'United States', phone: '11234567890' });
    fixture.detectChanges();
    expect(component.form1.get('phone')?.valid).toBeTrue();
    component.form1.patchValue({ country: 'United States', phone: '12345' });
    fixture.detectChanges();
    expect(component.form1.get('phone')?.valid).toBeTrue();
  });

  describe('handleCountryChange', () => {
    beforeEach(() => {
      component.countries = [
        { code: '+91', name: 'India' },
        { code: '+1', name: 'United States' },
        { code: '+971', name: 'UAE' }
      ];
    });

    it('should set India phone validator and validate correctly', () => {
      component.form1.get('country')?.setValue('+91');
      component.handleCountryChange('+91');
      component.form1.get('phone')?.setValue('9876543210');
      expect(component.form1.get('phone')?.valid).toBeTrue();
      component.form1.get('phone')?.setValue('12345');
      expect(component.form1.get('phone')?.valid).toBeFalse();
    });

    it('should set US phone validator and validate correctly', () => {
      component.form1.get('country')?.setValue('+1');
      component.handleCountryChange('+1');
      component.form1.get('phone')?.setValue('2123456789');
      expect(component.form1.get('phone')?.valid).toBeTrue();
      component.form1.get('phone')?.setValue('1123456789');
      expect(component.form1.get('phone')?.valid).toBeFalse();
    });

    it('should set UAE phone validator and validate correctly', () => {
      component.form1.get('country')?.setValue('+971');
      component.handleCountryChange('+971');
      component.form1.get('phone')?.setValue('512345678');
      expect(component.form1.get('phone')?.valid).toBeTrue();
      component.form1.get('phone')?.setValue('612345678');
      expect(component.form1.get('phone')?.valid).toBeFalse();
    });
  });

  describe('getPhoneError', () => {
    beforeEach(() => {
      spyOn(component.translate, 'instant').and.callFake((key: string) => key);
    });

    it('should return India error messages', () => {
      component.form1.get('country')?.setValue('+91');
      component.form1.get('phone')?.setErrors({ pattern: true });
      expect(component.getPhoneError()).toBe('ERRORS.PHONE_INDIA');
      component.form1.get('phone')?.setErrors({ required: true });
      expect(component.getPhoneError()).toBe('ERRORS.PHONE_REQUIRED');
    });

    it('should return US error messages', () => {
      component.form1.get('country')?.setValue('+1');
      component.form1.get('phone')?.setErrors({ pattern: true });
      expect(component.getPhoneError()).toBe('ERRORS.PHONE_US');
      component.form1.get('phone')?.setErrors({ required: true });
      expect(component.getPhoneError()).toBe('ERRORS.PHONE_REQUIRED');
    });

    it('should return UAE error messages', () => {
      component.form1.get('country')?.setValue('+971');
      component.form1.get('phone')?.setErrors({ pattern: true });
      expect(component.getPhoneError()).toBe('ERRORS.PHONE_UAE');
      component.form1.get('phone')?.setErrors({ required: true });
      expect(component.getPhoneError()).toBe('ERRORS.PHONE_REQUIRED');
    });

    it('should return default error messages for other countries', () => {
      component.form1.get('country')?.setValue('+44');
      component.form1.get('phone')?.setErrors({ pattern: true });
      expect(component.getPhoneError()).toBe('ERRORS.PHONE_INVALID');
      component.form1.get('phone')?.setErrors({ required: true });
      expect(component.getPhoneError()).toBe('ERRORS.PHONE_REQUIRED');
    });
  });
});
