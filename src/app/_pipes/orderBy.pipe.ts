import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'orderBy',
    pure: false
})

export class OrderByPipe implements PipeTransform {

    transform(array: Array<Object>, args: string): Array<Object> {


        if (array == null) {
            return null;
        }

        array.sort((a: any, b: any) => {
            if (args.indexOf('.') > -1) {
                var argsSplit = args.split('.');
                var aVal = a[argsSplit[0]][argsSplit[1]];
                var bVal = b[argsSplit[0]][argsSplit[1]];
            }
            else {
                var aVal = a[args];
                var bVal = b[args];
            }


            if ( aVal < bVal ){
                return -1;
            }else if( aVal > bVal ){
                return 1;
            }else{
                return 0;
            }
        });
        return array;
    }
}