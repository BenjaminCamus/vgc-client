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

    transform(userGame: UserGame, field: any, detail: boolean = true): string {

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

                    if (detail) {
                        value += ' (';
                        if (field1 == field.name) {
                            value += '+';
                        }
                        else {
                            value += '-';
                        }
                        value += (parseFloat(userGame[field1]) - parseFloat(userGame[field2])) + ')';
                    }

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
                    value = '<span class="text-warning">Loose</span>';
                }
                else if (value == 1) {
                    value = '<span class="text-warning">Sans Notice</span>';
                }
                else if (value == 2) {
                    value = '<span class="text-warning">Sans Boîte</span>';
                }
                else if (value == 3) {
                    value = '<span class="text-success">Complet</span>';
                }
                else if (value == 4) {
                    value = '<span class="text-info">Dématérialisé</span>';
                }
                else if (value == 5) {
                    value = '<span class="text-success">Neuf</span>';
                }
                break;
            case 'progress':
                if (value == 0) {
                    value = '<span class="text-danger"><i class="fas fa-battery-empty"></i> Jamais joué</span>';
                }
                else if (value == 1) {
                    value = '<span class="text-warning"><i class="fas fa-battery-half"></i> En cours</span>';
                }
                else if (value == 2) {
                    value = '<span class="text-success"><i class="fas fa-battery-full"></i> Terminé</span>';
                }
                else if (value == 3) {
                    value = '<span class="text-info"><i class="fas fa-battery-empty"></i> Abandonné</span>';
                }
                break;
            case 'cond':
                if (value == 0) {
                    value = '<span class="text-danger">Bof Bof</span>';
                }
                else if (value == 1) {
                    value = '<span class="text-warning">Bon État</span>';
                }
                else if (value == 2) {
                    value = '<span class="text-success">Très Bon État</span>';
                }
                else if (value == 3) {
                    value = '<span class="text-success">Near Mint</span>';
                }
                else if (value == 4) {
                    value = '<span class="text-success">Mint !!</span>';
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

            case 'rating':
                if (value <= 5) {
                    value = '<span class="text-danger">' + value + '</span>';
                }
                else if (value > 5 && value < 15) {
                    value = '<span class="text-warning">' + value + '</span>';
                }
                else {
                    value = '<span class="text-success">' + value + '</span>';
                }
                break;
        }

        return value;
    }
}
