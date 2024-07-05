import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css'
})
export class FilterComponent implements OnInit {
  @Input() receivedData: any ;
router=inject(Router);
http=inject(HttpClient);
shared=inject(SharedService)
  character: any;
  filmNames: any[]=[];
  vehicleNames: any[]=[];
  starshipNames: any[]=[];
  homeworldName: any;
  species: any[]=[];
  characters: any[]=[];
  newCharactes: any[]=[];
  speciesNames: any[]=[];
  charcters: any;
  newCharacters: any[]=[];

  ngOnInit(): void {
    this.fetchCharacterData();
   
  }
  search() {
    // Implement search functionality here
    this.router.navigate(['profile-page']);
  }

 


  fetchCharacterData() {
    const url = 'https://swapi.dev/api/people/1/';
    this.http.get(url).subscribe({
      next: (data) => {
        this.character = data;
        console.log(this.character,'charcters');
        this.character = { ...this.character, characters: true };
         this.fetchAdditionalDetails();
      },
      error: (error) => {
        console.error('API call failed', error);
      }
    });
  }

  // fetchAdditionalDetails() {
  //   if (!this.character) return;

  //   const filmRequests = this.character?.films.map((url: any) => this.http.get(url));
  //   const vehicleRequests = this.character?.vehicles.map((url:any) => this.http.get(url));
  //   const starshipRequests = this.character?.starships.map((url:any) => this.http.get<any>(url));
  //   const species=this.character?.species.map((url:any)=>this.http.get(url));
  //   const homeworldRequest = this.http.get<any>(this.character.homeworld);


  //   forkJoin([...filmRequests, ...vehicleRequests, ...starshipRequests, homeworldRequest,...species])
  //     .subscribe({
  //       next: (responses) => {
  //         console.log(responses,'responces')
  //         this.filmNames = responses.slice(0, this.character!.films.length).map(res => res.title);
  //         this.vehicleNames = responses.slice(this.character!.films.length, this.character!.films.length + this.character!.vehicles.length).map(res => res.name);
  //         this.starshipNames = responses.slice(this.character!.films.length + this.character!.vehicles.length, responses.length - 1).map(res => res.name);
  //         this.homeworldName = responses[responses.length - 1].name;
  //         this.species = responses.slice(this.character!.films.length+ this.character!.films.length ,responses.length - 1).map(res => res.species);
  //         this.characters=responses.map((res)=>{
  //          res["character"].map((items:any)=>{
  //           console.log(items,'charactes')}
  //         )
  //          });
  //          this.newCharactes=responses.map((url)=>url.characters.map((newUrl:any)=>this.http.get(newUrl)))
  //          forkJoin([this.newCharactes]).subscribe({next:(items:any)=>{
  //           const charactersData=items.slice(0,this.newCharactes!.length).map((res:any)=>res);
  //           console.log(charactersData,'new charactes');
  //          }}
  //           )
  //          }})
          
  //         this.shared.sendFilmNames(this.filmNames);
          
  //       },
       
        
  //       error: (error) => {
  //         console.error('API call failed', error);
  //       }
  //     });
  // }

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
  
    this.shared.sendFilmNames(this.filmNames);
    this.shared.sendCharacterName(this.characters);
  } 
  
}
