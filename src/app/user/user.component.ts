import {Component, OnInit} from '@angular/core';
import {Response} from '@angular/http';
import {FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';
import {UserService} from './service/user.service';
import {User} from './model/user';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  private users: Array<User> = [];
  private user: User = null;
  protected roles: [string] = ['Gast', 'Tierpfleger', 'Arzt', 'Administrator'];
  private labelRole: string = 'Rolle';

  private isLoading = true;
  private isAlerting = false;
  private isEditing = false;

  private addUserForm: FormGroup;
  private name = new FormControl('', Validators.required);
  private email = new FormControl('', Validators.required);
  private password = new FormControl('', Validators.required);
  private role = new FormControl('', Validators.required);

  private infoMsg = {body: '', type: 'info'};

  constructor(private userService: UserService,
              private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.getUsers();
    this.addUserForm = this.formBuilder.group({
      name: this.name,
      email: this.email,
      password: this.password,
      role: this.role
    });
  }

  getUsers(forceReload = false) {
    this.userService.getAllItems(forceReload).subscribe(
      data => this.users = data,
      error => {
        if (error instanceof Response) {
          if (401 === error.status) {
            this.sendInfoMsg('Benutzer ist nicht berechtigt' + '', 'danger', 0);
          } else {
            this.sendInfoMsg('Status: ' + error.status + ' Text: ' + error.statusText, 'danger', 0);
          }
          this.isLoading = false;
          this.isAlerting = true;
        } else {
          console.log(error);
        }
      },
      () => this.isLoading = false
    );
  }

  addUser() {
    this.userService.addUser(this.addUserForm.value).subscribe(
      res => {
        let newUser = res.json();
        this.users.push(newUser);
        this.actualizeCache();
        this.addUserForm.reset();
        this.sendInfoMsg('Benutzer erfolgreich hinzugefügt.', 'success');
      },
      error => console.log(error)
    );
  }

  enableEditing(user) {
    this.isEditing = true;
    this.user = user;
  }

  cancelEditing() {
    this.isEditing = false;
    this.user = null;
    this.sendInfoMsg('Benutzer-Bearbeitung abgebrochen.', 'warning');
    // reload the users to reset the editing
    this.getUsers();
  }

  editUser(user) {
    this.userService.editUser(user).subscribe(
      res => {
        this.isEditing = false;
        this.user = user;
        this.role.setValue(this.labelRole);
        this.isEditing = false;
        this.actualizeCache();
        this.sendInfoMsg('Benutzer erfolgreich bearbeitet.', 'success');
      },
      error => console.log(error)
    );
  }

  deleteUser(user) {
    if (window.confirm('Wollen Sie sicher diesen Benutzer permanent löschen?')) {
      this.userService.deleteUser(user).subscribe(
        res => {
          let pos = this.users.map(obj => {
            return obj._id;
          }).indexOf(user._id);
          this.users.splice(pos, 1);
          this.actualizeCache();
          this.sendInfoMsg('Benutzer erfolgreich gelöscht.', 'success');
        },
        error => console.log(error)
      );
    }
  }

  selectRole(role: string) {
    if (this.isEditing) {
      this.user.role = role;
    } else {
      this.role.setValue(role);
    }
  }

  sendInfoMsg(body, type, time = 3000) {
    this.infoMsg.body = body;
    this.infoMsg.type = type;
    if (time !== 0) {
      window.setTimeout(() => this.infoMsg.body = '', time);
    }
  }

  private actualizeCache() {
    this.userService.writeCacheList(this.users);
  }
}
