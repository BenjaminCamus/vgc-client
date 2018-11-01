import {Platform} from "./platform";
import {UserGame} from "./userGame";
import {Contact} from "./contact";
import {orderByCount, formatDate} from "../functions";

export class UserGameFilter extends UserGame {

    stats;

    platforms: Platform[] = [];
    purchasePlaces: string[] = [];
    salePlaces: string[] = [];
    purchaseContacts: Contact[] = [];
    saleContacts: Contact[] = [];
    versions = [];
    progresses = [];
    completenesss = [];
    conds = [];

    ratingRange = [0, 1000000];
    minRating = 0;
    maxRating = 1000000;

    priceAskedRange = [0, 1000000];
    pricePaidRange = [0, 1000000];
    priceResaleRange = [0, 1000000];
    priceSoldRange = [0, 1000000];
    minPrice = 0;
    maxPrice = 1000000;

    releaseYearRange = [0, 1000000];
    minReleaseYear = 0;
    maxReleaseYear = 1000000;
    purchaseYearRange = [0, 1000000];
    minPurchaseYear = 0;
    maxPurchaseYear = 1000000;

    addElement(arrayName, element) {
        this[arrayName].push(element);

        this[arrayName] = this[arrayName].filter(function (elem, index, self) {
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

    setStats(userGames: UserGame[]) {

        this.stats = {
            tags: {
                purchasePlace: [],
                salePlace: [],
                purchaseContact: [],
                saleContact: [],
                purchaseDate: [],
                saleDate: [],
                platform: [],
                series: [],
                developers: [],
                publishers: [],
                modes: [],
                themes: [],
                genres: [],

                version: ['FRA', 'EUR', 'JAP', 'USA'],
                progress: [0, 1, 2, 3],
                cond: [0, 1, 2, 3, 4],
                completeness: [0, 1, 2, 3, 4, 5],

                pricePaid: [],
                priceAsked: [],
                priceResale: [],
                priceSold: [],

                rating: [],
                ratingIGDB: []

            },
            count: {
                purchasePlace: [],
                salePlace: [],
                purchaseContact: [],
                saleContact: [],
                purchaseDate: [],
                saleDate: [],
                platform: [],
                series: [],
                developers: [],
                publishers: [],
                modes: [],
                themes: [],
                genres: [],

                version: [],
                progress: [],
                cond: [],
                completeness: [],

                pricePaid: [],
                priceAsked: [],
                priceResale: [],
                priceSold: [],

                rating: [],
                ratingIGDB: []
            }
        };

        var minRating = 20;
        var maxRating = 0;
        var minPrice = 1000000000;
        var maxPrice = 0;
        var minReleaseYear = 1000000000;
        var maxReleaseYear = 0;
        var minPurchaseYear = 1000000000;
        var maxPurchaseYear = 0;

        for (let userGame of userGames) {

            // Rating
            if (userGame.rating < minRating) {
                minRating = userGame.rating;
            }

            if (userGame.rating > maxRating) {
                maxRating = userGame.rating;
            }

            // Release Year
            if (userGame.releaseDate && userGame.releaseDate.getFullYear() < minReleaseYear) {
                minReleaseYear = userGame.releaseDate.getFullYear();
            }

            if (userGame.releaseDate && userGame.releaseDate.getFullYear() > maxReleaseYear) {
                maxReleaseYear = userGame.releaseDate.getFullYear();
            }

            // Purchase Year
            if (userGame.purchaseDate && userGame.purchaseDate.getFullYear() < minPurchaseYear) {
                minPurchaseYear = userGame.purchaseDate.getFullYear();
            }

            if (userGame.purchaseDate && userGame.purchaseDate.getFullYear() > maxPurchaseYear) {
                maxPurchaseYear = userGame.purchaseDate.getFullYear();
            }

            // Price
            var minP = Math.min(userGame.priceAsked, userGame.pricePaid, userGame.priceResale, userGame.priceSold);
            if (minP < minPrice) {
                minPrice = minP;
            }

            var maxP = Math.max(userGame.priceAsked, userGame.pricePaid, userGame.priceResale, userGame.priceSold);
            if (maxP > maxPrice) {
                maxPrice = maxP;
            }

            // UserGame Tags
            var tagTypes = ['platform', 'purchaseContact', 'saleContact'];
            for (let type of tagTypes) {

                if (userGame[type]) {
                    if (!this.stats.count[type][userGame[type].id]) {

                        this.stats.tags[type].push(userGame[type]);
                        this.stats.count[type][userGame[type].id] = 0;
                    }

                    this.stats.count[type][userGame[type].id]++;
                }
            }

            // UserGame Places
            var tagTypes = ['purchasePlace', 'salePlace', 'purchaseDate', 'saleDate', 'pricePaid', 'priceAsked', 'priceResale', 'priceSold', 'rating'];
            for (let type of tagTypes) {

                if (userGame[type]) {

                    var tag = userGame[type];

                    if (type.substring(0, 5) == 'price') {
                        tag = Math.floor(parseInt(tag, 10)/10);
                        // tag = parseInt(userGame[type], 10);
                    }
                    else if (type.substr(type.length - 4) == 'Date') {
                        tag = formatDate(tag, 'y/m');
                    }

                    if (!this.stats.count[type][tag]) {

                        this.stats.tags[type].push(tag);
                        this.stats.count[type][tag] = 0;
                    }

                    this.stats.count[type][tag]++;
                }
            }

            // Rating
            if (!this.stats.count.ratingIGDB[userGame.game.rating]) {

                this.stats.tags.ratingIGDB.push(userGame.game.rating);
                this.stats.count.ratingIGDB[userGame.game.rating] = 0;
            }

            this.stats.count.ratingIGDB[userGame.game.rating]++;

            // Game Tags
            for (let tagType of ['series', 'developers', 'publishers', 'modes', 'themes', 'genres']) {
                if (userGame.game[tagType] && userGame.game[tagType].length > 0) {

                    for (let tag of userGame.game[tagType]) {

                        if (!this.stats.count[tagType][tag.id]) {

                            this.stats.tags[tagType].push(tag);
                            this.stats.count[tagType][tag.id] = 0;
                        }

                        this.stats.count[tagType][tag.id]++;
                    }
                }
            }

            if (!this.stats.count.version[userGame.version]) {
                this.stats.count.version[userGame.version] = 0;
            }
            this.stats.count.version[userGame.version]++;

            if (!this.stats.count.progress[userGame.progress]) {
                this.stats.count.progress[userGame.progress] = 0;
            }
            this.stats.count.progress[userGame.progress]++;

            if (!this.stats.count.cond[userGame.cond]) {
                this.stats.count.cond[userGame.cond] = 0;
            }
            this.stats.count.cond[userGame.cond]++;

            if (!this.stats.count.completeness[userGame.completeness]) {
                this.stats.count.completeness[userGame.completeness] = 0;
            }
            this.stats.count.completeness[userGame.completeness]++;
        }

        this.ratingRange = [minRating, maxRating];
        this.minRating = minRating;
        this.maxRating = maxRating;

        this.releaseYearRange = [minReleaseYear, maxReleaseYear];
        this.minReleaseYear = minReleaseYear;
        this.maxReleaseYear = maxReleaseYear;

        this.purchaseYearRange = [minPurchaseYear, maxPurchaseYear];
        this.minPurchaseYear = minPurchaseYear;
        this.maxPurchaseYear = maxPurchaseYear;

        this.priceAskedRange = [minPrice, maxPrice];
        this.pricePaidRange = [minPrice, maxPrice];
        this.priceResaleRange = [minPrice, maxPrice];
        this.priceSoldRange = [minPrice, maxPrice];
        this.minPrice = minPrice;
        this.maxPrice = maxPrice;

        var priceTypes = ['pricePaid', 'priceAsked', 'priceResale', 'priceSold'];
        for (let type of priceTypes) {

            for (let i = Math.floor(minPrice/10); i <= Math.floor(maxPrice/10); i++) {
            // for (let i = 0; i <= maxPrice; i++) {

                if (!this.stats.count[type][i]) {

                    this.stats.tags[type].push(i);
                    this.stats.count[type][i] = 0;
                }
            }

            this.stats.tags[type].sort(sortNumber);
        }

        var ratingTypes = ['rating', 'ratingIGDB'];
        for (let type of ratingTypes) {

            for (let i = 0; i <= 20; i++) {

                if (!this.stats.count[type][i]) {

                    this.stats.tags[type].push(i);
                    this.stats.count[type][i] = 0;
                }
            }

            this.stats.tags[type].sort(sortNumber);
        }

        // for (let y = minPurchaseYear; y <= maxPurchaseYear; y++) {
        //
        //     for (let m = 1; m <= 12; m++) {
        //
        //         let yearMonth = y + '/' + ('00' + m).slice(-2);
        //
        //         if (!this.stats.count.purchaseDate[yearMonth]) {
        //
        //             this.stats.tags.purchaseDate.push(yearMonth);
        //             this.stats.count.purchaseDate[yearMonth] = 0;
        //         }
        //     }
        // }

        // orderByCount
        this.stats.tags.platform.sort(orderByCount(this.stats.count.platform));
        this.stats.tags.series.sort(orderByCount(this.stats.count.series));
        this.stats.tags.developers.sort(orderByCount(this.stats.count.developers));
        this.stats.tags.publishers.sort(orderByCount(this.stats.count.publishers));
        this.stats.tags.purchaseContact.sort(orderByCount(this.stats.count.purchaseContact));
        this.stats.tags.saleContact.sort(orderByCount(this.stats.count.saleContact));
        this.stats.tags.purchaseDate.sort();
        this.stats.tags.saleDate.sort();
        this.stats.tags.purchasePlace.sort();
        this.stats.tags.salePlace.sort();

        return this;
    }
}

function sortNumber(a, b) {
    return a - b;
}
