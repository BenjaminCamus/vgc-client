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

        if ((!value || value.length == 0) && field.type != 'completeness' && field.type != 'progress' && field.type != 'cond') {
            return '•';
        }

        switch (field.type) {
            case 'price':
                value = parseFloat(value);
                value = value.toString().replace('.', ',');
                value = value + ' €';

                var field1 = field.name;
                var field2 = field.name;

                if (field.name == 'pricePaid') {
                    field1 = 'priceAsked';
                }
                else if (field.name == 'priceResale' || field.name == 'priceSold') {
                    field2 = 'pricePaid';
                }

                if (parseFloat(userGame[field1]) > parseFloat(userGame[field2])) {
                    value = '<span class="text-success">' + value;
                    value += ' (';
                    if (field1 == field.name) {
                        value += '+';
                    }
                    else {
                        value += '-';
                    }
                    value += (parseFloat(userGame[field1]) - parseFloat(userGame[field2])) + ')';
                    value = value + '</span>';
                }
                break;
            case 'date':
                value = this.datePipe.transform(value, 'dd/MM/yy');
                break;
            case 'name':
                value = this.formatNamePipe.transform(value);
                break;
            case 'completeness':
                if (value == 0) {
                    value = 'Loose';
                }
                else if (value == 1) {
                    value = 'Sans Notice';
                }
                else if (value == 2) {
                    value = 'Sans Boîte';
                }
                else if (value == 3) {
                    value = 'Complet';
                }
                else if (value == 4) {
                    value = 'Dématérialisé';
                }
                else if (value == 5) {
                    value = 'Neuf';
                }
                break;
            case 'progress':
                if (value == 0) {
                    value = 'Jamais joué';
                }
                else if (value == 1) {
                    value = 'En cours';
                }
                else if (value == 2) {
                    value = 'Terminé';
                }
                else if (value == 3) {
                    value = 'Abandonné';
                }
                break;
            case 'cond':
                if (value == 0) {
                    value = 'Bof Bof';
                }
                else if (value == 1) {
                    value = 'Bon État';
                }
                else if (value == 2) {
                    value = 'Très Bon État';
                }
                else if (value == 3) {
                    value = 'Near Mint';
                }
                else if (value == 4) {
                    value = 'Mint !!';
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
