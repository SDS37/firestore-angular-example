import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppHeaderComponent } from './app-header.component';
import { MATERIAL_IMPORTS } from 'src/app/shared/material-imports';

describe('AppHeaderComponent', () => {
  let fixture: ComponentFixture<AppHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppHeaderComponent, ...MATERIAL_IMPORTS]
    }).compileComponents();

    fixture = TestBed.createComponent(AppHeaderComponent);
    fixture.componentInstance.user = {
      email: 'test@example.com',
      uid: '1',
      authenticated: true
    };
    fixture.detectChanges();
  });

  it('should render the user email', () => {
    expect(fixture.nativeElement.querySelector('#user-name').textContent).toContain('test@example.com');
  });

  it('should emit logout when the button is clicked', () => {
    spyOn(fixture.componentInstance.logout, 'emit');
    fixture.nativeElement.querySelector('button').click();
    expect(fixture.componentInstance.logout.emit).toHaveBeenCalled();
  });
});
