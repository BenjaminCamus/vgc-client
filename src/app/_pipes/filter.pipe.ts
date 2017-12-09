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
             * Object Tags : platform, dates, contacts
             */

            return (this.filterTags('platform', filter, item)
            && this.filterTags('purchasePlace', filter, item)
            && this.filterTags('purchaseContact', filter, item)
            && this.filterTags('salePlace', filter, item)
            && this.filterTags('saleContact', filter, item));
        }).filter(item => {
            /**
             * Object Tags : platform, dates, contacts
             */

            return (this.filterTags('platform', filter, item)
            && this.filterTags('purchasePlace', filter, item)
            && this.filterTags('purchaseContact', filter, item)
            && this.filterTags('salePlace', filter, item)
            && this.filterTags('saleContact', filter, item)
            && this.filterTags('progress', filter, item));
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
        let filterKey = tagType == 'progress' ? tagType+'es' : tagType+'s';
        if (filter[filterKey] && filter[filterKey].length > 0) {
            if (item[tagType] === undefined) {
                return false;
            }

            if (typeof item[tagType] == "number" || typeof item[tagType] == "string") {
                if (filter[filterKey].indexOf(item[tagType]) > -1) {
                    return true;
                }

                return false;
            }

            if (deepIndexOf(filter[filterKey], item[tagType]) > -1) {
                return true;
            }

            return false;
        }

        return true;
    }

    private filterRange(range: number[], val: number) {
        if (val >= range[0] && val <= range[1]) {
            return true;
        }

        return false;
    }
}