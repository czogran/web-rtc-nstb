import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenSizeComponent } from './screen-size.component';

xdescribe('ScreenSizeComponent', () => {
  let component: ScreenSizeComponent;
  let fixture: ComponentFixture<ScreenSizeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScreenSizeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScreenSizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
