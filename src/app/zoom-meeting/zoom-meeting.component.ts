import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import ZoomMtgEmbedded from '@zoom/meetingsdk/embedded';

type ZoomClient = ReturnType<typeof ZoomMtgEmbedded.createClient>;



@Component({
  selector: 'app-zoom-meeting',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './zoom-meeting.component.html',
  styleUrls: ['./zoom-meeting.component.scss']
})
export class ZoomMeetingComponent implements OnInit {
  client!: ZoomClient;
  participants: any[] = [];
  raisedHands: string[] = [];

  constructor(private cdRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.initZoom();
  }

  async initZoom() {
    this.client = ZoomMtgEmbedded.createClient();

    this.client.init({
      debug: true,
      zoomAppRoot: document.getElementById('zoom-container') as HTMLElement,
      language: 'en-US',
    });

    const meetingNumber = '5991224531';
    const signature = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBLZXkiOiJxWGdGcFNUR1E5cU1tUTZqN1BlaFhBIiwic2RrS2V5IjoicVhnRnBTVEdROXFNbVE2ajdQZWhYQSIsIm1uIjoiNTk5MTIyNDUzMSIsInJvbGUiOjAsImlhdCI6MTc0NjM3NjU0NiwiZXhwIjoxNzQ2MzgzNzQ2LCJ0b2tlbkV4cCI6MTc0NjM4Mzc0Nn0.g2cWXaryb-zRO-Ggb66Co6S5ogN7igllB9DxZLqO-oE'; // generado en backend
    const sdkKey = 'qXgFpSTGQ9qMmQ6j7PehXA';

    await this.client.join({
      sdkKey,
      signature,
      meetingNumber,
      password: '123',
      userName: 'Angular User',
    });

    this.getParticipants();

    this.updatePartipants();

    this.getRaisedHands();
  }

  getParticipants() {
    this.participants = this.client.getAttendeeslist();
    console.log('Participants:', this.participants);
  }

  updatePartipants() {
    //averiguar si se dispara algo cuando alguien se une
    this.client.on('user-added', (data: any) => {
      this.getParticipants();
      console.log('Se unio:', data);
    }
    );
    this.client.on('user-removed', (data: any) => {
      console.log('Se fue:', data);
      this.getParticipants();
    }
    );

  }

  getRaisedHands() {
    this.client.on('user-updated', (data: any) => {
      console.log('user-updated', data);

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


      this.cdRef.detectChanges();

      console.log('Manos levantadas:', this.raisedHands);
    });
  }


  getNameById(id: string) {
    const participant = this.participants.find((p) => p.userId === id);
    return participant ? participant.displayName : 'Desconocido';
  }
}
