import { CommonModule } from '@angular/common';
import { Component, Input, forwardRef, input } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'form-textarea',
  templateUrl: './form-textarea.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],

  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormTextAreaComponent),
      multi: true,
    },
  ],
})
export class FormTextAreaComponent implements ControlValueAccessor {
  @Input({ required: true }) label!: string;
  @Input({ required: true }) control!: FormControl;

  type = input<'text' | 'password' | 'email'>('text');

  @Input() hideRequired = true;

  onChange = (_: any) => {};
  onTouched = () => {};

  writeValue(obj: any): void {
    this.control.setValue(obj);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
    this.control.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.control.disable() : this.control.enable();
  }

  hasError(type: string): boolean {
    const control = this.control;
    return control?.hasError(type) && control?.touched;
  }

  getError(type: string): any {
    const control = this.control;
    return control?.getError(type);
  }
}
