import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SuggestionDialogComponent } from './suggestion-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OpenAiService } from 'src/app/core/services/openai.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';

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
      imports: [TranslateModule.forRoot()],
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
    component.edit();
    tick();
    expect(dialogRefSpy.close).toHaveBeenCalledWith('User edit');
  }));

  it('should not close dialog if user cancels edit', fakeAsync(() => {
    spyOn(translate, 'get').and.returnValue(of('Edit prompt'));
    spyOn(window, 'prompt').and.returnValue(null);
    component.suggestion = 'AI suggestion';
    component.edit();
    tick();
    expect(dialogRefSpy.close).not.toHaveBeenCalled();
  }));

  it('should close dialog with null on discard', () => {
    component.discard();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(null);
  });
});
