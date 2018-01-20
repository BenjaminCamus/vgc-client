import {Pipe} from '@angular/core';

@Pipe({
    name: 'formatName'
})
export class FormatNamePipe {
    transform(obj, long = false): string {
        if (!obj) {
            return 'Inconnu';
        }

        if (obj.name) {
            return obj.name;
        }

        var display = '';

        display = this.concatDisplay(display, obj.firstName);
        display = this.concatDisplay(display, obj.lastName);

        if (long) {
            display = obj.nickname == obj.firstName ? display : this.concatDisplay(display, obj.nickname);
            display = this.concatDisplay(display, obj.email);
            display = !obj.phone || obj.phone == 0 ? display : this.concatDisplay(display, '0'+obj.phone);
            display = this.concatDisplay(display, obj.address);
            display = !obj.zipcode || obj.zipcode == 0 ? display : this.concatDisplay(display, obj.zipcode);
            display = this.concatDisplay(display, obj.city);
        }

        if (display.length == 0) {
            display = 'Sans Nom';
        }

        return display;
    }

    private concatDisplay(display, param) {
        if (param) {
            if (display != '') {
                display += ' ';
            }

            display += param;
        }

        return display;
    }
}