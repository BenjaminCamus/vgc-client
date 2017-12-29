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
             * Tags
             */
            return (this.filterTags('platform', filter, item)
            && this.filterTags('purchasePlace', filter, item)
            && this.filterTags('purchaseContact', filter, item)
            && this.filterTags('salePlace', filter, item)
            && this.filterTags('saleContact', filter, item)
            && this.filterTags('progress', filter, item)
            && this.filterTags('version', filter, item)
            && this.filterTags('developers', filter, item)
            && this.filterTags('publishers', filter, item)
            && this.filterTags('modes', filter, item)
            && this.filterTags('themes', filter, item)
            && this.filterTags('genres', filter, item));
        }).filter(item => {
            /**
             * Rating
             */
            if (filter.ratingRange) {
                if (item.rating >= filter.ratingRange[0] && item.rating <= filter.ratingRange[1]) {
                    return true;
                }

                return false;
            }

            return true;
        }).filter(item => {
            /**
             * Ranges : rating, prices
             */
            return (this.filterRange(filter.ratingRange, item.rating)
            && this.filterRange(filter.priceAskedRange, item.priceAsked)
            && this.filterRange(filter.pricePaidRange, item.pricePaid)
            && this.filterRange(filter.priceResaleRange, item.priceResale)
            && this.filterRange(filter.priceSoldRange, item.priceSold));
        });
    }

    private filterTags(tagType, filter, item) {

        let gameTagTypes = ['developers', 'publishers', 'modes', 'themes', 'genres'];

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
            if (item[tagType] !== undefined && item[tagType] !== null && filter[filterKey] && filter[filterKey].length > 0) {

                if (typeof item[tagType] == "number" || typeof item[tagType] == "string") {
                    if (filter[filterKey].indexOf(item[tagType]) > -1) {
                        return true;
                    }
                }

                else if (deepIndexOf(filter[filterKey], item[tagType]) > -1) {
                    return true;
                }

                return false;
            }

            return true;
        }
    }

    private filterRange(range: number[], val: number) {
        if (val >= range[0] && val <= range[1]) {
            return true;
        }

        return false;
    }
}