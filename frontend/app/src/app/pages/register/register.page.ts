import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth'
import { auth } from 'firebase/app'

import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  username: string = ""
	password: string = ""
	cpassword: string = ""

  constructor(
    public afAuth: AngularFireAuth,
    public alertController: AlertController,
		public router: Router
    ) { }

  ngOnInit() {
  }

  async presentAlert(title: string, content: string) {
		const alert = await this.alertController.create({
			header: title,
			message: content,
			buttons: ['OK']
		})

		await alert.present()
	}

  async register() {
    const { username, password, cpassword } = this
		if(password !== cpassword) {
        this.presentAlert("Error!", "Passwords don't match")
		    return console.error("Passwords don't match")
    }
    try{
      const res = await this.afAuth.createUserWithEmailAndPassword(username + '@gmail.com', password)
      this.presentAlert('Success', 'You are registered!')
			this.router.navigate(['/home'])
    }
    catch{
      console.dir(Error)
    }
  }
}
