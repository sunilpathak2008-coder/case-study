// src/app/core/services/openai.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class OpenAiService {
  constructor(private http: HttpClient) {}
  getSuggestion(prompt: string) {
    return this.http.post<any>('/api/openai', { prompt }).pipe(
      map(res => res.choices?.[0]?.message?.content?.trim() || '')
    );
  }
}
