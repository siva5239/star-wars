import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { forkJoin } from 'rxjs';



@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [DatePipe,CommonModule ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css'
})
export class ProfilePageComponent implements OnInit {


  http = inject(HttpClient); // Inject HttpClient
  character:any 
  filmNames: any[]=[];
  vehicleNames: any[]=[];
  starshipNames: any[]=[];
  homeworldName: string='';
  ngOnInit(): void {
    this.fetchCharacterData();
  }
  fetchCharacterData() {
    const url = 'https://swapi.dev/api/people/1/';
    this.http.get(url).subscribe({
      next: (data) => {
        this.character = data;
        this.fetchAdditionalDetails();
      },
      error: (error) => {
        console.error('API call failed', error);
      }
    });
  }

  fetchAdditionalDetails() {
    if (!this.character) return;

    const filmRequests = this.character?.films.map((url: any) => this.http.get(url));
    const vehicleRequests = this.character?.vehicles.map((url:any) => this.http.get(url));
    const starshipRequests = this.character?.starships.map((url:any) => this.http.get<any>(url));
    const homeworldRequest = this.http.get<any>(this.character.homeworld);
console.log(filmRequests,'filmrequest');

    forkJoin([...filmRequests, ...vehicleRequests, ...starshipRequests, homeworldRequest])
      .subscribe({
        next: (responses) => {
          this.filmNames = responses.slice(0, this.character!.films.length).map(res => res.title);
          this.vehicleNames = responses.slice(this.character!.films.length, this.character!.films.length + this.character!.vehicles.length).map(res => res.name);
          this.starshipNames = responses.slice(this.character!.films.length + this.character!.vehicles.length, responses.length - 1).map(res => res.name);
          this.homeworldName = responses[responses.length - 1].name;
          console.log(this.filmNames);
          
        },
        
        error: (error) => {
          console.error('API call failed', error);
        }
      });
  }
}
