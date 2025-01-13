import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface User {
  id?: string;
  name: string;
  email: string;
}

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  isEditMode = false;
  currentUserId: string | null = null;
  userForm!: FormGroup;

  constructor(
    private firestoreService: FirestoreService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.userForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
    this.fetchUsers();
  }

  fetchUsers() {
    this.firestoreService
      .getUsers()
      .then((users) => {
        this.users = users as User[];
        //console.log('Users:', this.users);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  }

  onSubmit() {
    if (this.userForm.valid) {
      if (this.isEditMode && this.currentUserId) {
        // Update user
        this.firestoreService
          .updateUser(this.currentUserId, this.userForm.value)
          .then(() => {
            alert('User updated successfully!');
            this.resetForm();
            this.fetchUsers();
          })
          .catch((error) => {
            console.error('Error updating user:', error);
            alert('Failed to update user');
          });
      } else {
        // Add new user
        this.firestoreService
          .addUser(this.userForm.value)
          .then(() => {
            alert('User added successfully');
            this.userForm.reset();
            this.fetchUsers();
          })
          .catch((error) => {
            console.error('Error adding user:', error);
            alert('Failed to add user');
          });
      }
    } else {
      alert('Please fill out the user form correctly.');
    }
  }

  editUser(user: User) {
    this.userForm.patchValue({
      name: user.name,
      email: user.email,
    });
    this.currentUserId = user.id!;
    this.isEditMode = true;
  }

  deleteUser(id: string) {
    if (id) {
      this.firestoreService
        .deleteUser(id)
        .then(() => {
          alert('User deleted successfully!');
          this.fetchUsers();
        })
        .catch((error) => {
          console.error('Error deleting user:', error);
          alert('Failed to delete user');
        });
    }
  }

  resetForm() {
    this.userForm.reset();
    this.isEditMode = false;
    this.currentUserId = null;
  }
}
