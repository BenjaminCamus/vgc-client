import {Company} from "./company";
import {Mode} from "./mode";
import {Theme} from "./theme";
import {Genre} from "./genre";
import {Series} from "./series";
import {Image} from "./image";
import {Platform} from "./platform";

export class Game {
    id: string;
    name: string;
    slug: string;
    rating: number;
    igdbId: number;
    igdbUrl: string;
    cover: Image;
    series: Series;
    developers: Company[];
    publishers: Company[];
    modes: Mode[];
    themes: Theme[];
    genres: Genre[];
    screenshots: Array<Image>;

    // IGDB
    platforms: Array<Platform>;

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