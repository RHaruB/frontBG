import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Select as PrimeSelect } from 'primeng/select';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-select',
  imports: [CommonModule, PrimeSelect, ReactiveFormsModule, FormsModule],
  templateUrl: './select.html',
  styleUrl: './select.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Select),
      multi: true
    }
  ]
})
export class Select implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() placeholder: string = 'Seleccione una opción';
  @Input() options: any[] = [];
  @Input() optionLabel: string = 'label';
  @Input() optionValue: string = 'value';
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() errorMessage: string = '';
  @Input() filter: boolean = true;
  @Input() showClear: boolean = true;
  @Input() invalid: any = false;

  value: any = null;
  onChange: any = () => { };
  onTouched: any = () => { };

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onSelectChange(event: any): void {
    this.value = event.value;
    this.onChange(this.value);
    this.onTouched();
  }
}
