import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filterDate'
})
export class FilterDatePipe implements PipeTransform 
{
    transform(value: any): any 
    {
        value = value.replace(/-/g,'/');
        var localDate = new Date(value + ' UTC');
        return localDate.toLocaleString();
    }
}