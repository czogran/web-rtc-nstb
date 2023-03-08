import {
    ChangeDetectionStrategy,
    Component,
    TemplateRef,
    ViewChild,
} from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { ToastComponent } from './toast/toast.component'

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
    @ViewChild('test')
    test: TemplateRef<any>



    constructor() {}
}
