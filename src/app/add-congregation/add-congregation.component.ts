import { Component, EventEmitter, Output } from '@angular/core';

import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-add-congregation',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-congregation.component.html',
  styleUrl: './add-congregation.component.scss'
})
export class AddCongregationComponent {
  congregations: any;
  formSettings: FormGroup = new FormGroup({});
  @Output() onBack = new EventEmitter<void>();

  constructor(private storageService: StorageService, private fb: FormBuilder, private router: Router, route: ActivatedRoute) { }

  ngOnInit() {
    this.initForm();
    this.getAllCong()
  }

  initForm() {
    this.formSettings = this.fb.group({
      name: [''],
      id: [''],
      password: [''],
      idWeb: [''],
      meetingID: [''],
      meetingPassword: [''],
      sdkKey: [''],
      sizeTags: [''],
      timerSize: [''],
      colorTags: [''],
      showEmoji: [''],
    });
  }



  goBack() {
    this.onBack.emit();
  }

  formatNameToId(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')                     // Descompone caracteres acentuados
      .replace(/[\u0300-\u036f]/g, '')     // Elimina los acentos
      .replace(/\s+/g, '-')                // Reemplaza espacios por guiones
      .replace(/[^a-z0-9\-]/g, '');        // Elimina caracteres no alfanuméricos excepto guiones
  }



  getAllCong() {
    this.storageService.getAll('congregations')
      .subscribe((data: any) => {
        this.congregations = data;
      })
  }

  checkExistName(name: string) {
    return this.congregations.some((congregation: any) => congregation.name === name);
  }

  saveChanges() {
    const congregation = {
      name: this.formSettings.value.name,
      id: this.formatNameToId(this.formSettings.value.name),
      password: this.formSettings.value.password,
      idWeb: this.formSettings.value.idWeb,
      meetingID: this.formSettings.value.meetingID,
      meetingPassword: this.formSettings.value.meetingPassword,
      sdkKey: this.formSettings.value.sdkKey,
      sizeTags: '42px',
      timerSize: '60px',
      colorTags: '#ebeaea',
      showEmoji: true,
    }

    const exist = this.checkExistName(congregation.name);
    if (exist) {
      alert('Ya hay una congregación con ese nombre.');
      return;
    }

    this.storageService.insertCustomID('congregations', congregation.id, congregation)
      .then(() => {
        this.router.navigate(['/dashboard/', congregation.id]);
      })
      .catch(err => {
        console.error('Error al insertar:', err);
      });

  }



}

