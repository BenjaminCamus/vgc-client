import {Pipe} from '@angular/core';
import {DatePipe} from "@angular/common";
import {FormatNamePipe} from "./formatName.pipe";
import {UserGame} from "../_models/userGame";
import {Game} from "../_models/game";

@Pipe({
    name: 'userGameValue'
})
export class UserGameValuePipe {

    userGameFieldTypes = {};
    gameFieldTypes = {};

    constructor(private datePipe: DatePipe,
                private formatNamePipe: FormatNamePipe) {

        var ug = new UserGame();
        this.userGameFieldTypes = ug.fieldTypes;
        var g = new Game();
        this.gameFieldTypes = g.fieldTypes;
    }

    transform(userGame: UserGame, objectField: string, detail: boolean = true): string {

        var fieldSplit = objectField.split('.');
        var object = fieldSplit[0];
        var field = fieldSplit[1];

        if (object === 'userGame') {
            var value = userGame[field];
            var type = this.userGameFieldTypes[field];
        }
        else {
            var value = userGame['game'][field];
            var type = this.gameFieldTypes[fieldSplit[1]];
        }

        if ((!value || value.length == 0) && type != 'completeness' && type != 'progress' && type != 'cond') {
            return '•';
        }

        switch (type) {

            case 'price':
                value = parseFloat(value);
                value = value + '&nbsp;€';

                var field1 = field;
                var field2 = field;

                if (field == 'pricePaid') {
                    field1 = 'priceAsked';
                }
                else if (field == 'priceResale' || field == 'priceSold') {
                    field2 = 'pricePaid';
                }

                if (parseFloat(userGame[field1]) > parseFloat(userGame[field2])) {
                    value = '<span class="text-success">' + value;

                    if (detail) {
                        value += ' (';
                        if (field1 == field) {
                            value += '+';
                        }
                        else {
                            value += '-';
                        }
                        value += (parseFloat(userGame[field1]) - parseFloat(userGame[field2])).toPrecision(2) + ')';
                    }

                    value = value + '</span>';
                }

                value = value.replace(/\.0\)/gi, ')').replace('.', ',');
                break;

            case 'date':
                value = this.datePipe.transform(value, 'dd/MM/yyyy');
                break;

            case 'name':
                value = this.formatNamePipe.transform(value);
                break;

            case 'completeness':
            case 'progress':
            case 'cond':
                value = 'enum.' + field + '.' + value;
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
                value = '<a href="' + value + '" target="_blank">' + value.replace(/https:\/\/www./gi, '') + '</a>'
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

                value += '<span class="label"> / 20</span>';
                break;
        }

        return nl2br(value, true);
    }
}

function nl2br (str, is_xhtml) {
    if (typeof str === 'undefined' || str === null) {
        return '';
    }
    var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
}
