import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {PatientDetailComponent} from './patient-detail.component';
import {HttpModule} from '@angular/http';
import {PatientService} from '../service/patient.service';
import {FormsModule} from '@angular/forms';
import {AUTH_PROVIDERS} from 'angular2-jwt';


describe('Component: PatientDetail', () => {
  let component: PatientDetailComponent;
  let fixture: ComponentFixture<PatientDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PatientDetailComponent],
      imports: [HttpModule, FormsModule],
      providers: [PatientService, AUTH_PROVIDERS]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientDetailComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
