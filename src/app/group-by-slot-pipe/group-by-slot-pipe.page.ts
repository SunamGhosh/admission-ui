import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'groupBySlot',
  standalone: true
})
export class GroupBySlotPipe implements PipeTransform {
  transform(classes: any[]): any[][] {
    const grouped: { [key: string]: any[] } = {};
    for (const cls of classes) {
      const key = `${cls.start_time}-${cls.end_time}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(cls);
    }
    return Object.values(grouped);
  }
}
