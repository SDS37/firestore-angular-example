# Business requirements

## Who it is for

| Reader | Wants |
|---|---|
| An Angular developer evaluating Firestore | A small, complete app that shows auth, per-user data, live queries, and security rules working together |
| A contributor | A codebase with one clear place for each concern, tests, and docs that say how to run it |
| A user of the hosted app | To plan meals and workouts for each day of the week |

The app is an example first. Its features stay small so the Firestore and Angular patterns stay visible.

## What a user can do

1. **Have an account.** Register and log in with an email and a password. Log out.
2. **Keep a list of meals.** A meal has a name and a list of ingredients. Create, edit, and delete meals.
3. **Keep a list of workouts.** A workout has a name and a type. A strength workout records reps, sets, and weight. An endurance workout records distance (km) and duration (minutes). Create, edit, and delete workouts.
4. **Plan the week.** Pick a day in a week view, move between weeks, and assign meals and workouts to four sections of that day: morning, lunch, evening, and snacks and drinks.
5. **See changes live.** A change saved in one tab appears in another tab without a reload.

## Promises to the user

- **Privacy.** A user's meals, workouts, and schedule are visible only to that user, and only while signed in.
- **Honesty about failures.** A save that fails says so. (Not yet: [FAE-051](https://github.com/SDS37/firestore-angular-example/issues/105).)
- **Access.** The app works with a keyboard and allows zoom. (Not yet: [FAE-060](https://github.com/SDS37/firestore-angular-example/issues/109).)

## What "done" means

A colleague who has never seen the repo can follow the root README, run the app against a Firebase project, register, create a meal and a workout, assign both to today, and see them on the schedule. A second user on the same browser sees none of the first user's data. The [Definition of Done](DoD.md) is the full checklist.

## Out of scope

Social or passwordless login, sharing data between users, nutrition or calorie data, reminders and notifications, native apps, offline editing, translations, and any server of our own. Ideas from the old README checklist (NgRx, GraphQL, optimistic UI) are not requirements.
