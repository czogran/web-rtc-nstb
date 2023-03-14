import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { DashboardComponent } from './dashboard/dashboard.component'
import { UserDataGuard } from './guards/user-data.guard'
import { LoginPageComponent } from './login-page/login-page.component'
import { RegisterComponent } from './register/register.component'
import { VideoComponent } from './video/video.component'

const routes: Routes = [
    { path: 'login', component: LoginPageComponent },
    { path: 'register',  loadComponent: () => import('./register/register.component').then(mod => mod.RegisterComponent)},
    {
        path: 'dashboard',
        canActivate: [UserDataGuard],
        children: [
            { path: '', component: DashboardComponent },

            { path: 'video', component: VideoComponent },
        ],
    },

    {
        path: '**',
        redirectTo: 'login',
    },
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
