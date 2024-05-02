import { ChangeDetectionStrategy, Component, inject, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ControlContainer, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { SuperStyledInputComponent } from "./super-styled-input/super-styled-input.component";
import { CrunchDirective } from "./crunch.directive";

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, SuperStyledInputComponent, CrunchDirective],
  selector: 'app-user-form',
  template: `
    @if (formGroup && groupName) {
      <div [formGroupName]="groupName">
        <app-super-styled-input
          controlName="firstName"
          label="First Name"
          appCrunch
          [errors]="errorsMap"
        ></app-super-styled-input>
        <app-super-styled-input
          controlName="lastName"
          label="Last Name"
          appCrunch
          [errors]="errorsMap"
        ></app-super-styled-input>
      </div>
    }
  `,
  viewProviders: [{
    provide: ControlContainer, useFactory: () => inject(ControlContainer, {skipSelf: true}),
  },],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserFormComponent implements OnInit {
  @ViewChildren(CrunchDirective) childFormGroupList: QueryList<CrunchDirective> | undefined;
  @Input() groupName: string | undefined;
  errorsMap = {
    required: 'Введите значение',
  }
  private _parentContainer = inject(ControlContainer);

  constructor(private _formBuilder: FormBuilder,) {
  }

  get formGroup(): FormGroup | undefined {
    const control = this._parentContainer.control;
    if (control instanceof FormGroup) {
      return control;
    }
    return undefined
  }

  ngOnInit(): void {
    if (this.formGroup && this.groupName) {
      const group = this._formBuilder.group({
        firstName: this._formBuilder.control<string | null>(null, Validators.required),
        lastName: this._formBuilder.control<string | null>(null, Validators.required),
      });

      this.formGroup.addControl(this.groupName, group);
    }
  }

  detectChanges(): void {
    this.formGroup?.markAllAsTouched()
    this.childFormGroupList?.forEach(component => component.triggerChangeDetection())
  }
}
