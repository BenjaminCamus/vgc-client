import {Game} from "./game";
import {Platform} from "./platform";
import {UserGame} from "./userGame";

export class UserGameFilter extends UserGame{
    platforms: Platform[] = [];
    ratingRange = [0,1000000];
    minRating = 0;
    maxRating = 1000000;
    priceAskedRange = [0,1000000];
    pricePaidRange = [0,1000000];
    priceResaleRange = [0,1000000];
    priceSoldRange = [0,1000000];
    minPrice = 0;
    maxPrice = 1000000;

    addPlatform(platform: Platform) {
        this.platforms.push(platform);

        this.platforms = this.platforms.filter(function(elem, index, self) {
            return index == self.indexOf(elem);
        });

        return this;
    }

    removePlatform(platform: Platform) {
        var index = this.platforms.indexOf(platform, 0);
        if (index > -1) {
            this.platforms.splice(index, 1);
        }

        return this;
    }
}