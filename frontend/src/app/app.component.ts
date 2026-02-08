import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="box">
      <h1>Greet (Angular + Go)</h1>
      <p>Angular frontend + Go API — one repo.</p>
      <form (ngSubmit)="onSubmit()">
        <label>Name</label>
        <input [(ngModel)]="name" name="name" required placeholder="Alice" />
        <label>Birth year</label>
        <input type="number" [(ngModel)]="birthYear" name="birthYear" required placeholder="1990" />
        <label>API URL</label>
        <input [(ngModel)]="apiBase" name="apiBase" placeholder="http://localhost:8081" />
        <button type="submit">Greet</button>
      </form>
      @if (error) { <p class="error">Error: {{ error }}</p> }
      @if (result !== null) { <pre>{{ result }}</pre> }
    </div>
  `,
  styles: [`
    .box { max-width: 400px; margin: 2rem auto; padding: 16px; }
    label { display: block; margin-bottom: 8px; }
    input { width: 100%; padding: 8px; margin-bottom: 12px; box-sizing: border-box; }
    button { padding: 8px 16px; }
    .error { color: #c00; }
    pre { background: #f0f0f0; padding: 16px; border-radius: 4px; white-space: pre-wrap; }
  `],
})
export class AppComponent {
  name = '';
  birthYear = '';
  apiBase = 'http://localhost:8081';
  result: string | null = null;
  error: string | null = null;

  constructor(private http: HttpClient) {}

  onSubmit() {
    this.error = null;
    this.result = 'Loading…';
    const base = (this.apiBase || '').replace(/\/$/, '');
    const url = `${base}/greet?name=${encodeURIComponent(this.name)}&birth_year=${encodeURIComponent(this.birthYear)}`;
    this.http.get<{ greeting: string; age_confirmation: string }>(url, { responseType: 'json' }).subscribe({
      next: (data) => (this.result = JSON.stringify(data, null, 2)),
      error: (err) => {
        this.error = err.message || 'Request failed';
        this.result = null;
      },
    });
  }
}
