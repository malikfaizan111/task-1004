import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'urbanpointupdate';
  abc = localStorage.getItem('UrbanpointAdmin') as string;
  UrbanpointAdmin = JSON.parse(this.abc);
}