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
            if (orderField.indexOf('.') > -1) {
                var orderFieldSplit = orderField.split('.');
                var aVal = a[orderFieldSplit[0]][orderFieldSplit[1]];
                var bVal = b[orderFieldSplit[0]][orderFieldSplit[1]];
            }
            else {
                var aVal = a[orderField];
                var bVal = b[orderField];
            }

            let tmpReturn = 0;

            if ( aVal < bVal ){
                tmpReturn = -1;
            }else if( aVal > bVal ){
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