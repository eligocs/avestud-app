import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'lectureunit'
})
export class LectureunitPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
