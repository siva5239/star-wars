import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProfilePageComponent } from './profile-page/profile-page.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    {path:'profile-page',component:ProfilePageComponent}
   
];
