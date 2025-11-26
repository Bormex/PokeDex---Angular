import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PokeApiService {
  constructor(private http: HttpClient) { }
  
  pokeApi = "https://pokeapi.co/api/v2/";

  fetchPokemonData(pokemonID: string): Observable<any> {
    return this.http.get(this.pokeApi + pokemonID);
  }















  
}
