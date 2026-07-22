import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Question } from '../../services/quiz.service';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './quiz.component.html'
})
export class QuizComponent implements OnInit {
  @Input() questions: Question[] = [];
  @Output() quizCompleted = new EventEmitter<void>();

  currentQuestionIndex = 0;
  selectedAnswer: number | null = null;
  score = 0;
  quizFinished = false;

  ngOnInit() {
    this.resetQuiz();
  }

  nextQuestion() {
    if (this.selectedAnswer === this.questions[this.currentQuestionIndex].correctOptionIndex) {
      this.score++;
    }
    this.selectedAnswer = null;
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
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
  }
}
