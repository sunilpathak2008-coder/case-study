import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OpenAiService } from 'src/app/core/services/openai.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-suggestion-dialog',
  templateUrl: './suggestion-dialog.component.html',
  styleUrls: ['./suggestion-dialog.component.scss']
})
export class SuggestionDialogComponent implements OnInit {
  suggestion = '';
  loading = false;
  error = '';

  constructor(
    private dialogRef: MatDialogRef<SuggestionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { field: string },
    private openAi: OpenAiService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.generateSuggestion();
  }

  generateSuggestion(): void {
    this.loading = true;
    this.error = '';
    
    // Get translated prompt text
    const promptKey = `SUGGESTION_PROMPTS.${this.data.field.toUpperCase()}`;
    const fallbackPrompt = `Give suggestion for field: ${this.data.field}`;
    
    this.translate.get(promptKey).subscribe((translatedPrompt: string) => {
      const prompt = translatedPrompt !== promptKey ? translatedPrompt : fallbackPrompt;
      
      this.openAi.getSuggestion(prompt).subscribe({
        next: (res: string) => {
          this.loading = false;
          this.suggestion = res || '';
        },
        error: () => {
          this.loading = false;
          this.error = 'AI_ERROR';
        }
      });
    });
  }

  accept(): void {
    this.dialogRef.close(this.suggestion);
  }

  edit(): void {
    this.translate.get('ACTIONS.EDIT_PROMPT').subscribe((editPrompt: string) => {
      const userEdit = prompt(editPrompt || '✏️ Edit the suggestion:', this.suggestion);
      if (userEdit !== null) {
        this.dialogRef.close(userEdit);
      }
    });
  }

  discard(): void {
    this.dialogRef.close(null);
  }
}