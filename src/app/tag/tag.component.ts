import {Component, EventEmitter, Input, Output} from "@angular/core";
import {deepIndexOf} from "../functions";
import {FormatNamePipe} from "../_pipes/formatName.pipe";

@Component({
    moduleId: module.id,
    selector: 'tag',
    templateUrl: './tag.component.html',
})
export class TagComponent {

    @Input() tag: any;
    @Input() value: any;
    @Input() platform = false;
    tagLabel: string;
    _filter: any;
    @Input() set filter(filter: any) {
        this._filter = filter;

        if (typeof this.tag === 'number' || typeof this.tag === 'string') {
            this.tagLabel = this.tag + '';
        } else {
            this.tagLabel = this.formatNamePipe.transform(this.tag);
        }

        this.setActive();
    }
    @Input() suffix: string | null = null;
    @Output() uploaded: EventEmitter<any> = new EventEmitter();

    active: boolean = false;

    constructor(private formatNamePipe: FormatNamePipe) {
    }

    setActive() {

        if (this._filter && this._filter.length > 0) {

            let search = this.value || this.value === 0 ? this.value : this.tag;

            if (typeof search == 'number' || typeof search == 'string') {
                if (this._filter.indexOf(search) > -1) {
                    this.active = true;
                }
            }

            else if (deepIndexOf(this._filter, search) > -1) {
                this.active = true;
            }
        }
    }

    toggleActive() {
        this.active = !this.active;
        this.uploaded.emit(this.active);
    }
}
