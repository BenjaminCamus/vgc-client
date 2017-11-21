import {Company} from "./company";
import {Mode} from "./mode";
import {Theme} from "./theme";
import {Genre} from "./genre";
import {Series} from "./series";

export class Game {
    id: string;
    name: string;
    slug: string;
    rating: number;
    igdbId: number;
    igdbUrl: string;
    cover: Object;
    series: Series;
    developers: Company[];
    publishers: Company[];
    modes: Mode[];
    themes: Theme[];
    genres: Genre[];
    screenshots: Array<Object>;

    // IGDB
    platform: Array<Object>;
    release_dates;

    constructor(name: string = '') {
        this.name = name;
    }

    addCompany(type: string, company: Company) {
        if (!this[type+'s']) {
            this[type+'s'] = [];
        }

        this[type+'s'].push(company);

        this[type+'s'] = this[type+'s'].filter(function(elem, index, self) {
            return index == self.indexOf(elem);
        });

        return this;
    }

    removeCompany(type: string, company: Company) {
        if (!this[type+'s']) {
            return this;
        }
        var index = this[type+'s'].indexOf(company, 0);
        if (index > -1) {
            this[type+'s'].splice(index, 1);
        }

        return this;
    }
}