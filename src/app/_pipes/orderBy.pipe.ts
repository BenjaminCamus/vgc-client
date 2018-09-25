import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'orderBy',
    pure: false
})

export class OrderByPipe implements PipeTransform {

    transform(array: Array<Object>, orderField: string, orderOption: boolean): Array<Object> {


        if (array == null) {

            return null;
        }

        var fieldSplit = orderField.split('.');
        var object = fieldSplit[0];
        var field = fieldSplit[1];

        array.sort((a: any, b: any) => {

            if (object === 'userGame') {

                var aVal, bVal;

                if (a[field] && a[field].firstName
                    && b[field] && b[field].firstName) {

                    aVal = a[field].firstName;
                    bVal = b[field].firstName;
                }
                else if (a[field] && a[field].name
                    && b[field] && b[field].name) {

                    aVal = a[field].name;
                    bVal = b[field].name;
                }
                else {

                    aVal = a[field];
                    bVal = b[field];

                    if (field.substring(0, 5) == 'price') {

                        aVal = parseFloat(aVal);
                        bVal = parseFloat(bVal);
                    }
                }
            }
            else {
                aVal = a['game'][field];
                bVal = b['game'][field];
            }

            let tmpReturn = 0;

            if (aVal == bVal) {

                if (a.game.name < b.game.name) {
                    return -1;
                } else if (a.game.name > b.game.name) {
                    return 1;
                }
            }
            else if (aVal < bVal || !aVal) {
                tmpReturn = -1;
            } else if (aVal > bVal || !bVal) {
                tmpReturn = 1;
            }

            if (orderOption) {
                return tmpReturn;
            }
            else {
                return -tmpReturn;
            }
        });
        return array;
    }
}