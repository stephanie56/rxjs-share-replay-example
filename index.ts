import { of, interval, Subscription, Subject } from 'rxjs'; 
import { map, scan, shareReplay, publishReplay, refCount, tap, takeUntil } from 'rxjs/operators';

let shareReplaySubscription: Subscription;
let publishReplaySubscription: Subscription;

const timer$ = interval(1000).pipe(
  scan(counter => counter + 1, 0),
);

const timerWithShareReplay$ = timer$.pipe(
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

function subscribeWithPublishReplay(): void {
  if (publishReplaySubscription) {
    unsubscribePublishReplay();
  }

  publishReplaySubscription = timerWithPublishReplay$
    .subscribe(counter => console.log('Publish replay subscription', counter));
}

function unsubscribeShareReplay(): void {
  shareReplaySubscription.unsubscribe();
}

function unsubscribePublishReplay(): void {
  publishReplaySubscription.unsubscribe();
}

document.querySelector('#button1').addEventListener('click', () => subscribeWithShareReplay());
document.querySelector('#button2').addEventListener('click', () => unsubscribeShareReplay());
document.querySelector('#button3').addEventListener('click', () => subscribeWithPublishReplay());
document.querySelector('#button4').addEventListener('click', () => unsubscribePublishReplay());
