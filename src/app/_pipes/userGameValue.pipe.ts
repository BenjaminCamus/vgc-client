import {Pipe} from '@angular/core';
import {DatePipe} from "@angular/common";
import {FormatNamePipe} from "./formatName.pipe";
import {UserGame} from "../_models/userGame";

@Pipe({
    name: 'userGameValue'
})
export class UserGameValuePipe {

    userGameFields = [];

    constructor(private datePipe: DatePipe,
                private formatNamePipe: FormatNamePipe) {

        var ug = new UserGame();
        this.userGameFields = ug.fields;
    }

    transform(userGame: UserGame, field: any): string {

        if (field.name.indexOf('.') > -1) {
            var fieldSplit = field.name.split('.');
            var value = userGame[fieldSplit[0]][fieldSplit[1]];
        }
        else {
            var value = userGame[field.name];
        }

        if (!value && field.type != 'state') {
            return '•';
        }

        switch (field.type) {
            case 'price':
                value += ' €';
                break;
            case 'date':
                value = this.datePipe.transform(value, 'd MMM yy');
                break;
            case 'name':
                value = this.formatNamePipe.transform(value);
                break;
            case 'state':
                if (userGame.box) {
                    if (userGame.manual) {
                        value = 'Complet';
                    }
                    else {
                        value = 'Boîte sans livret';
                    }
                }
                else {
                    if (userGame.manual) {
                        value = 'Livret sans boîte';
                    }
                    else {
                        value = 'Loose';
                    }
                }
                break;
            case 'tags':
                var tags = '';
                for (let index in value) {

                    if (tags != '') {
                        tags += ', '
                    }

                    tags += value[index].name;
                }
                value = tags;
                break;

            case 'url':
                value = '<a href="' + value + '" target="_blank">' + value + '</a>'
                break;
        }

        return value;
    }
}