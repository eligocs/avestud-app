import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthConstants } from '../../../config/auth-constants';
import { AuthService } from '../services/auth.service';
import { StorageService } from '../services/storage.service';
import { ToastService } from '../services/toast.service';

@Component({
selector: 'home',
templateUrl: './home.page.html',
styleUrls: ['./home.page.scss']
})
export class IndexPage implements OnInit {

    constructor(
        private router: Router,
        private authService: AuthService,
        private storageService: StorageService,
        private toastService: ToastService
        ) {}
        
        ngOnInit() {}


}