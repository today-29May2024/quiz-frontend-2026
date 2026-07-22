import { Component, OnInit } from '@angular/core';
import { QuizService, Question } from './services/quiz.service';
import { QuizComponent } from './components/quiz/quiz.component';
import { AdminComponent } from './components/admin/admin.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [QuizComponent, AdminComponent],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  questions: Question[] = [];
  isAdminMode = false;

  constructor(private quizService: QuizService) {}

  ngOnInit() {
    this.refreshData();
  }

  refreshData() {
    this.quizService.getQuestions().subscribe(data => this.questions = data);
  }

  toggleMode() {
    this.isAdminMode = !this.isAdminMode;
  }
}
