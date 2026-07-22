import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QuizService, Question } from '../../services/quiz.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin.component.html'
})
export class AdminComponent {
  @Input() questions: Question[] = [];
  @Output() refreshRequested = new EventEmitter<void>();

  newTitle = '';
  newOptions = [{ value: '' }, { value: '' }, { value: '' }, { value: '' }];
  newCorrectIndex = 0;

  constructor(private quizService: QuizService) {}

  addQuestion() {
    if (!this.newTitle.trim() || this.newOptions.some(opt => !opt.value.trim())) {
      alert('Please fill out the question title and all 4 options.');
      return;
    }

    const questionToSave: Question = {
      title: this.newTitle,
      options: this.newOptions.map(opt => opt.value),
      correctOptionIndex: Number(this.newCorrectIndex)
    };

    this.quizService.addQuestion(questionToSave).subscribe({
      next: () => {
        alert('Question saved successfully!');
        this.refreshRequested.emit();
        this.newTitle = '';
        this.newOptions = [{ value: '' }, { value: '' }, { value: '' }, { value: '' }];
        this.newCorrectIndex = 0;
      }
    });
  }

  deleteQuestion(id: number | undefined) {
    if (!id) return;
    if (confirm('Are you sure you want to delete this question?')) {
      this.quizService.deleteQuestion(id).subscribe({
        next: () => this.refreshRequested.emit()
      });
    }
  }
}
