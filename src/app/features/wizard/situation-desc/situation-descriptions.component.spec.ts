import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SituationDescriptionsComponent } from './situation-descriptions.component';

describe('SituationDescriptionsComponent', () => {
  let component: SituationDescriptionsComponent;
  let fixture: ComponentFixture<SituationDescriptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SituationDescriptionsComponent],
      imports: [ReactiveFormsModule, TranslateModule.forRoot()]
    }).compileComponents();
    fixture = TestBed.createComponent(SituationDescriptionsComponent);
    component = fixture.componentInstance;
    component.form3 = new FormGroup({
      financialSituation: new FormControl(''),
      employmentCircumstances: new FormControl(''),
      reason: new FormControl('')
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
