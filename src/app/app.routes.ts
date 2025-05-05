import { Routes } from '@angular/router';
import { ZoomMeetingComponent } from './zoom-meeting/zoom-meeting.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { CronoControlComponent } from './pages/crono-control/crono-control.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { AuthGuard } from './guards/auth-guard.guard';
import { DocsComponent } from './pages/docs/docs.component';


export const routes: Routes = [
{path: '', component: LoginComponent},
{path: 'login', component: LoginComponent},
{path: 'docs', component: DocsComponent},
{path: 'dashboard/:congregation', component: DashboardComponent,   canActivate: [AuthGuard]},
{path: 'overlay/:congregation', component: ZoomMeetingComponent},
{path: 'crono-control/:congregation', component: CronoControlComponent,   canActivate: [AuthGuard]},
{path: 'settings/:congregation', component: SettingsComponent,   canActivate: [AuthGuard]},
];
