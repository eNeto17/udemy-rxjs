import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject, timer} from 'rxjs';
import {Course} from '../model/course';
import {createHttpObservable} from './util';
import {delayWhen, filter, map, retryWhen, shareReplay, tap} from 'rxjs/operators';
import {fromPromise} from 'rxjs/internal-compatibility';

@Injectable({
  providedIn: 'root' // There is only one store service on the entire application
})
export class Store {
  private subject = new BehaviorSubject<Course[]>([]);

  courses$: Observable<Course[]> = this.subject.asObservable();

  init() {
    const http$ = createHttpObservable('/api/courses');

    http$
      .pipe(
        tap(() => console.log('HTTP request executed')),
        map(res => Object.values(res['payload']))
      )
      .subscribe(courses => this.subject.next(courses) );
  }

  selectBeginnerCourses(): Observable<Course[]> {
    return this.filteredByCategory('BEGINNER');
  }
  selectAdvancedCourses(): Observable<Course[]> {
    return this.filteredByCategory('ADVANCED');
  }

  filteredByCategory(category: string): Observable<Course[]> {
    return this.courses$
      .pipe(
        map(courses => courses
          .filter(course => course.category === category))
      );
  }

  saveCourse(courseId: number, changes: any) {
    const courses = this.subject.getValue();
    const courseIndex = courses.findIndex(course => course.id === courseId);

    // Cloning existing courses array in order to avoid data mutation
    const newCourses = courses.slice(0);

    // This logic is to update values on frontend local storage
    newCourses[courseIndex] = {
      ...courses[courseIndex], // Access to course array specific element
      ...changes               // Update this specific element with new values
    };
    // WARNING: We are broadcasting value before we ensure data will be saved on backend
    this.subject.next(newCourses);

    // Saving data on backend service
    return fromPromise(fetch(`/api/courses/${courseId}`, {
      method: 'PUT',
      body: JSON.stringify(changes),
      headers: {
        'content-type': 'application/json'
      }
    }));
  }

  selectCourseById(courseId: number) {
    return this.courses$.pipe(
      map(courses => courses.find(course => course.id == courseId)),
      filter(course => !!course) // Avoid return undefined if store is empty
    );
  }
}
