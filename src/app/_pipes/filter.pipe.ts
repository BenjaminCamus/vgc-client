import {Pipe, PipeTransform} from '@angular/core';
import {UserGame} from "../_models/userGame";
import {deepIndexOf} from "../functions";
import {UserGameFilter} from "../_models/userGameFilter";

@Pipe({
    name: 'filter',
    pure: false
})

export class FilterPipe implements PipeTransform {
    transform(items: UserGame[], filter: UserGameFilter): Array<any> {
        return items.filter(item => {
            /**
             * Title
             */
            if (item.game.name.toLowerCase().includes(filter.game.name.toLowerCase())) {
                return true;
            }


        }).filter(item => {
            /**
             * Platform
             */
            if (filter.platforms && filter.platforms.length > 0) {
                if (deepIndexOf(filter.platforms, item.platform) > -1) {
                    return true;
                }

                return false;
            }

            return true;
        }).filter(item => {
            /**
             * Developers
             */
            if (filter.game.developers && filter.game.developers.length > 0) {
                for (let developer of filter.game.developers) {

                    if (deepIndexOf(item.game.developers, developer) > -1) {
                        return true;
                    }
                }

                return false;
            }

            return true;
        }).filter(item => {
            /**
             * Publishers
             */
            if (filter.game.publishers && filter.game.publishers.length > 0) {
                for (let publisher of filter.game.publishers) {

                    if (deepIndexOf(item.game.publishers, publisher) > -1) {
                        return true;
                    }
                }

                return false;
            }

            return true;
        });
    }
}