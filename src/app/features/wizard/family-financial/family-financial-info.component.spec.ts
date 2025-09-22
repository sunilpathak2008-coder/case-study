import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FamilyFinancialInfoComponent } from './family-financial-info.component';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('FamilyFinancialInfoComponent', () => {
  let component: FamilyFinancialInfoComponent;
  let fixture: ComponentFixture<FamilyFinancialInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FamilyFinancialInfoComponent],
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
    fixture = TestBed.createComponent(FamilyFinancialInfoComponent);
    component = fixture.componentInstance;
    component.form2 = new FormGroup({
      maritalStatus: new FormControl(''),
      dependents: new FormControl(0),
      employmentStatus: new FormControl(''),
      monthlyIncome: new FormControl(0),
      housingStatus: new FormControl('')
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
