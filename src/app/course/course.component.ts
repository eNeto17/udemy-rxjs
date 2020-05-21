import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Course} from '../model/course';
import {debounceTime, distinctUntilChanged, map, startWith, switchMap} from 'rxjs/operators';
import {fromEvent, Observable} from 'rxjs';
import {Lesson} from '../model/lesson';
import {createHttpObservable} from '../common/util';
import {debug, RxJsLoggingLevel} from '../common/debug';


@Component({
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit, AfterViewInit {


  courseId: string;
  course$: Observable<Course>;
  lessons$: Observable<Lesson[]>;

  @ViewChild('searchInput', { static: true }) input: ElementRef;

  constructor(private route: ActivatedRoute) {


  }

  ngOnInit() {
    this.courseId = this.route.snapshot.params['id'];
    this.course$ = <Observable<Course>> createHttpObservable(`/api/courses/${this.courseId}`)
      .pipe(
        debug(RxJsLoggingLevel.DEBUG, 'Course Value')
      );
  }

  ngAfterViewInit() {
    this.lessons$ = fromEvent<any>(this.input.nativeElement, 'keyup')
      .pipe(
        map(event => event.target.value),
        startWith(''),
        debug(RxJsLoggingLevel.DEBUG, 'Search Value'),
        debounceTime(400), // Waits some time and trigger last event emitted from source
        distinctUntilChanged(), // Only trigger for values distinct to previous
        switchMap(search => this.loadLessons(search)) // Ignores ongoing when new values emitted from source
      );
  }

  loadLessons(search: string = ''): Observable<Lesson[]> {
    return createHttpObservable(`/api/lessons?courseId=${this.courseId}&pageSize=100&filter=${search}`)
      .pipe(
        map(res => res['payload'])
      );
  }

}
