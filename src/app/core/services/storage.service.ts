// src/app/core/services/storage.service.ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private key = 'wizard-progress';
  save(data: any) { localStorage.setItem(this.key, JSON.stringify(data)); }
  load() { const raw = localStorage.getItem(this.key); return raw ? JSON.parse(raw) : null; }
  clear() { localStorage.removeItem(this.key); }
}
