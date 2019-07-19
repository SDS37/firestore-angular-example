import { Injectable } from '@angular/core';

// third-party firebase
import { AngularFirestore, CollectionReference, DocumentReference, DocumentChangeAction } from '@angular/fire/firestore';
import { User } from 'firebase';

// store
import { Store } from '../../../../../store/store';

// rxjs
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { tap, map, switchMap, withLatestFrom } from 'rxjs/operators';

// services
import { AuthService } from '../../../../auth/shared/services/auth/auth.service';

// interfaces
import { ScheduleList } from 'src/app/models/schedule-list.interface';
import { ScheduleItem } from 'src/app/models/schedule-item.interface';
import { DateRange } from 'src/app/models/date-range.interface';

@Injectable()
export class ScheduleService {

  // BehaviorSubjects
  private date$: BehaviorSubject<Date> = new BehaviorSubject<Date>(new Date());
  // Subjects
  private section$: any = new Subject();
  private itemList$ = new Subject();

  items$: Observable<ScheduleList> = this.itemList$.pipe(
    withLatestFrom(this.section$),
    map( ([ items, section ]: any[] ): any => {
      const id = section.data.$key;
      const defaults: ScheduleItem = {
        workouts: null,
        meals: null,
        section: section.section,
        timestamp: new Date(section.day).getTime()
      };
      // object spread
      const payload: any = {
        ...(id ? section.data : defaults),
        ...items
      };
      if (id) {
        return this.updateSection(id, payload);
      } else {
        return this.createSection(payload);
      }
    })
  );

  selected$: Observable<any> = this.section$.pipe(
    tap( (next: any): void => this.store.set('selected', next) )
  );

  list$: Observable<any> = this.section$.pipe(
    map( ( value: any ): ScheduleItem => {
      return this.store.value[value.type];
    }),
    tap( ( next: ScheduleItem ): void => this.store.set('list', next) )
  );

  schedule$: Observable<ScheduleItem[]> = this.date$.pipe(
    tap( (next: Date): void => this.store.set('date', next) ),
    // map. Applies a given project function to each value emitted by the source Observable,
    // and emits the resulting values as an Observable.
    map( (day: Date): DateRange => {
      const startAt: number = (new Date(day.getFullYear(), day.getMonth(), day.getDate())).getTime();
      const endAt: number = (new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1)).getTime() - 1;
      return { startAt, endAt };
    }),
    // switchMap. Projects each source value to an Observable which is merged in the output
    // Observable, emitting values only from the most recently projected Observable.
    switchMap( ({startAt, endAt}: DateRange ): Observable<ScheduleItem[]> => {
      return this.af
        .collection<User>('users').doc(this.uid)
        .collection<ScheduleItem>('schedule',  ( reference: CollectionReference ): any => {
          // query
          return reference.orderBy('timestamp').startAt(startAt).endAt(endAt);
        })
        .snapshotChanges().pipe(
          map( ( documentChangeActions: DocumentChangeAction<ScheduleItem>[] ): ScheduleItem[] => {
            return documentChangeActions.map( ( documentChangeAction: DocumentChangeAction<ScheduleItem> ): ScheduleItem => {
                const $key = documentChangeAction.payload.doc.id as string;
                const data = documentChangeAction.payload.doc.data();
                return { $key, ...data };
            });
          })
        );
    }),
    map( (data: ScheduleItem[]): ScheduleList => {
      const mapped: ScheduleList = {};
      for (const prop of data) {
        if (!mapped[prop.section]) {
          mapped[prop.section] = prop;
        }
      }
      return mapped;
    }),
    tap ( (next: ScheduleItem[]): void => {
      this.store.set('schedule', next);
    } )
  );

  constructor(
    private af: AngularFirestore,
    private store: Store,
    private authService: AuthService
  ) {}

  get uid(): string {
    return this.authService.user.uid;
  }

  updateItems(items: string[]): void {
    this.itemList$.next(items);
  }

  updateDate(date: Date): void {
    this.date$.next(date);
  }

  selectSection(event: any): void {
    this.section$.next(event);
  }

  private createSection(payload: ScheduleItem): Promise<DocumentReference> {
    return this.af.collection<User>('users').doc(this.uid).collection<ScheduleItem>('schedule').add(payload);
  }

  private updateSection(key: string, payload: ScheduleItem): Promise<void> {
    return this.af.collection<User>('users').doc(this.uid).collection<ScheduleItem>('schedule').doc(key).update(payload);
  }

}
