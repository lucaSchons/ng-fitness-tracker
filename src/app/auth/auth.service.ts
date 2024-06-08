import { Subject, Subscription } from 'rxjs';
import { Injectable, OnDestroy, inject } from '@angular/core';
import { AuthData } from './auth-data.model';
import { User } from './user.model';
import { Router } from '@angular/router';
import { Auth, user } from '@angular/fire/auth';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

@Injectable()
export class AuthService {
    authChange = new Subject<boolean>();
    private isAuthenticated = false;
     
    constructor(private router: Router, private afAuth: Auth) {}

    registerUser(authData: AuthData) {
        const auth = getAuth();
        createUserWithEmailAndPassword(auth, authData.email, authData.password)
        .then((userCredential) => {
            this.authSuccessfuly();
            const user = userCredential.user;
        })
        .catch((error) => {
            console.log(error);
        });
    }

    login(authData: AuthData) {
        const auth = getAuth();
        signInWithEmailAndPassword(auth, authData.email, authData.password)
        .then((userCredential) => {
            this.authSuccessfuly();
            const user = userCredential.user;
        })
        .catch((error) => {
            console.log(error);
        });    
    }

    logout(){
        this.authChange.next(false);
        this.router.navigate(['/login']);
    }

    isAuth(){
        return this.isAuthenticated;
    }

    private authSuccessfuly(){
        this.isAuthenticated = true;
        this.authChange.next(true);
        this.router.navigate(['/training']);
    }
}