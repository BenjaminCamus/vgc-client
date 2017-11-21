import {Component, EventEmitter} from "@angular/core";
import {Input, Output} from "@angular/core/src/metadata/directives";

@Component({
    moduleId: module.id,
    selector: 'tag',
    templateUrl: './tag.component.html',
})
export class TagComponent {

    @Input() tag: string;
    @Input() suffix: string | null = null;
    @Output() uploaded: EventEmitter<any> = new EventEmitter();

    active: boolean = false;

    constructor() {
    }

    toggleActive() {
        this.active = !this.active;
        this.uploaded.emit(this.active);
    }
}