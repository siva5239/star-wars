import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private filmNamesSubject = new Subject<string[]>();

  filmNames$ = this.filmNamesSubject.asObservable();
  private characterNameSubject=new Subject<string[]>();
  charecterName=this.characterNameSubject.asObservable();
  constructor() { }

  sendFilmNames(filmNames: string[]) {
    this.filmNamesSubject.next(filmNames);
  }
  sendCharacterName(character:string[]){
    this.characterNameSubject.next(character);
  }
}
