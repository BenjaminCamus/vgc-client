import {Pipe, PipeTransform} from '@angular/core';
import {UserGame} from "../_models/userGame";
import {deepIndexOf} from "../functions";
import {UserGameFilter} from "../_models/userGameFilter";

@Pipe({
    name: 'filter',
    pure: false
})

export class FilterPipe implements PipeTransform {
    transform(items: UserGame[], filter: UserGameFilter): UserGame[] {

        return items.filter(item => {
            /**
             * Title
             */
            if (item.game.name.toLowerCase().includes(filter.game.name.toLowerCase())) {
                return true;
            }
        }).filter(item => {
            /**
             * Tags
             */
            return (FilterPipe.filterTags('platform', filter, item)
            && FilterPipe.filterTags('purchasePlace', filter, item)
            && FilterPipe.filterTags('purchaseContact', filter, item)
            && FilterPipe.filterTags('salePlace', filter, item)
            && FilterPipe.filterTags('saleContact', filter, item)
            && FilterPipe.filterTags('progress', filter, item)
            && FilterPipe.filterTags('cond', filter, item)
            && FilterPipe.filterTags('completeness', filter, item)
            && FilterPipe.filterTags('version', filter, item)
            && FilterPipe.filterTags('series', filter, item)
            && FilterPipe.filterTags('developers', filter, item)
            && FilterPipe.filterTags('publishers', filter, item)
            && FilterPipe.filterTags('modes', filter, item)
            && FilterPipe.filterTags('themes', filter, item)
            && FilterPipe.filterTags('genres', filter, item));
        }).filter(item => {
            /**
             * Rating
             */
            if (filter.ratingRange) {
                return item.rating >= filter.ratingRange[0] && item.rating <= filter.ratingRange[1];
            }

            return true;
        }).filter(item => {
            /**
             * Ranges : rating, prices
             */
            return (FilterPipe.filterRange(filter.ratingRange, item.rating)
            && FilterPipe.filterRange(filter.priceAskedRange, item.priceAsked)
            && FilterPipe.filterRange(filter.pricePaidRange, item.pricePaid)
            && FilterPipe.filterRange(filter.priceResaleRange, item.priceResale)
            && FilterPipe.filterRange(filter.priceSoldRange, item.priceSold));
        }).filter(item => {
            /**
             * Release Year
             */
            // if (item.releaseDate) {
            //     return FilterPipe.filterRange(filter.releaseYearRange, item.releaseDate().getFullYear());
            // }

            return true;
        }).filter(item => {
            /**
             * Purchase Year
             */
            if (item.purchaseDate) {
                return FilterPipe.filterRange(filter.purchaseYearRange, item.purchaseDate.getFullYear());
            }

            return true;
        });
    }

    private static filterTags(tagType, filter, item) {

        let gameTagTypes = ['series', 'developers', 'publishers', 'modes', 'themes', 'genres'];

        if (gameTagTypes.indexOf(tagType) > -1 && filter.game[tagType] && filter.game[tagType].length > 0) {

            if (item.game[tagType] && item.game[tagType].length > 0) {
                for (let tag of filter.game[tagType]) {

                    if (deepIndexOf(item.game[tagType], tag) > -1) {
                        return true;
                    }
                }
            }

            return false;
        }
        else {
            let filterKey = tagType == 'progress' ? tagType + 'es' : tagType + 's';
            if (filter[filterKey] && filter[filterKey].length > 0) {

                if (item[tagType] !== undefined && item[tagType] !== null) {

                    if (typeof item[tagType] == "number" || typeof item[tagType] == "string") {
                        if (filter[filterKey].indexOf(item[tagType]) > -1) {
                            return true;
                        }
                    }

                    else if (deepIndexOf(filter[filterKey], item[tagType]) > -1) {
                        return true;
                    }
                }

                return false;
            }

            return true;
        }
    }

    private static filterRange(range: number[], val: number) {

        return val >= range[0] && val <= range[1];
    }
}
