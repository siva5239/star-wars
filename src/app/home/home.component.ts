import { Component, OnInit, inject } from '@angular/core';
import { FilterComponent } from '../filter/filter.component';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { SharedService } from '../shared.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FilterComponent,CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
http=inject(HttpClient);
sharedserve=inject(SharedService);
character: any;
  filmNames: any[]=[];
  vehicleNames: any[]=[];
  starshipNames: any[]=[];
  homeworldName: any;
  species: any[]=[];
  charcters: any;
  newCharacters: any[]=[];
  speciesNames: any[]=[];
  characters: any[]=[];
  charcterDetails:any[]=[];

ngOnInit(): void {
  this.getMovies();

}
getMovies() {
  const url = 'https://swapi.dev/api/people/1/'; // Example API URL
  this.http.get(url).subscribe({
    next: (data) => {
      console.log('API call successful', data);
      this.character=data;
      this.fetchAdditionalDetails();
    },
    error: (error: HttpErrorResponse) => {
      console.error('API call failed', error);
    }
  });
}

fetchAdditionalDetails() {
  if (!this.character) return;

  const filmRequests = this.character?.films.map((url: string) => this.http.get<any>(url));
  const vehicleRequests = this.character?.vehicles.map((url: string) => this.http.get<any>(url));
  const starshipRequests = this.character?.starships.map((url: string) => this.http.get<any>(url));
  const speciesRequests = this.character?.species.map((url: string) => this.http.get<any>(url));
  const homeworldRequest = this.http.get<any>(this.character.homeworld);

  forkJoin([...filmRequests, ...vehicleRequests, ...starshipRequests, homeworldRequest, ...speciesRequests])
    .subscribe({
      next: (responses) => {
        console.log(responses, 'responses');
        const filmLength = this.character!.films.length;
        const vehicleLength = this.character!.vehicles.length;
        const starshipLength = this.character!.starships.length;
        const speciesLength = this.character!.species.length;

        this.filmNames = responses.slice(0, filmLength).map(res => res.title);
        this.vehicleNames = responses.slice(filmLength, filmLength + vehicleLength).map(res => res.name);
        this.starshipNames = responses.slice(filmLength + vehicleLength, filmLength + vehicleLength + starshipLength).map(res => res.name);
        this.homeworldName = responses[filmLength + vehicleLength + starshipLength].name;
        this.speciesNames = responses.slice(filmLength + vehicleLength + starshipLength + 1, filmLength + vehicleLength + starshipLength + 1 + speciesLength).map(res => res.name);
        
        const characterUrls:any[] = [];
        responses.forEach((res: any, index: number) => {
          if (index < filmLength) {
            characterUrls.push(...res.characters);
          }
        });

        const uniqueCharacterUrls = Array.from(new Set(characterUrls));
        const newCharacterRequests = uniqueCharacterUrls.map((url: string) => this.http.get<any>(url));

        forkJoin(newCharacterRequests).subscribe({
          next: (characters: any[]) => {
            this.characters = characters.map(character => character.name);
            console.log(this.characters, 'characters');
            this.charcterDetails.push({
              "charcters":this.characters,
              "species":this.speciesNames
           });
         
           console.log(this.charcterDetails,'details')
          },
          error: (error) => {
            console.error('Fetching new characters failed', error);
          }
        });
      },
      error: (error) => {
        console.error('API call failed', error);
      }
    });

 
}






}

