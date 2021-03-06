import {Component, OnInit, Input, OnDestroy, Output, EventEmitter} from '@angular/core';
import {Http} from '@angular/http';
import {PatientService} from '../service/patient.service';
import {Patient} from '../model/patient';
import {Subscription} from 'rxjs/Subscription';
import {MessageService} from '../../shared/service/message/message.service';

@Component({
  selector: 'app-patient-detail',
  templateUrl: './patient-detail.component.html',
  styleUrls: ['./patient-detail.component.scss']
})
export class PatientDetailComponent implements OnInit, OnDestroy {
  private infoMsg = {body: '', type: 'info'};
  private subscription: Subscription;
  private messageService: MessageService<Patient>;
  private newPatient: Patient;

  @Input() patient: Patient;
  @Input() isEditing: boolean = false;

  @Output() patientNew: EventEmitter<Patient> = new EventEmitter<Patient>();
  @Output() editingDone: EventEmitter<boolean> = new EventEmitter<boolean>();


  constructor(http: Http, private patientService: PatientService) {
    this.messageService = patientService.messageService;
    this.subscription = this.messageService.Itemselected$.subscribe(
      patient => {
        this.patient = patient;
      });
  }

  ngOnInit() {
  }

  savePatient(patient) {
    console.log('Patient wird gespeichert', patient);
    if (!patient._id) {
      // Neuen Patienten anlegen
      this.patientService.addPatient(patient).subscribe(
        res => {
          this.newPatient = res.json();
          this.actualizeCache();
          this.sendInfoMsg('Patient erfolgreich hinzugefügt.', 'success');
          this.patientNew.emit(this.newPatient);
          this.editingDone.emit(false);
          this.isEditing = false;
          this.patient = null;
        },
        error => console.log(error)
      );
    } else {
      // Patientendaten ändern mit bestehender _id
      this.patientService.editPatient(patient).subscribe(
        res => {
          this.actualizeCache();
          this.sendInfoMsg('Patient erfolgreich geändert.', 'success');
          this.editingDone.emit(false);
          this.isEditing = false;
          this.patient = null;
        },
        error => console.log(error)
      );
    }
  }

  onCancel(patient) {
    this.isEditing = false;
    this.editingDone.emit(false);
    this.patient = null;
  }

  sendInfoMsg(body, type, time = 3000) {
    this.infoMsg.body = body;
    this.infoMsg.type = type;
    window.setTimeout(() => this.infoMsg.body = '', time);
  }

  private actualizeCache() {
    this.patientService.writeCache(this.patient);
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }
}

