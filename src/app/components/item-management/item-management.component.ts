import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Item {
  id?: string;
  name: string;
  Product: string;
  price: string;
}

@Component({
  selector: 'app-item-management',
  templateUrl: './item-management.component.html',
  styleUrl: './item-management.component.css'
})
export class ItemManagementComponent implements OnInit {
  items: Item[] = [];
  isEditMode = false;
  currentItemId: string | null = null;
  ItemForm!: FormGroup;

  constructor(
    private firestoreService: FirestoreService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.ItemForm = this.formBuilder.group({
      name: ['', Validators.required],
      Product: ['', [Validators.required]],
      price: ['', [Validators.required]],
    });
    this.fetchitems();
  }

  fetchitems() {
    this.firestoreService
      .getItems()
      .then((items) => {
        this.items = items as Item[];
        //console.log('items:', this.items);
      })
      .catch((error) => {
        console.error('Error fetching items:', error);
      });
  }

  onSubmit() {
    if (this.ItemForm.valid) {
      if (this.isEditMode && this.currentItemId) {
        // Update Item
        this.firestoreService
          .updateItem(this.currentItemId, this.ItemForm.value)
          .then(() => {
            alert('Item updated successfully!');
            this.resetForm();
            this.fetchitems();
          })
          .catch((error) => {
            console.error('Error updating Item:', error);
            alert('Failed to update Item');
          });
      } else {
        // Add new Item
        this.firestoreService
          .addItem(this.ItemForm.value)
          .then(() => {
            alert('Item added successfully');
            this.ItemForm.reset();
            this.fetchitems();
          })
          .catch((error) => {
            console.error('Error adding Item:', error);
            alert('Failed to add Item');
          });
      }
    } else {
      alert('Please fill out the Item form correctly.');
    }
  }

  editItem(Item: Item) {
    this.ItemForm.patchValue({
      name: Item.name,
      Product: Item.Product,
      price: Item.price,
    });
    this.currentItemId = Item.id!;
    this.isEditMode = true;
  }

  deleteItem(id: string) {
    if (id) {
      this.firestoreService
        .deleteItem(id)
        .then(() => {
          alert('Item deleted successfully!');
          this.fetchitems();
        })
        .catch((error) => {
          console.error('Error deleting Item:', error);
          alert('Failed to delete Item');
        });
    }
  }

  resetForm() {
    this.ItemForm.reset();
    this.isEditMode = false;
    this.currentItemId = null;
  }
}

