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

        array.sort((a: any, b: any) => {

            var fieldSplit = orderField.split('.');
            var object = fieldSplit[0];
            var field = fieldSplit[1];

            if (object === 'userGame') {

                if (a[field] && a[field].firstName
                    && a[field] && a[field].firstName) {

                    var aVal = a[field].firstName;
                    var bVal = b[field].firstName;
                }
                else if (a[field] && a[field].name
                    && a[field] && a[field].name) {

                    var aVal = a[field].name;
                    var bVal = b[field].name;
                }
                else {

                    var aVal = a[field];
                    var bVal = b[field];
                }
            }
            else {
                var aVal = a['game'][field];
                var bVal = a['game'][field];
            }

            let tmpReturn = 0;

            if (aVal < bVal) {
                tmpReturn = -1;
            } else if (aVal > bVal) {
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