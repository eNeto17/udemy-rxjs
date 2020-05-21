import {Component, OnInit} from '@angular/core';
import {noop, Observable, of, throwError, timer} from 'rxjs';
import {catchError, delayWhen, finalize, map, retryWhen, shareReplay, tap} from 'rxjs/operators';
import {createHttpObservable, createObservable} from '../common/util';
import {Course} from '../model/course';


@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  beginnersCourses$: Observable<Course[]>;
  advancedCourses$: Observable<Course[]>;

  constructor() { }

    ngOnInit() {
      const http$: Observable<any> = createHttpObservable('/api/courses');

      const courses$: Observable<Course[]> = http$.pipe(
        tap(() => console.log('Http request call executed')),
        map(res => Object.values(res['payload'])),
        shareReplay<Course[]>(),
        retryWhen(errors => errors.pipe(
          delayWhen(() => timer(2000))
        ))
      );

      this.beginnersCourses$ = courses$.pipe(
        map(courses => courses.filter(course => course.category === 'BEGINNER'))
      );
      this.advancedCourses$ = courses$.pipe(
        map(courses => courses.filter(course => course.category === 'ADVANCED'))
      );

    }

}
