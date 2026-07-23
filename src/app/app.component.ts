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

  constructor(public quizService: QuizService) {} // Changed to public to read state in HTML

  ngOnInit() {
    this.refreshData();
  }

  refreshData() {
    this.quizService.getQuestions().subscribe(data => this.questions = data);
  }

  toggleMode() {
    if (!this.isAdminMode) {
      if (!this.quizService.isAdminLoggedIn) {
        const username = prompt('Enter Admin Username:');
        const password = prompt('Enter Admin Password:');

        if (!username || !password) {
          alert('Username and password are required!');
          return;
        }

        // 1. Generate the test authentication token
        const testToken = this.quizService.createAuthToken(username, password);

        // 2. Ping the server to verify instead of checking local hardcoded strings
        this.quizService.verifyAdminCredentials(testToken).subscribe({
          next: () => {
            // Server returned 200 OK -> credentials are valid!
            this.quizService.setCredentials(testToken);
            this.isAdminMode = true;
            this.refreshData();
          },
          error: (err) => {
            // Server returned 401 Unauthorized -> credentials failed
            console.error('Authentication failed', err);
            alert('Invalid login credentials! Access Denied.');
          }
        });
      } else {
        this.isAdminMode = true;
      }
    } else {
      this.isAdminMode = false;
    }
  }

  handleLogout() {
    this.quizService.logout();
    this.isAdminMode = false;
    this.refreshData();
  }
}
