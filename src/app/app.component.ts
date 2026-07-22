import { Component, OnInit, inject } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

interface Question {
  id: number;
  title: string;
  options: string[];
  correctOptionIndex: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HttpClientModule, FormsModule],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  private http = inject(HttpClient);
  
  questions: Question[] = [];
  currentQuestionIndex = 0;
  selectedAnswer: number | null = null;
  score = 0;
  quizFinished = false;

  ngOnInit() {
    this.loadQuestions();
  }

  loadQuestions() {
    this.http.get<Question[]>('http://localhost:8000/api/quiz')
      .subscribe({
        next: (data) => this.questions = data,
        error: (err) => console.error('Could not connect to Spring Boot backend', err)
      });
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
    }
  }

  resetQuiz() {
    this.currentQuestionIndex = 0;
    this.selectedAnswer = null;
    this.score = 0;
    this.quizFinished = false;
    this.loadQuestions();
  }
}
