import {Pipe} from '@angular/core';
import {UserGame} from "../_models/userGame";
import {Game} from "../_models/game";

@Pipe({
    name: 'wrapValue'
})
export class WrapValuePipe {

    userGameFieldTypes = {};
    gameFieldTypes = {};

    constructor() {

        var ug = new UserGame();
        this.userGameFieldTypes = ug.fieldTypes;
        var g = new Game();
        this.gameFieldTypes = g.fieldTypes;
    }

    transform(content: string, userGame: UserGame, objectField: string): string {
        
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
            return content;
        }

        switch (type) {
            case 'completeness':

                if (value == 0) {
                    content = '<span class="text-warning">' + content + '</span>';
                }
                else if (value == 1) {
                    content = '<span class="text-warning">' + content + '</span>';
                }
                else if (value == 2) {
                    content = '<span class="text-warning">' + content + '</span>';
                }
                else if (value == 3) {
                    content = '<span class="text-success">' + content + '</span>';
                }
                else if (value == 4) {
                    content = '<span class="text-info">' + content + '</span>';
                }
                else if (value == 5) {
                    content = '<span class="text-success">' + content + '</span>';
                }

                break;
            case 'progress':
                if (value == 0) {
                    content = '<span class="text-danger"><i class="fas fa-battery-empty"></i> ' + content + '</span>';
                }
                else if (value == 1) {
                    content = '<span class="text-warning"><i class="fas fa-battery-half"></i> ' + content + '</span>';
                }
                else if (value == 2) {
                    content = '<span class="text-success"><i class="fas fa-battery-full"></i> ' + content + '</span>';
                }
                else if (value == 3) {
                    content = '<span class="text-info"><i class="fas fa-battery-empty"></i> ' + content + '</span>';
                }
                break;
            case 'cond':
                if (value == 0) {
                    content = '<span class="text-danger">' + content + '</span>';
                }
                else if (value == 1) {
                    content = '<span class="text-warning">' + content + '</span>';
                }
                else if (value == 2) {
                    content = '<span class="text-success">' + content + '</span>';
                }
                else if (value == 3) {
                    content = '<span class="text-success">' + content + '</span>';
                }
                else if (value == 4) {
                    content = '<span class="text-success">' + content + '</span>';
                }
                break;
        }

        return content;
    }
}
