import {Directive, Input} from "@angular/core/src/metadata/directives";
import {OnInit, ElementRef, Renderer} from "@angular/core";
@Directive({ selector: '[focus]' })
export class FocusDirective implements OnInit {

    @Input('focus') isFocused: boolean;

    constructor(private hostElement: ElementRef, private renderer: Renderer) {}

    ngOnInit() {
        if (this.isFocused) {
            this.renderer.invokeElementMethod(this.hostElement.nativeElement, 'focus');
        }
    }
}