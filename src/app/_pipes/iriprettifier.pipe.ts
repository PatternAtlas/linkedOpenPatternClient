import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'iriprettifier'
})
export class IriprettifierPipe implements PipeTransform {

  transform(value: any): any {
    const splitAfterHashTag = value.split('#');
    return splitAfterHashTag[1];
  }

}
