import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemosEnvComponent } from './memos-env.component';

describe('MemosEnvComponent', () => {
  let component: MemosEnvComponent;
  let fixture: ComponentFixture<MemosEnvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemosEnvComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemosEnvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
