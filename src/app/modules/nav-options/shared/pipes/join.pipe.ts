import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'join'
})
export class JoinPipe implements PipeTransform {
  transform(value: readonly string[] | string | null | undefined): string {
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    return typeof value === 'string' ? value : '';
  }
}
