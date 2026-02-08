import { CommonModule } from '@angular/common';
import {
  Component,
  forwardRef,
  input,
  Input,
  TemplateRef,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { combineLatest, map, Observable, startWith, tap } from 'rxjs';

@Component({
  selector: 'form-autocomplete',
  standalone: true,
  templateUrl: './form-autocomplete.component.html',
  styleUrl: './form-autocomplete.component.scss',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatAutocompleteModule,

    MatInputModule,
    MatProgressBarModule,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormAutocompleteComponent),
      multi: true,
    },
  ],
})
export class FormAutocompleteComponent<T> implements ControlValueAccessor {
  @Input({ required: true }) control!: FormControl;
  @Input({ required: true }) label!: string;

  @Input({ required: true }) options$!: Observable<T[]>;
  filteredOptions$!: Observable<T[]>;

  loading = input<boolean>(false);

  @Input() displayWith: (option: T) => string = (o: any) => o?.toString();
  @Input() valueWith: (option: T) => any = (o: any) => o;
  @Input() optionTemplate?: TemplateRef<any>;
  @Input() hideRequired = true;

  displayWithFn = (value: any) => {
    const option = this.latestOptions.find((o) => this.valueWith(o) === value);

    return option ? this.displayWith(option) : '';
  };

  private _filter(value: string | T): T[] {
    const input = typeof value === 'string' ? value : this.displayWithFn(value);
    const filterValue = input.toLowerCase();
    return this.latestOptions.filter((option) =>
      this.displayWith(option).toLowerCase().includes(filterValue),
    );
  }

  latestOptions: T[] = [];

  ngOnInit() {
    this.filteredOptions$ = combineLatest([
      this.control.valueChanges.pipe(startWith(this.control.value)),
      this.options$.pipe(
        tap((options) => {
          this.latestOptions = options;
        }),
      ),
    ]).pipe(map(([value, _]) => this._filter(value)));
  }

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
