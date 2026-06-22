import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { InputText as PrimeInputText } from 'primeng/inputtext';
import { Password } from 'primeng/password';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input-text',
  standalone: true,
  imports: [CommonModule, PrimeInputText, Password, IconField, InputIcon, ReactiveFormsModule, FormsModule],
  templateUrl: './input-text.html',
  styleUrl: './input-text.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputText),
      multi: true
    }
  ]
})
export class InputText implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() type: string = 'text';
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() errorMessage: string = '';
  @Input() icon: string = '';
  @Input() iconPos: 'left' | 'right' = 'left';
  @Input() feedback: boolean = false;
  @Input() toggleMask: boolean = true;
  @Input() invalid: any = false;
  @Input() control?: any; // Agregando soporte opcional para pasar el control directamente

  value: string = '';
  onChange: any = () => { };
  onTouched: any = () => { };

  writeValue(value: any): void {
    this.value = value || '';
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

  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.value = input.value;
    this.onChange(this.value);
    this.onTouched();
  }

  onInputChangeDesdeModel(value: any): void {
    this.value = value;
    this.onChange(this.value);
    this.onTouched();
  }
}
