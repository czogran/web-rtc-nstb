import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelephoneComponent } from './telephone.component';

xdescribe('TelephoneComponent', () => {
  let component: TelephoneComponent;
  let fixture: ComponentFixture<TelephoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ TelephoneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TelephoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
