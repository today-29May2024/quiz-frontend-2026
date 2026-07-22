import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Question } from '../../services/quiz.service';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './quiz.component.html'
})
export class QuizComponent implements OnInit, OnDestroy {
  @Input() questions: Question[] = [];
  @Output() quizCompleted = new EventEmitter<void>();

  currentQuestionIndex = 0;
  selectedAnswer: number | null = null;
  score = 0;
  quizFinished = false;

  // Timer Configuration States
  timeLeft = 15; 
  timerInterval: any;

  ngOnInit() {
    this.resetQuiz();
  }

  // Clear timers if user switches views or leaves mid-quiz
  ngOnDestroy() {
    this.stopTimer();
  }

  startTimer() {
    this.stopTimer(); // Reset any existing active intervals
    this.timeLeft = 15; // Set duration to 15 seconds per question

    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      
      if (this.timeLeft <= 0) {
        this.handleTimeout();
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  handleTimeout() {
    this.stopTimer();
    alert("Time's up for this question!");
    this.selectedAnswer = null; // Forces no selection points
    this.advanceNextStep();
  }

  nextQuestion() {
    // Grade the answer selection index against the database property 
    if (this.selectedAnswer === this.questions[this.currentQuestionIndex].correctOptionIndex) {
      this.score++;
    }
    this.selectedAnswer = null;
    this.stopTimer();
    this.advanceNextStep();
  }

  advanceNextStep() {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      this.startTimer(); // Restart clock sequence for new card display
    } else {
      this.quizFinished = true;
      this.quizCompleted.emit();
    }
  }

  resetQuiz() {
    this.currentQuestionIndex = 0;
    this.selectedAnswer = null;
    this.score = 0;
    this.quizFinished = false;
    this.startTimer(); // Boot countdown for question card #1
  }
}
