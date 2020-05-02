import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth'
import { auth } from 'firebase/app'
import { Router } from '@angular/router';

import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  username: string = ""
	password: string = ""

  constructor(public afAuth: AngularFireAuth, 
	public alertController: AlertController,
	public router: Router) { }

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

  async login() {
	const { username, password } = this
	try {
		// bypassing email by just adding @gmail.com to the end 
		const res = await this.afAuth.signInWithEmailAndPassword(username + '@gmail.com', password)
		this.router.navigate([`/navigation/${this.username}`])
	
	} catch(err) {
		this.presentAlert("Error!", "Username or Password is incorrect")
		console.dir(err)
		if(err.code === "auth/user-not-found") {
			console.log("User not found")
		}
	}
}

}
