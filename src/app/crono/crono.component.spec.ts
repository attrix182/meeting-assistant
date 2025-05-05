import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CronoComponent } from './crono.component';

describe('CronoComponent', () => {
  let component: CronoComponent;
  let fixture: ComponentFixture<CronoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CronoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CronoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
