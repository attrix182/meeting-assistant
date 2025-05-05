import { Component } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  congregations: any[] = []
  selectedCongregation: any;
  password!: string ;
  constructor(private storage: StorageService, private authService: AuthService, private router:Router) {}

  ngOnInit() {
    this.getCongregations();
  }

  onSelectCongregation(congregation: any) {
    this.selectedCongregation = congregation;
  }


  getCongregations() {
    this.storage.getAll('congregations').subscribe((data: any) => {
      this.congregations = data;
    });
  }

  login(){
    console.log('Selected congregation:', this.selectedCongregation);
    console.log('Password:', this.password);

    if(this.password === this.selectedCongregation.password){
      this.authService.doLogin(this.selectedCongregation);
      this.router.navigate(['/dashboard/', this.selectedCongregation.id]);
    }else{
      alert('Login failed');
    }
  }

  showAddCongregationForm(){

  }

}
