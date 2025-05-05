import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CronoControlComponent } from './crono-control.component';

describe('CronoControlComponent', () => {
  let component: CronoControlComponent;
  let fixture: ComponentFixture<CronoControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CronoControlComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CronoControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
