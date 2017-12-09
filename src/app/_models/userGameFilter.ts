import {Platform} from "./platform";
import {UserGame} from "./userGame";
import {Place} from "./place";
import {Contact} from "./contact";

export class UserGameFilter extends UserGame{
    platforms: Platform[] = [];
    purchasePlaces: Place[] = [];
    salePlaces: Place[] = [];
    purchaseContacts: Contact[] = [];
    saleContacts: Contact[] = [];
    ratingRange = [0,1000000];
    versions = [];
    progresses = [];
    minRating = 0;
    maxRating = 1000000;
    priceAskedRange = [0,1000000];
    pricePaidRange = [0,1000000];
    priceResaleRange = [0,1000000];
    priceSoldRange = [0,1000000];
    minPrice = 0;
    maxPrice = 1000000;

    addElement(arrayName, element) {
        this[arrayName].push(element);

        this[arrayName] = this[arrayName].filter(function(elem, index, self) {
            return index == self.indexOf(elem);
        });

        return this;
    }

    removeElement(arrayName, element) {
        var index = this[arrayName].indexOf(element, 0);
        if (index > -1) {
            this[arrayName].splice(index, 1);
        }

        return this;
    }
}