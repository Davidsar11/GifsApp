import {  Component, inject, signal } from '@angular/core';
import { ListComponent } from "../../components/list/list.component";
import { GifService } from '../../services/gif.service';
import { GiphyResponse } from '../../interfaces/giphy.interface';
import { Gif } from '../../interfaces/gif.interface';

@Component({
  selector: 'gif-search-page',
  imports: [ListComponent],
  templateUrl: './search-page.component.html',

})
export default class SearchPageComponent {

  gifService = inject(GifService);
  gifs = signal<Gif[]>([]);
  onSearch (query : string){
    this.gifService.searchGifs(query).subscribe(resp => {

      this.gifs.set(resp);

    });
  }

}
