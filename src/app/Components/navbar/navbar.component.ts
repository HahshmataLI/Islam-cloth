import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink,RouterLinkActive,CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  email: string | null = null;
name: string | null = null;

ngOnInit(): void {
  this.email = localStorage.getItem('email');
  this.name = localStorage.getItem('name'); // Get the name from localStorage
  console.log('Logged in user:', this.name || this.email); // Log user name or email
}


  constructor(private authService: AuthService, private router: Router) {}
  onLogout(): void {
    this.authService.logout(); // Call the logout method
    localStorage.removeItem('name'); // Clear name from localStorage
    this.router.navigate(['/login']); // Redirect to login page
  }
  
  dropdownOpen = false;

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  onClickOutside(event: Event): void {
    const targetElement = event.target as HTMLElement;
    if (!targetElement.closest('.dropdown')) {
      this.dropdownOpen = false;
    }
  }
}
