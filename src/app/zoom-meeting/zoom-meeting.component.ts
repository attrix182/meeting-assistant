import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import ZoomMtgEmbedded from '@zoom/meetingsdk/embedded';
import { StorageService } from '../services/storage.service';
import { CronoComponent } from '../crono/crono.component';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';

type ZoomClient = ReturnType<typeof ZoomMtgEmbedded.createClient>;



@Component({
  selector: 'app-zoom-meeting',
  standalone: true,
  imports: [CommonModule, CronoComponent],
  templateUrl: './zoom-meeting.component.html',
  styleUrls: ['./zoom-meeting.component.scss']
})
export class ZoomMeetingComponent implements OnInit {
  client!: ZoomClient;
  participants: any[] = [];
  raisedHands: string[] = [];
  congregationID!: string;
  congregation!: any;
  signature!: string;
  joinError: string | null = null; // NUEVO

  constructor(
    private cdRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private storage: StorageService,
    private auth: AuthService) { }

  ngOnInit() {
    this.getData();
  }

  async getSignature(meetingNumber: string, role: number, idWeb: number) {
    this.auth.getSignatureZoom(meetingNumber, role, idWeb).subscribe((data: any) => {
      this.signature = data.signature;
      setTimeout(() => {
     //   this.initZoom();
      }
        , 1000);
    });
  }

  getData() {
    this.congregationID = this.route.snapshot.params['congregation'];
    this.storage.getByParameter('congregations', 'id', this.congregationID)
      .subscribe(async (data: any) => {
        this.congregation = data[0];
        await this.getSignature(this.congregation.meetingID, 0, this.congregation.idWeb);
      });
  }

  initZoom() {
    this.client = ZoomMtgEmbedded.createClient();

    this.client.init({
      debug: true,
      zoomAppRoot: document.getElementById('zoom-container') as HTMLElement,
      language: 'en-US',
    });

    const meetingNumber = this.congregation.meetingID;
    const signature = this.signature; // generado en backend
    const sdkKey = this.congregation.sdkKey;

    this.client.join({
      sdkKey,
      signature,
      meetingNumber,
      password: this.congregation.meetingPassword.toString(),
      userName: 'Orador',
    }).then(() => {
      // Conexión exitosa
      this.joinError = null;
      this.getParticipants();
      this.updatePartipants();
      this.getRaisedHands();
    }).catch((error: any) => {
      console.error('Error al unirse a la reunión:', error);
      if (error?.reason == 'Meeting has not started') {
        //this.joinError = error?.reason;
      }
      this.cdRef.detectChanges();
    });
  }

  getParticipants() {
    this.participants = this.client.getAttendeeslist();
  }

  updatePartipants() {
    this.client.on('user-added', (data: any) => {
      this.getParticipants();
    }
    );
    this.client.on('user-removed', (data: any) => {
      this.getParticipants();
    }
    );
  }

  getRaisedHands() {
    this.client.on('user-updated', (data: any) => {
      const userId = data[0].userId;
      if (data[0].bRaiseHand) {
        const name = this.getNameById(userId);
        this.raisedHands.push(name);
      }

      if (!data[0].bRaiseHand) {
        const name = this.getNameById(userId);
        const index = this.raisedHands.indexOf(name);
        if (index > -1) {
          this.raisedHands.splice(index, 1);
        }
      }

      if (data[0].displayName) {
        this.getParticipants();
      }
      this.cdRef.detectChanges();
      console.log('Manos levantadas:', this.raisedHands);
    });
  }

  getNameById(id: string) {
    const participant = this.participants.find((p) => p.userId === id);
    return participant ? participant.displayName : 'Desconocido';
  }
}
