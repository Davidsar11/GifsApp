import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SideMenuComponent } from "../../components/side-menu/side-menu.component";

@Component({
  selector: 'app-dashborad-page',
  imports: [RouterOutlet, SideMenuComponent],
  templateUrl: './dashborad-page.component.html',
})
export default class DashboradPageComponent { }
