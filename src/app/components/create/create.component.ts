import { Component } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export class CreateComponent {
  userForm!: FormGroup;
  itemForm!: FormGroup;

  constructor(
    private firestoreService: FirestoreService,
    private formBuilder: FormBuilder
  ) {}
  ngOnInit() {
    this.userForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });

    this.itemForm = this.formBuilder.group({
      name: ['', Validators.required],
      Product: ['', Validators.required],
      price: ['', Validators.required]
    });
  }

  // Add User
  addUser() {
    if (this.userForm.valid) {
      this.firestoreService.addUser(this.userForm.value).then(() => {
        alert('User added successfully');
        this.userForm.reset();
      }).catch(error => {
        console.error('Error adding user:', error);
        alert('Failed to add user');
      });
    } else {
      alert('Please fill out the user form correctly.');
    }
  }

  // Add Item
  addItem() {
    if (this.itemForm.valid) {
      this.firestoreService.addItem(this.itemForm.value).then(() => {
        alert('Item added successfully');
        this.itemForm.reset();
      }).catch(error => {
        console.error('Error adding item:', error);
        alert('Failed to add item');
      });
    } else {
      alert('Please fill out the item form correctly.');
    }
  }
}
