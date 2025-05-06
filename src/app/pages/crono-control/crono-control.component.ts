import { Component } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-crono-control',
  imports: [CommonModule],
  templateUrl: './crono-control.component.html',
  styleUrl: './crono-control.component.scss'
})
export class CronoControlComponent {
  idCongregation: any;
  formattedTime = '00:00:00';
  private intervalId: any;
  lastTime : string = '00:00:00';
  timer = {
    timerStarted: 1,
    lastDateTimerStarted: new Date(),
  };

  constructor(private storage: StorageService, private router: Router, route: ActivatedRoute) {
    route.paramMap.subscribe(params => {
      this.idCongregation = params.get('congregation');
    });
  }

  getStatusTimer() {
    this.storage.getByParameter('congregations', 'id', this.idCongregation).subscribe((data: any) => {
      this.timer = data[0];

      const start = this.getDateFromFirestoreOrDate(this.timer.lastDateTimerStarted);

      if (this.timer.timerStarted === 1 && start) {
        const now = Date.now();
        this.formattedTime = this.formatMilliseconds(now - start);
        this.startTimerInterval();
      } else {
        this.formattedTime = '00:00:00';
      }
    });
  }


  ngOnInit() {
    this.getStatusTimer();
    if (this.timer.timerStarted === 1) {
      this.startTimerInterval();
    }
  }

  getDateFromFirestoreOrDate(date: any): number {
    if (!date) return 0;

    if (typeof date === 'object' && typeof date.seconds === 'number') {
      // Es un Timestamp de Firestore
      return new Date(date.seconds * 1000).getTime();
    }

    // Es una fecha normal (Date o string)
    return new Date(date).getTime();
  }



  startTimerInterval() {
    this.intervalId = setInterval(() => {
      if (this.timer.timerStarted === 1) {
        const now = new Date().getTime();
        const start = this.getDateFromFirestoreOrDate(this.timer.lastDateTimerStarted);

        const elapsed = now - start;
        this.formattedTime = this.formatMilliseconds(elapsed);
      }
    }, 1000);
  }

  formatMilliseconds(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }

  getTimerEstado(estado: number): string {
    switch (estado) {
      case 0: return 'Detenido';
      case 1: return 'Corriendo';
      case 2: return 'En pausa';
      default: return 'Desconocido';
    }
  }

  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  stopTimer() {
    clearInterval(this.intervalId);
    this.lastTime = this.formattedTime;
    this.formattedTime = '00:00:00';
    this.storage.update('plaza-misericordia', 'congregations', {
      timerStarted: 0,
      lastDateTimerStarted: null
    }).then(() => this.getStatusTimer());
  }

  playTimer() {
    const now = new Date();
    clearInterval(this.intervalId);
    this.storage.update('plaza-misericordia', 'congregations', {
      timerStarted: 1,
      lastDateTimerStarted: now
    }).then(() => this.getStatusTimer());
  }

  pauseTimer() {
    clearInterval(this.intervalId);
    this.storage.update('plaza-misericordia', 'congregations', {
      timerStarted: 2,
    }).then(() => this.getStatusTimer());
  }


  goBack() {
    this.router.navigate(['/dashboard', this.idCongregation]);
  }

}
