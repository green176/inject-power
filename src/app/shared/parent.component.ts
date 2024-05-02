import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { UserFormComponent } from "./user-form.component";
import { AddressFormComponent } from "./address-form.component";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";

@Component({
  standalone: true,
  imports: [
    UserFormComponent,
    AddressFormComponent,
    ReactiveFormsModule
  ],
  selector: 'app-parent',
  template: `
    <ng-container [formGroup]="form">
      <app-user-form groupName="user"></app-user-form>
      @if (isAddressVisible) {
        <app-address-form groupName="address"></app-address-form>
      }
      <div>
        <button (click)="toggleAddressForm()">{{ toggleButtonLabel }}</button>
        <button (click)="onSubmitClick()">Submit</button>
      </div>
    </ng-container>
  `,
  styles: [
    `
      :host {
        display: block;
        margin-left: auto;
        margin-right: auto;
        width: 18.75rem;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParentComponent {
  @ViewChild(UserFormComponent) userFormComponent: UserFormComponent | undefined;
  @ViewChild(AddressFormComponent) addressFormComponent: AddressFormComponent | undefined;
  form = this._formBuilder.group({})
  isAddressVisible = false;

  constructor(
    private _formBuilder: FormBuilder,
  ) {
  }

  get toggleButtonLabel(): string {
    const prefix = this.isAddressVisible ? 'Hide' : 'Show'
    return `${prefix} address form`
  }

  onSubmitClick(): void {
    this.form.markAsTouched()
    this.form.markAsDirty()
    this.userFormComponent?.detectChanges()
    this.addressFormComponent?.detectChanges()
    if (this.form.valid) {
      console.log(
        this.form.value
      )
    }
  }

  toggleAddressForm(): void {
    this.isAddressVisible = !this.isAddressVisible
  }
}
