# yolked
Lifting program creator, manager and more.

## Lifting program

The idea is to use google docs as the "database" so that a user can have access to all of the data easily. This also makes it possible to host the whole website using github pages.

"Downloading" a program can be done by pasting a string of data (not sure which format yet).

The program editor should make it easy to configure transitions.

Example:

Once you hit 4x12 at weight -> increase weight by 2.5kg and go to 4x8

Maybe a node based visual editor would be cool?

The user should also be able to easily modify his current program if something unexpect happens in his life, whether the user just doesn't have time to fit in a session or is too fatigued.

MVP 

- [ ] Manual progressive overload, meaning that the program can't tell the user which weight and how many reps/sets he SHOULD hit and instead the user would have to estimate it based on the previous session
- [ ] CRUD operations for database
- [ ] Export/Import database
- [ ] Workout history
- [ ] Workout plan viewer
- [ ] Active workout session (When you are in the gym)
- [ ] Node based program creator prototype

## Calorie tracker

I always wanted to create a custom calorie tracker which is more suited to lifters than the average person (MyFitnessPal). The database would also be based on google drive and the user would have to manually build his own database of foods. Of course importing/exporting a database should also be easy. Having your own database makes it easy to correct data about food, not like with MyFitnessPal where you might have to create a seperate entry with a different name.

MVP

- [ ] Identify food based on bar code
- [ ] Save food in database
- [ ] Export/Import database
- [ ] CRUD operations for database
- [ ] Calculating required caloric intake based on Protein, Fat and Carbs
- [ ] Bodyweight history (entry, average week, ...)
