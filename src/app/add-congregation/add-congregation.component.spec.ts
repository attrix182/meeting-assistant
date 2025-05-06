import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCongregationComponent } from './add-congregation.component';

describe('AddCongregationComponent', () => {
  let component: AddCongregationComponent;
  let fixture: ComponentFixture<AddCongregationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCongregationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCongregationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
