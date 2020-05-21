import { Component, OnInit } from '@angular/core';
import {concat, interval, Observable, of, Subscription} from 'rxjs';
import {concatMap, map, shareReplay, tap} from 'rxjs/operators';
import {createHttpObservable} from '../common/util';
import {Lesson} from '../model/lesson';
import {Course} from '../model/course';


@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor() { }

  ngOnInit() {


  }




  createLessonsObservable():Observable<Lesson[]> {
    const lessons: Lesson[] = [this.createLesson()];
    return of(lessons);
  }

  createLesson(): Lesson {
    const lesson: Lesson = {
      courseId: 100,
      description: 'Description',
      duration: '1',
      id: 10,
      seqNo: 1000
    };
    return lesson;
  }
}

