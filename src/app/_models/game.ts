import {Tag} from "./tag";
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
    developers: Tag[];
    publishers: Tag[];
    modes: Tag[];
    themes: Tag[];
    genres: Tag[];
    screenshots: Array<Image>;

    // IGDB
    platforms: Array<Platform>;

    constructor(name: string = '') {
        this.name = name;
    }

    addTag(type: string, tag: Tag) {
        if (!this[type+'s']) {
            this[type+'s'] = [];
        }

        this[type+'s'].push(tag);

        this[type+'s'] = this[type+'s'].filter(function(elem, index, self) {
            return index == self.indexOf(elem);
        });

        return this;
    }

    removeTag(type: string, tag: Tag) {
        if (!this[type+'s']) {
            return this;
        }
        var index = this[type+'s'].indexOf(tag, 0);
        if (index > -1) {
            this[type+'s'].splice(index, 1);
        }

        return this;
    }
}