import {Observable, Observer} from 'rxjs';


export function createObservable(url: string) {
  return new Observable((observer: Observer<any>) => {
    fetch(url)
      .then(resp => resp.json())
      .then(body => {
        observer.next(body);
        observer.complete();
      })
      .catch(err => observer.error(err));
  });
}

export function createHttpObservable(url:string) {
  return new Observable(observer => {

    const controller = new AbortController();
    const signal = controller.signal;

    fetch(url, {signal})
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          observer.error('Request failed with status code: ' + response.status);
        }

      })
      .then(body => {
        observer.next(body);
        observer.complete();
      }) // This happens when fatal-error occurs, an error which browser can't recover (network, dns)
      .catch(err => {
        observer.error(err);
      });

    // This function is executed when we call unsubscribe on observable
    return () => controller.abort();
  });
}
