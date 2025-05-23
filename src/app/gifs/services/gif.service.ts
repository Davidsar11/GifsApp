import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment';
import type{ GiphyResponse } from '../interfaces/giphy.interface';
import { Gif } from '../interfaces/gif.interface';
import { GifMapper } from '../mapper/gif.mapper';
import { map, tap } from 'rxjs';

const GIF_KEY = 'gifs';

const loadFromLocalStorage = () => {

  const gifsFromLocalStorage = localStorage.getItem(GIF_KEY) ?? '{}';
  return JSON.parse( gifsFromLocalStorage);
}


@Injectable({
  providedIn: 'root'
})
export class GifService {

  private http = inject(HttpClient);

  trendingGifs = signal<Gif[]>([]);
  trendingGifsLoading = signal(true);

  searchHistory = signal<Record<string, Gif[]>> (loadFromLocalStorage());

  saveToLocalStorage = effect( ()  => {
    localStorage.setItem(GIF_KEY, JSON.stringify(this.searchHistory()))
  });


  searchHistoryKeys = computed( () => Object.keys(this.searchHistory()));

  constructor(){
    this.loadTrendingGifs();
  }

  loadTrendingGifs(){

    this.http.get<GiphyResponse>(`${environment.giphyUrl}/gifs/trending`, {
      params: {
        api_key: environment.giphyApiKey,
        limit: 20,
      },
    }).subscribe( (resp) => {
        const gifs = GifMapper.mapGiphyItemsToGifArray(resp.data);
        this.trendingGifs.set(gifs);
        this.trendingGifsLoading.set(false);
    });
  }

  searchGifs(query :string){

    return this.http.get<GiphyResponse>(`${environment.giphyUrl}/gifs/search`, {
      params: {
        api_key: environment.giphyApiKey,
        limit: 20,
        q: query,
      }
    }).pipe(
      map( ({data}) =>  GifMapper.mapGiphyItemsToGifArray(data)),
      tap(items => {
        this.searchHistory.update( history => ({
          ...history,
          [query.toLowerCase()]: items
        }));
      }),


    );


  }

  getHistoryGifs (query: string){
    return this.searchHistory()[query] ?? [];
  }


}
