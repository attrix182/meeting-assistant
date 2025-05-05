import { Component } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  congregation: any;

  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit() {
    this.getCongregation();
  }

  getCongregation() {
    this.congregation = JSON.parse(localStorage.getItem('congregation') || '{}');
  }

  goToSettings() {
    this.router.navigate(['/settings/', this.congregation.id]);
  }

  goToOverlay() {
    const overlayUrl = `${window.location.origin}/overlay/${this.congregation.id}`;

    navigator.clipboard.writeText(overlayUrl).then(() => {
      alert('La URL se ha copiado al portapapeles. Pega esta URL en tu escena de OBS. Asegurate de tener los datos correctos en ajustes. Revisa las guías para más detalles.');
      //  this.router.navigate(['/overlay', this.congregation.id]);
    }).catch(err => {
      console.error('Error al copiar al portapapeles:', err);
      alert('No se pudo copiar la URL. Por favor, cópiala manualmente: ' + overlayUrl);
    });
  }

  goToTimer() {
    this.router.navigate(['/crono-control/', this.congregation.id]);
  }

  goToDocs(){
    this.router.navigate(['/docs']);
  }

  commingSoon() {
    alert('En desarrollo');
  }

  logout() {
    this.authService.doLogout();
  }
}
