import { ChangeDetectionStrategy, Component, inject, Input, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ControlContainer, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { SuperStyledInputComponent } from "./super-styled-input/super-styled-input.component";
import { CrunchDirective } from "./crunch.directive";

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SuperStyledInputComponent,
    CrunchDirective
  ],
  selector: 'app-address-form',
  template: `
    @if (formGroup && groupName) {
      <div [formGroupName]="groupName" >
        <app-super-styled-input
          controlName="city"
          label="City"
          appCrunch
          [errors]="errorsMap"
        ></app-super-styled-input>
        <app-super-styled-input
          controlName="street"
          label="Street"
          appCrunch
          [errors]="errorsMap"
        ></app-super-styled-input>
      </div>
    }
  `,
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true }),
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressFormComponent  implements OnInit, OnDestroy {
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
        city: this._formBuilder.control<string | null>(null, Validators.required),
        street: this._formBuilder.control<string | null>(null, Validators.required),
      });

      this.formGroup.addControl(this.groupName, group);
    }
  }

  ngOnDestroy(): void {
    if (this.formGroup && this.groupName) {
      this.formGroup.removeControl(this.groupName);
    }
  }

  detectChanges(): void {
    this.formGroup?.markAllAsTouched()
    this.childFormGroupList?.forEach(component => component.triggerChangeDetection())
  }
}
