import { Component } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {

  congregation: any;
  idCongregation: any;
  formSettings: FormGroup = new FormGroup({});
  enableEdit: boolean = false;

  constructor(private storageService: StorageService, private fb: FormBuilder, private router: Router, route: ActivatedRoute) {
    route.paramMap.subscribe(params => {
      this.idCongregation = params.get('congregation');
    });
    console.log(this.idCongregation);
  }

  ngOnInit() {
    this.getCongregation();
  }

  initForm() {
    this.formSettings = this.fb.group({
      meetingID: [this.congregation?.meetingID || ''],
      meetingPassword: [this.congregation?.meetingPassword || ''],
      sdkKey: [this.congregation?.sdkKey || ''],
      sizeTags: [this.congregation?.sizeTags || ''],
      timerSize: [this.congregation?.timerSize || ''],
      colorTags: [this.congregation?.colorTags || ''],
      showEmoji: [this.congregation?.showEmoji || ''],
    });
    this.formSettings.disable();
  }

  toggleEdit(action: string = '') {
    this.enableEdit = !this.enableEdit;
    if (this.enableEdit) {
      this.formSettings.enable();
    } else {
      if (action == 'cancel') {
        this.initForm();
      }
      this.formSettings.disable();
    }
  }


  getCongregation() {
    this.storageService.getByParameter('congregations', 'id', this.idCongregation)
      .subscribe((data: any) => {
        this.congregation = data[0];
        console.log(this.congregation);
        this.initForm();
      });
  }

  goBack() {
    this.router.navigate(['/dashboard', this.idCongregation]);
  }

  saveChanges() {
    this.storageService.update( this.congregation.id, 'congregations',this.formSettings.value).then(() => {
      this.toggleEdit();
      this.getCongregation();
    });
  }



}
