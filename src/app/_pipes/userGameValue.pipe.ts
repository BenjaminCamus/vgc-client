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
                value = value.toString().replace('.', ',');
                value = value + ' €';

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
