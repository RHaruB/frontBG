import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-button',
    imports: [CommonModule],
    templateUrl: './button.html',
    styleUrl: './button.css'
})
export class Button {
    @Input() label: string = '';
    @Input() type: 'button' | 'submit' | 'reset' = 'button';
    @Input() variant: 'primary' | 'secondary' | 'outline' | 'text' = 'primary';
    @Input() size: 'small' | 'medium' | 'large' = 'medium';
    @Input() disabled: boolean = false;
    @Input() loading: boolean = false;
    @Input() icon: string = '';
    @Input() iconPos: 'left' | 'right' = 'left';
    @Input() fullWidth: boolean = false;

    @Output() onClick = new EventEmitter<Event>();

    handleClick(event: Event): void {
        if (!this.disabled && !this.loading) {
            this.onClick.emit(event);
        }
    }

    get buttonClasses(): string {
        const classes = ['app-button'];

        classes.push(`app-button--${this.variant}`);
        classes.push(`app-button--${this.size}`);

        if (this.disabled) classes.push('app-button--disabled');
        if (this.loading) classes.push('app-button--loading');
        if (this.fullWidth) classes.push('app-button--full-width');

        return classes.join(' ');
    }
}
