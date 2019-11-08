import { of, interval, Subscription, Subject, throwError } from 'rxjs'; 
import { map, scan, shareReplay, publishReplay, refCount, tap, takeUntil, catchError } from 'rxjs/operators';

let shareReplaySubscription: Subscription;
let shareReplayRefCountSubscription: Subscription;
let publishReplaySubscription: Subscription;

const timer$ = interval(1000).pipe(
  scan(counter => {return counter + 1;
    }, 0),
  map(data => {
    if (data === 3) {
      throw new Error("403");
    } else {
      return data;
    }
  })
);

const timerWithShareReplay$ = timer$.pipe(
  tap(counter => console.log('Share replay current value', counter)),
  shareReplay(1),
);

const timerWithShareReplayRefCount$ = timer$.pipe(
  tap(counter => console.log('Share replay current value', counter)),
  shareReplay({ refCount: true, bufferSize: 1 }),
);

const timerWithPublishReplay$ = timer$.pipe(
  tap(counter => console.log('Publish replay current value', counter)),
  publishReplay(1),
  refCount(),
);

function subscribeWithShareReplay(): void {
  if (shareReplaySubscription) {
    unsubscribeShareReplay();
  }

  shareReplaySubscription = timerWithShareReplay$
    .subscribe(counter => console.log('Share replay subscription', counter));
}

function subscribeWithShareReplayRefCount(): void {
  if (shareReplayRefCountSubscription) {
    unsubscribeShareReplayRefCount();
  }

  shareReplayRefCountSubscription = timerWithShareReplayRefCount$
      .pipe(catchError(error => {
      console.log('I CAUGHT YOUUUUUUUUU ERRORRRRR', error);
      return of(error);
    }))
    .subscribe(counter => console.log('Share replay subscription with Ref Count', counter));
}

function subscribeWithPublishReplay(): void {
  if (publishReplaySubscription) {
    unsubscribePublishReplay();
  }

  publishReplaySubscription = timerWithPublishReplay$
    .pipe(catchError(error => {
      console.log('I CAUGHT YOUUUUUUUUU ERRORRRRR', error);
      return of(error);
    }))
    .subscribe(counter => console.log('Publish replay subscription', counter));
}

function unsubscribeShareReplay(): void {
  shareReplaySubscription.unsubscribe();
}

function unsubscribeShareReplayRefCount(): void {
  shareReplayRefCountSubscription.unsubscribe();
}

function unsubscribePublishReplay(): void {
  publishReplaySubscription.unsubscribe();
}

document.querySelector('#button1').addEventListener('click', () => subscribeWithShareReplay());
document.querySelector('#button2').addEventListener('click', () => unsubscribeShareReplay());
document.querySelector('#button3').addEventListener('click', () => subscribeWithPublishReplay());
document.querySelector('#button4').addEventListener('click', () => unsubscribePublishReplay());

document.querySelector('#button5').addEventListener('click', () => subscribeWithShareReplayRefCount());
document.querySelector('#button6').addEventListener('click', () => unsubscribeShareReplayRefCount());
