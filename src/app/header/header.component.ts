import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  user_name: String;
  constructor( public router: Router) { }

  ngOnInit() {
    this.user_name = localStorage.getItem('user');
    console.log(this.user_name);
  }

  logout(){
    localStorage.removeItem('user');
    this.router.navigate(['/'] );

  }

}
