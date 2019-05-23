import {Pipe} from '@angular/core';

@Pipe({
    name: 'formatName'
})
export class FormatNamePipe {
    transform(obj, long = false): string {
        if (!obj) {
            return 'Inconnu';
        }

        // Ex: Game title (name)
        if (obj.name) {
            if (long) {
                return obj.name.replace(':', ':<br />').replace('(', '<br />(');
            }
            else {
                return obj.name;
            }
        }

        // Contact
        var display = '';

        display = FormatNamePipe.concatDisplay(display, obj.firstName);
        display = FormatNamePipe.concatDisplay(display, obj.lastName);
        display = obj.nickname == obj.firstName ? display : FormatNamePipe.concatDisplay(display, obj.nickname);

        if (long) {
            display = FormatNamePipe.concatDisplay(display, obj.email);
            display = !obj.phone || obj.phone == 0 ? display : FormatNamePipe.concatDisplay(display, '0'+obj.phone);
            display = FormatNamePipe.concatDisplay(display, obj.address);
            display = !obj.zipcode || obj.zipcode == 0 ? display : FormatNamePipe.concatDisplay(display, obj.zipcode);
            display = FormatNamePipe.concatDisplay(display, obj.city);
        }

        if (display.length == 0) {
            display = 'Sans Nom';
        }

        return display;
    }

    private static concatDisplay(display, param) {
        if (param) {
            if (display != '') {
                display += ' ';
            }

            display += param;
        }

        return display;
    }
}