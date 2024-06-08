import { Subject } from 'rxjs-compat/Subject';
import { Injectable } from '@angular/core';
import { Exercise } from './exercise.model';
import { inject } from '@angular/core';
import { Firestore, collectionData, FirestoreModule, doc} from '@angular/fire/firestore';
import { getFirestore, collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { Observable } from 'rxjs';
import 'rxjs-compat/add/operator/map';
import { Subscription } from 'rxjs'

@Injectable()
export class TrainingService {
  exerciseChanged = new Subject<Exercise | null>();
  exercisesChanged = new Subject<Exercise[]>();
  private runningExercise: Exercise | any;
  firestore: Firestore = inject(Firestore);
  exercises: Exercise[] = [];
  availableExercises: Exercise[] = [];
  finishedExercisesChanged = new Subject<Exercise[]>();

  
  constructor(){}

  fetchAvailableExercises() {
    const collectionInstance = collection(this.firestore, 'availableExercises');
    collectionData(collectionInstance, {idField: 'id'})
    .subscribe((exercises: any[]) => {
      this.availableExercises = exercises; 
      this.exercisesChanged.next([...this.availableExercises]);
      console.log(exercises);
    });
    // this.data = collectionData(collectionInstance, {idField: 'id'});
    
  }

  getAvailableExercises(){
    return this.availableExercises.slice();
  }

  startExercise(selectedId: string) {
    console.log("dentro do startExercise", selectedId);
    this.runningExercise = this.availableExercises.find(
      ex => ex.id === selectedId
    );
    this.exerciseChanged.next({ ...this.runningExercise });
  }

  completeExercise() {
    this.addDataToDatabase({ ...this.runningExercise, 
      date: new Date(), 
      state: 'completed'  
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
    
  }

  cancelExercise(progress: number) {
    this.addDataToDatabase({
      ...this.runningExercise,
      duration: this.runningExercise.duration * (progress / 100),
      calories: this.runningExercise.calories * (progress / 100),
      date: new Date(),
      state: 'cancelled'
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  getRunningExercise(){
    return {...this.runningExercise};
  }

  fetchCompletedOrCancelledExercises(){
    const collectionInstance = collection(this.firestore, 'finishedExercises');
    collectionData(collectionInstance, {idField: 'id'})
    .subscribe((exercises: any[]) => {
      this.finishedExercisesChanged.next(exercises);
    });
  }

  private addDataToDatabase(exercise: Exercise){
    const collectionInstance = collection(this.firestore, 'finishedExercises');
    addDoc(collectionInstance, exercise)
      .then(() => {
        console.log('Data saved');
      })
      .catch((err) => {
        console.log(err);
      })
  }
}