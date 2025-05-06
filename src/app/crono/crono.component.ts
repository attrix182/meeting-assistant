import { Component, Input, OnDestroy } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-crono',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './crono.component.html',
  styleUrl: './crono.component.scss',
})
export class CronoComponent implements OnDestroy {
  time: string = '00:00:00';
  interval: any = null;
  @Input() congregation: any;

  private timerStarted = 0;
  private lastDateTimerStarted: any;

  constructor(private storage: StorageService) {}

  ngOnInit() {
    this.getStatusTimer();
  }

  ngOnDestroy(): void {
    if (this.interval) clearInterval(this.interval);
  }

  getStatusTimer() {
    this.storage.getByParameter('congregations', 'id', 'plaza-misericordia').subscribe((data: any) => {
      const timerData = data[0];
      this.timerStarted = timerData.timerStarted;
      this.lastDateTimerStarted = timerData.lastDateTimerStarted;

      switch (this.timerStarted) {
        case 0:
          this.stopTimer();
          break;
        case 1:
          this.playTimer();
          break;
        case 2:
          this.pauseTimer();
          break;
      }
    });
  }

  playTimer() {
    if (this.interval) return;

    const start = this.getDateFromFirestoreOrDate(this.lastDateTimerStarted);
    this.interval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - start;
      this.time = this.formatMilliseconds(elapsed);
    }, 1000);
  }

  pauseTimer() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    const now = Date.now();
    const elapsed = now - this.getDateFromFirestoreOrDate(this.lastDateTimerStarted);
    this.time = this.formatMilliseconds(elapsed);
  }

  stopTimer() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.time = '00:00:00';
  }

  private formatMilliseconds(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }

  private getDateFromFirestoreOrDate(date: any): number {
    if (!date) return 0;

    if (typeof date === 'object' && typeof date.seconds === 'number') {
      return new Date(date.seconds * 1000).getTime();
    }

    return new Date(date).getTime();
  }
}
