import { ChangeDetectionStrategy, Component, HostBinding, inject, Input } from '@angular/core';
import { ControlContainer, FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  selector: 'app-super-styled-input',
  template: `
    @if (controlName) {
      <label [for]="controlName" class="styled-input__label">
        {{ label }}
      </label>
      <input class="styled-input__field" type="text" [name]="controlName" [formControlName]="controlName">
      @if (controlFirstError) {
        <span class="styled-input__error"> {{ controlFirstError }} </span>
      }
    }
  `,
  styleUrl: './super-styled-input.component.scss',
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, {skipSelf: true}),
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuperStyledInputComponent {
  @HostBinding('class') hostClass = 'styled-input';
  @HostBinding('class.styled-input--error') get isErrorClass(): boolean {
    return !!this.controlFirstError;
  }
  @Input() controlName: string | undefined;
  @Input() label: string | undefined;
  @Input() errors: Record<string, string> | undefined;
  private _parentContainer = inject(ControlContainer);

  get control(): FormControl | undefined {
    const control = this._parentContainer.control;
    if (control instanceof FormGroup && control && this.controlName) {
      const abstractControl = control.get(this.controlName);
      if (abstractControl instanceof FormControl) {
        return abstractControl;
      }
      return undefined
    }
    return undefined
  }

  get controlFirstError(): string | undefined {
    if (this.control?.touched) {
      const errorKeys = Object.keys(this.errors ?? {}).filter(key => this.control?.errors?.[key]);
      if (errorKeys.length) {
        return this.errors?.[errorKeys[0]];
      }
      return undefined
    }
    return undefined
  }
}
