import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { StopTrainingComponent } from './stop-training.component';
import { TrainingService } from '../training.service';

@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.css']
})
export class CurrentTrainingComponent implements OnInit {
  progress = 0;
  timer: any;

  constructor(public dialog: MatDialog, private trainingService: TrainingService){}

  ngOnInit(){
    this.startOrResumeTimer();
  }

  startOrResumeTimer(){
    const runningExercise = this.trainingService.getRunningExercise();

    if (runningExercise && runningExercise.duration !== undefined){
      const step = runningExercise.duration / 100 * 1000;
   
      this.timer = setInterval(() => {
        this.progress = this.progress + 1;
        if(this.progress >= 100){
          this.trainingService.completeExercise();
          clearInterval(this.timer);
        }
      }, step);
    }else{
      console.error("No running exercise found.");
    }
  }

  onStop(){
    clearInterval(this.timer);
    const dialogRef = this.dialog.open(StopTrainingComponent, {
      data: {
        progress: this.progress
      }
    });

    dialogRef.afterClosed().subscribe(result =>{
      if(result){
        this.trainingService.cancelExercise(this.progress);
      } else {
        this.startOrResumeTimer();
      }
    });
  }
}
