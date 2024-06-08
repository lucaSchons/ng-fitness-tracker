import { Exercise } from './../exercise.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { TrainingService } from '../training.service';
import { NgForm } from '@angular/forms';
import { Observable, Subscription, from, map } from 'rxjs';
import { Firestore, collectionData, FirestoreModule} from '@angular/fire/firestore';
import 'firebase/compat/firestore';
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})

export class NewTrainingComponent implements OnInit, OnDestroy {
  exercises!: Exercise[];
  exerciseSubscription!: Subscription;

  constructor(private trainingService: TrainingService) {
    this.exerciseSubscription = this.trainingService.exercisesChanged.subscribe(
      exercises => (this.exercises = exercises)
    );
    this.trainingService.fetchAvailableExercises();
  }

  ngOnInit() {
    
  }
  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
    console.log(form.value.exercise);
  }

  ngOnDestroy() {
    this.exerciseSubscription.unsubscribe();
  }
}