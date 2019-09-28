import {Pipe} from '@angular/core';
import {UserGame} from '../_models/userGame';
import {Game} from '../_models/game';

@Pipe({
    name: 'wrapValue'
})
export class WrapValuePipe {

    userGameFieldTypes = {};
    gameFieldTypes = {};

    constructor() {

        let ug = new UserGame();
        this.userGameFieldTypes = ug.fieldTypes;
        let g = new Game();
        this.gameFieldTypes = g.fieldTypes;
    }

    transform(content: string, userGame: UserGame, objectField: string): string {

        let fieldSplit = objectField.split('.');
        let object = fieldSplit[0];
        let field = fieldSplit[1];
        let value = userGame['game'][field];
        let type = this.gameFieldTypes[fieldSplit[1]];

        if (object === 'userGame') {
            value = userGame[field];
            type = this.userGameFieldTypes[field];
        }

        if ((!value || value.length == 0) && type != 'completeness' && type != 'progress' && type != 'cond') {
            return content;
        }

        switch (type) {
            case 'completeness':
                switch (content) {
                    case 'LOOSE':
                    case 'NO_MANUAL':
                    case 'NO_BOX':
                        content = '<span class="text-warning">' + content + '</span>';
                        break;
                    case 'COMPLETE':
                    case 'NEW':
                        content = '<span class="text-success">' + content + '</span>';
                        break;
                    case 'DEMATERIALIZED':
                        content = '<span class="text-info">' + content + '</span>';
                        break;
                }
                break;
            case 'progress':
                switch (content) {
                    case 'NEVER_PLAYED':
                        content = '<span class="text-danger"><i class="fas fa-battery-empty"></i> ' + content + '</span>';
                        break;
                    case 'IN_PROGRESS':
                        content = '<span class="text-warning"><i class="fas fa-battery-half"></i> ' + content + '</span>';
                        break;
                    case 'FINISHED':
                        content = '<span class="text-success"><i class="fas fa-battery-full"></i> ' + content + '</span>';
                        break;
                    case 'ABANDONED':
                        content = '<span class="text-info"><i class="fas fa-battery-empty"></i> ' + content + '</span>';
                        break;
                }
                break;
            case 'cond':
                switch (content) {
                    case 'BAD':
                        content = '<span class="text-danger">' + content + '</span>';
                        break;
                    case 'GOOD':
                        content = '<span class="text-warning">' + content + '</span>';
                        break;
                    case 'VERY_GOOD':
                    case 'NEAR_MINT':
                    case 'MINT':
                        content = '<span class="text-success">' + content + '</span>';
                        break;
                }
                break;
        }

        return content;
    }
}
