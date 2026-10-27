import { Component } from '@angular/core';
import { GlobalHeaderComponent } from '../global-header/global-header.component';
import { CounterComponent } from '../app-counter/app-counter';

@Component({
  imports: [GlobalHeaderComponent, CounterComponent],
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent {

}
