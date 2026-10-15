import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, DocumentReference } from '@angular/fire/firestore';

// store
import { Store } from 'src/app/store/store';

// services
import { AuthService } from 'src/app/modules/auth/shared/services/auth/auth.service';

// utils
import { toFirestoreData } from 'src/app/utils/firestore-document';
import { observeAuthState } from 'src/app/utils/firebase-auth.utils';
import {
  getCollection,
  observeCollectionData,
  getDocument,
  createDocument,
  updateDocument,
  buildQuery,
  orderByField,
  startAtValue,
  endAtValue
} from 'src/app/utils/firestore.utils';

// rxjs
import { BehaviorSubject, EMPTY, Subject } from 'rxjs';
import { tap, map, switchMap } from 'rxjs/operators';

// interfaces
import { ScheduleList } from 'src/app/models/schedule-list.interface';
import { ScheduleItem } from 'src/app/models/schedule-item.interface';
import { ScheduleSectionEvent } from 'src/app/models/schedule-section-event.interface';
import { DateRange } from 'src/app/models/date-range.interface';

@Injectable({ providedIn: 'root' })
export class ScheduleService {

  private date$ = new BehaviorSubject<Date>(new Date());
  private section$ = new Subject<ScheduleSectionEvent>();
  private selectedSection: ScheduleSectionEvent | null = null;

  selected$ = this.section$.pipe(
    tap((next) => this.store.set('selected', next))
  );

  list$ = this.section$.pipe(
    map((value) => this.store.value[value.type as 'meals' | 'workouts']),
    tap((next) => this.store.set('list', next))
  );

  schedule$ = observeAuthState(this.auth).pipe(
    switchMap(user => {
      if (!user) {
        return EMPTY;
      }
      return this.date$.pipe(
      tap((next: Date) => this.store.set('date', next)),
      map((day: Date): DateRange => {
        const startAtValue = new Date(day.getFullYear(), day.getMonth(), day.getDate()).getTime();
        const endAtValue = new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1).getTime() - 1;
        return { startAt: startAtValue, endAt: endAtValue };
      }),
      switchMap(({ startAt: rangeStart, endAt: rangeEnd }) => {
        const scheduleCollection = getCollection(this.firestore, `users/${user.uid}/schedule`);
        const scheduleQuery = buildQuery(
          scheduleCollection,
          orderByField('timestamp'),
          startAtValue(rangeStart),
          endAtValue(rangeEnd)
        );
        return observeCollectionData<ScheduleItem>(scheduleQuery, { idField: '$key' });
      }),
      map((data: ScheduleItem[]): ScheduleList => {
        const mapped: ScheduleList = {};
        for (const item of data) {
          if (!mapped[item.section]) {
            mapped[item.section] = item;
          }
        }
        return mapped;
      }),
      tap((next: ScheduleList) => {
        this.store.set('schedule', next);
      })
    );
    })
  );

  constructor(
    private firestore: Firestore,
    private auth: Auth,
    private store: Store,
    private authService: AuthService
  ) {}

  get uid(): string {
    const user = this.authService.user;
    if (!user) {
      throw new Error('User not authenticated');
    }
    return user.uid;
  }

  updateItems(items: Record<string, string[]>): Promise<DocumentReference | void> {
    const section = this.selectedSection;
    if (!section) {
      return Promise.reject(new Error('No schedule section is selected'));
    }
    const id = section.data.$key;
    const defaults: ScheduleItem = {
      meals: null,
      workouts: null,
      section: section.section,
      timestamp: new Date(section.day).getTime()
    };
    const payload: ScheduleItem = {
      ...(id ? section.data : defaults),
      ...items
    };
    if (id) {
      return this.updateSection(id, payload);
    }
    return this.createSection(payload);
  }

  updateDate(date: Date): void {
    this.date$.next(date);
  }

  selectSection(event: ScheduleSectionEvent): void {
    this.selectedSection = event;
    this.section$.next(event);
  }

  private createSection(payload: ScheduleItem): Promise<DocumentReference> {
    const scheduleCollection = getCollection(this.firestore, `users/${this.uid}/schedule`);
    return createDocument(scheduleCollection, toFirestoreData(payload));
  }

  private updateSection(key: string, payload: ScheduleItem): Promise<void> {
    const scheduleDoc = getDocument(this.firestore, `users/${this.uid}/schedule/${key}`);
    return updateDocument(scheduleDoc, toFirestoreData(payload));
  }

}
