import {Pipe} from '@angular/core';

@Pipe({
    name: 'formatName'
})
export class FormatNamePipe {
    transform(ojb): string {
        if (!ojb) {
            return 'Inconnu';
        }

        if (ojb.name) {
            return ojb.name;
        }

        var display = '';

        if (ojb.firstName != '') {
            display += ojb.firstName + ' ';
        }
        if (ojb.lastName != '') {
            display += ojb.lastName + ' ';
        }
        if (ojb.nickname != '') {

            if (display == '') {
                display += ojb.nickname + ' ';
            }
            else {
                display += '[' + ojb.nickname + '] ';
            }
        }

        if (display.length <= 1) {
            display = 'Sans Nom';
        }
        else {
            display = display.substr(0, display.length - 1);
        }

        return display;
    }
}