import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {UserSearchComponent} from './user-search/user-search.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, UserSearchComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'angular-resource';
}
