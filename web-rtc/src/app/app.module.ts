import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { DashboardComponent } from './dashboard/dashboard.component'
import { CookieInterceptor } from './interceptors/cookie.interceptor'
import { ToastComponent } from './toast/toast.component'
import { VideoComponent } from './video/video.component'

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        DashboardComponent,
        ToastComponent,
        HttpClientModule,
        VideoComponent,
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: CookieInterceptor,
            multi: true,
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
