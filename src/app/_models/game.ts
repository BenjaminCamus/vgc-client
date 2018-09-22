import {Tag} from "./tag";
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
    series: Tag[];
    developers: Tag[];
    publishers: Tag[];
    modes: Tag[];
    themes: Tag[];
    genres: Tag[];
    screenshots: Array<Image>;

    // IGDB
    platforms: Array<Platform>;

    fieldTypes = {
        name: 'string',
        series: 'tags',
        developers: 'tags',
        publishers: 'tags',
        modes: 'tags',
        themes: 'tags',
        genres: 'tags',
        rating: 'rating',
        igdbUrl: 'url'
    };

    constructor(name: string = '') {
        this.name = name;
    }

    addTag(type: string, tag: Tag) {
        if (!this[type]) {
            this[type] = [];
        }

        this[type].push(tag);

        this[type] = this[type].filter(function(elem, index, self) {
            return index == self.indexOf(elem);
        });

        return this;
    }

    removeTag(type: string, tag: Tag) {
        if (!this[type]) {
            return this;
        }
        var index = this[type].indexOf(tag, 0);
        if (index > -1) {
            this[type].splice(index, 1);
        }

        return this;
    }
}