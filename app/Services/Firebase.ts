import admin, { app } from 'firebase-admin'
import App = app.App
import Application from '@ioc:Adonis/Core/Application'
import Env from '@ioc:Adonis/Core/Env'

class Firebase {
  private readonly app: App

  constructor() {
    const path = Application.tmpPath(Env.get('FIREBASE_SDK'))
    const serviceAccount = require(path)
    this.app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    })
  }

  public getApp() {
    return this.app
  }
}

export default new Firebase()
