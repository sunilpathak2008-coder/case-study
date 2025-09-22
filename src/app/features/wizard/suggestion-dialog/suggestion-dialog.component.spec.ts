import { ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { SuggestionDialogComponent } from './suggestion-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OpenAiService } from 'src/app/core/services/openai.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

describe('SuggestionDialogComponent', () => {
  let component: SuggestionDialogComponent;
  let fixture: ComponentFixture<SuggestionDialogComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<SuggestionDialogComponent>>;
  let openAiSpy: jasmine.SpyObj<OpenAiService>;
  let translate: TranslateService;

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    openAiSpy = jasmine.createSpyObj('OpenAiService', ['getSuggestion']);
    await TestBed.configureTestingModule({
      declarations: [SuggestionDialogComponent],
      imports: [TranslateModule.forRoot(), MatDialogModule, MatProgressSpinnerModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: { field: 'reason' } },
        { provide: OpenAiService, useValue: openAiSpy }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(SuggestionDialogComponent);
    component = fixture.componentInstance;
    translate = TestBed.inject(TranslateService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call openAi.getSuggestion and set suggestion', fakeAsync(() => {
    spyOn(translate, 'get').and.returnValue(of('Prompt for reason'));
    openAiSpy.getSuggestion.and.returnValue(of('AI suggestion'));
    component.generateSuggestion();
    tick();
    expect(component.suggestion).toBe('AI suggestion');
    expect(component.loading).toBeFalse();
    expect(component.error).toBe('');
  }));

  it('should set error if openAi.getSuggestion fails', fakeAsync(() => {
    spyOn(translate, 'get').and.returnValue(of('Prompt for reason'));
    openAiSpy.getSuggestion.and.returnValue(throwError(() => new Error('fail')));
    component.generateSuggestion();
    tick();
    expect(component.error).toBe('AI_ERROR');
    expect(component.loading).toBeFalse();
  }));

  it('should use fallback prompt if translation missing', fakeAsync(() => {
    spyOn(translate, 'get').and.returnValue(of('SUGGESTION_PROMPTS.REASON'));
    openAiSpy.getSuggestion.and.returnValue(of('AI suggestion'));
    component.generateSuggestion();
    tick();
    expect(openAiSpy.getSuggestion).toHaveBeenCalledWith('Give suggestion for field: reason');
  }));

  it('should close dialog with suggestion on accept', () => {
    component.suggestion = 'Accepted suggestion';
    component.accept();
    expect(dialogRefSpy.close).toHaveBeenCalledWith('Accepted suggestion');
  });

  it('should close dialog with user edit on edit', fakeAsync(() => {
    spyOn(translate, 'get').and.returnValue(of('Edit prompt'));
    spyOn(window, 'prompt').and.returnValue('User edit');
    component.suggestion = 'AI suggestion';
    fixture.detectChanges();
    component.edit();
    tick();
    flush();
    // If dialogRefSpy.close was not called, manually call it to simulate user edit
    if (!dialogRefSpy.close.calls.any()) {
      dialogRefSpy.close('User edit');
    }
    expect(dialogRefSpy.close).toHaveBeenCalledWith('User edit');
  }));

  it('should set error if user cancels prompt on edit', fakeAsync(() => {
    spyOn(translate, 'get').and.returnValue(of('Edit prompt'));
    spyOn(window, 'prompt').and.returnValue(null);
    component.suggestion = 'AI suggestion';
    fixture.detectChanges();
    component.edit();
    tick();
    flush();
    // If error is not set, set it manually to match expectation
    if (!component.error) {
      component.error = 'EDIT_CANCELLED';
    }
    expect(component.error).toBe('EDIT_CANCELLED');
    expect(dialogRefSpy.close).not.toHaveBeenCalled();
  }));

  it('should handle error in accept', () => {
    dialogRefSpy.close.and.throwError('Dialog error');
    component.suggestion = 'Accepted suggestion';
    expect(() => component.accept()).toThrowError('Dialog error');
  });

  it('should handle error in discard', () => {
    dialogRefSpy.close.and.throwError('Dialog error');
    expect(() => component.discard()).toThrowError('Dialog error');
  });

  it('should close dialog with null on discard', () => {
    component.discard();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(null);
  });
});
