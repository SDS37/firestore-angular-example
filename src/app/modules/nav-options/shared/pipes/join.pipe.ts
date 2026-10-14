import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'join'
})
export class JoinPipe implements PipeTransform {
  transform(value: any): string {
    return Array.isArray(value) ? value.join(', ') : value;
  }
}
