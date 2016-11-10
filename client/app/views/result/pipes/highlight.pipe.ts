import { ModelService } from '../../../EA/model.service';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlight'
})
export class HighlightPipe implements PipeTransform {

  constructor(public modelService: ModelService) { }

  transform(text: string): string {
    let search = this.modelService.searchString;
    let pattern = search.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    pattern = pattern.split(' ').filter((t) => {
      return t.length > 0;
    }).join('|');
    let regex = new RegExp(pattern, 'gi');
    return search ? text.replace(regex, (match) => `<span class="highlight">${match}</span>`) : text;
  }
}
