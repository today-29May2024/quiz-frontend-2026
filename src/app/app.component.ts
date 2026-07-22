import { Component, OnInit, inject } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

interface Question {
  id?: number;
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
  private apiUrl = 'http://localhost:8000/api/quiz';
  
  questions: Question[] = [];
  currentQuestionIndex = 0;
  selectedAnswer: number | null = null;
  score = 0;
  quizFinished = false;
  isAdminMode = false;

  // FIX: Refactored form state tracking to use explicit object structures
  newTitle = '';
  newOptions = [
    { value: '' },
    { value: '' },
    { value: '' },
    { value: '' }
  ];
  newCorrectIndex = 0;

  ngOnInit() {
    this.loadQuestions();
  }

  loadQuestions() {
    this.http.get<Question[]>(this.apiUrl)
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

  // FIX: Unpacks explicit option data payloads cleanly
  addQuestion() {
    // 1. Validation Check
    if (!this.newTitle.trim() || this.newOptions.some(opt => !opt.value.trim())) {
      alert('Please fill out the question title and all 4 options.');
      return;
    }

    // 2. Map object array into raw string array for Spring Boot's API expectation
    const questionToSave: Question = {
      title: this.newTitle,
      options: this.newOptions.map(opt => opt.value),
      correctOptionIndex: Number(this.newCorrectIndex)
    };

    // 3. Post to PostgreSQL
    this.http.post<Question>(this.apiUrl, questionToSave).subscribe({
      next: () => {
        alert('Question saved successfully!');
        this.loadQuestions(); // Refreshes management dashboard layout view
        
        // Clear forms completely
        this.newTitle = '';
        this.newOptions = [{ value: '' }, { value: '' }, { value: '' }, { value: '' }];
        this.newCorrectIndex = 0;
      },
      error: (err) => {
        console.error('Error adding question', err);
        alert('Failed to save to database. Check your backend console logs.');
      }
    });
  }

  deleteQuestion(id: number | undefined) {
    if (!id) return;
    if (confirm('Are you sure you want to delete this question?')) {
      this.http.delete(`${this.apiUrl}/${id}`).subscribe({
        next: () => this.loadQuestions(),
        error: (err) => console.error('Error deleting question', err)
      });
    }
  }

  toggleMode() {
    this.isAdminMode = !this.isAdminMode;
    this.resetQuiz();
  }
}
