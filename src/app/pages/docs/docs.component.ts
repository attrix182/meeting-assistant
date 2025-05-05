import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-docs',
  standalone: true,
  imports: [],
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.scss']
})
export class DocsComponent {
  congregationID: string | null = null;

  constructor(private router: Router) {
    try {
      const savedCongregation = localStorage.getItem('congregation');
      if (savedCongregation) {
        const parsed = JSON.parse(savedCongregation);
        this.congregationID = parsed?.id ?? null;
      }
    } catch (error) {
      console.error('Error parsing congregation from localStorage', error);
    }
  }

  goBack() {
    if (this.congregationID) {
      this.router.navigate(['dashboard', this.congregationID]);
    } else {
      this.router.navigate(['dashboard']);
    }
  }
}
