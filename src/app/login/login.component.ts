// В классе компонента импортируем библиотеки для настройки формы и входа в учетную запись. 
import { Component, Inject, OnInit } from '@angular/core';
import { OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import OktaSignIn from '@okta/okta-signin-widget';
// Также импортируем файл с настройками OpenID который мы создали ранее.
import myAppConfig from 'src/app/config/application-config';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  oktaSignin: any;
  // Внедряем OktaAuth.
  constructor(@Inject(OKTA_AUTH) public oktaAuth: OktaAuth) {
    // Настраиваем нашу форму через обьект OktaSugnIn. 
    this.oktaSignin = new OktaSignIn({
      // Можем задать Лого нашего сайта
      logo: 'assets/images/logo.png',
      features: {
        registration: true
      },
      // и передаем корфигурации из application-config
      // которые мы определяли ранее в настройки формы.
      baseUrl: myAppConfig.oidc.issuer.split('/outh2')[0],
      clientId: myAppConfig.oidc.clientId,
      redirectUri: myAppConfig.oidc.redirectUri,
      useClassicEngine: true,
      authParams: {
        //pkce просто дополнительное мера безопасности при обмене данными между 
        // фронтом и сервером аутентификации
        pkce: true,
        issuer: myAppConfig.oidc.issuer,
        scopes: myAppConfig.oidc.scopes
      }
    });
   }

  ngOnInit(): void {
    // С помощью Remove очишаем форму.
    // Как только юзер отправляет данные он получает response.  
    this.oktaSignin.remove();
    // и теперь рендерим елемент на странице тот который с id="okta-sign-in-widget" чтобы там появилась форма.
    this.oktaSignin.renderEl({
      el: '#okta-sign-in-widget'
    }, 
      (response: any) => {
        // если данные пользователя проверены и все верно то статус в этом response - "SUCCESS". 
        if(response.status === 'SUCCESS') {
          // и значит входим и перенаправляем на страницу которую указывали в настройках
          this.oktaAuth.signInWithRedirect();
        }
      },
      (error: any) => {
        throw error;
      }
    );
  }
}
