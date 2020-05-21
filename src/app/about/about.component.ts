import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {concat, fromEvent, interval, noop, observable, Observable, of, timer, merge, Subject, BehaviorSubject} from 'rxjs';
import {delayWhen, filter, map, take, timeout} from 'rxjs/operators';
import {createHttpObservable} from '../common/util';


@Component({
    selector: 'about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

    ngOnInit() {
      const subject = new BehaviorSubject(0); // Creation of subject with default value
      const series$ = subject.asObservable(); // Get an observable from subject
      series$.subscribe(val => console.log('Early subs: ', val)); // Subscribe to the observable

      subject.next(1); // Calling methods from an Observer type
      subject.next(2);
      // subject.complete(); // If we call complete, late subscriptions won't get values

      setTimeout(() => {
        // This late subscriptor just will have last value emitted, on this case: 2
        series$.subscribe(val => console.log('Late subs: ', val));
        subject.next(3); // This will be received by early and late subscriptors
      });

    }


}






