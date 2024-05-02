import { ChangeDetectorRef, Directive } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[appCrunch]',
})
export class CrunchDirective {
  constructor(private _changeDetectorRef: ChangeDetectorRef) {}

  triggerChangeDetection(): void {
    this._changeDetectorRef.detectChanges();
  }
}
