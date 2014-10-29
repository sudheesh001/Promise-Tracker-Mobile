angular.module('ptApp', ['ionic', 'ptApp.controllers', 'ptApp.services', 'pascalprecht.translate'], function($httpProvider){
  $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
  
  /**
   * The workhorse; converts an object to x-www-form-urlencoded serialization.
   * @param {Object} obj
   * @return {String}
   */ 

  var param = function(obj) {
    var query = '', name, value, fullSubName, subName, subValue, innerObj, i;
      
    for(name in obj) {
      value = obj[name];
        
      if(value instanceof Array) {
        for(i=0; i<value.length; ++i) {
          subValue = value[i];
          fullSubName = name + '[' + i + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += param(innerObj) + '&';
        }
      }
      else if(value instanceof Object) {
        for(subName in value) {
          subValue = value[subName];
          fullSubName = name + '[' + subName + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += param(innerObj) + '&';
        }
      }
      else if(value !== undefined && value !== null)
        query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
    }
      
    return query.length ? query.substr(0, query.length - 1) : query;
  };
 
  // Override $http service's default transformRequest
  $httpProvider.defaults.transformRequest = [function(data) {
    return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
  }];
})

.run(function($ionicPlatform) {
  
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    .state('home', {
      url: '/home',
      templateUrl: 'templates/home.html',
      controller: 'HomeCtrl'
    })
  
    .state('survey-start', {
      url: '/surveys/:surveyId/start',
      templateUrl: 'templates/survey-start.html',
      controller: 'SurveysCtrl'   
    })
  
    .state('input', {
      url: '/surveys/:surveyId/:inputId',
      templateUrl: 'templates/input.html',
      controller: 'InputsCtrl'   
    })

    .state('survey-end', {
      url: '/end/:surveyId',
      templateUrl: 'templates/survey-end.html',
      controller: 'EndCtrl'   
    })

    .state('user', {
      url: '/user',
      templateUrl: 'templates/user.html',
      controller: 'UsersCtrl'
    })

    $urlRouterProvider.otherwise('/home');
})

.config(['$translateProvider', function ($translateProvider) {
  $translateProvider.translations('en', {
    // Home page
    'MY_SURVEYS': 'My surveys',
    'NEW_SURVEY': 'Get new survey',
    'PROMPTS': '{NUM, plural, one{prompt} other{prompts}}',
    'UNSYNCED_SURVEYS': '{NUM, plural, one{response has} other{responses have}} not been synced',
    'SYNC_NOW': 'Sync now',
    'ALL_SYNCED': 'All responses have been synced',
    'ENTER_CODE': 'Enter survey code',
    'GET_SURVEY': 'Get survey',
    'CANCEL': 'Cancel',

    // User page
    'MY_PROFILE': 'My profile',
    'ADD_BIO': 'Add bio / description',
    'CAMPAIGNS': '{NUM, plural, one{data collection campaign} other{data collection campaigns}}',
    'SURVEYS': '{NUM, plural, one{survey} other{surveys}} completed',
    'DELETE_SURVEYS': 'Delete all survey forms',

    //Survey
    'START_DATE': 'Start date',
    'END_DATE': 'End date',
    'START_SURVEY': 'Start survey',
    'NEXT': 'Next',
    'BACK': 'Back',
    'TAKE_PICTURE': 'Take a picture',
    'GET_LOCATION': 'Record location',
    'CHOOSE_ONE': 'Select one',
    'CHOOSE_MANY': 'Select all that apply',
    'SURVEY_PROGRESS': 'Survey',
    'SURVEY_COMPLETE': 'You have completed the survey!',
    'SUBMIT_NOW': 'Submit now',
    'SUBMIT_LATER': 'Submit later',
    'CANCEL_AND_DELETE': 'Cancel and delete this response'
  });

  $translateProvider.translations('pt-BR', {
    // Home page
    'MY_SURVEYS': 'Meus formulários',
    'NEW_SURVEY': 'Baixar novo formulário',
    'PROMPTS': '{NUM, plural, one{campo} other{campos}}',
    'UNSYNCED_SURVEYS': '{NUM, plural, one{resposta não foi salva} other{respostas não foram salvas}}',
    'SYNC_NOW': 'Salvar agora',
    'ALL_SYNCED': 'Todas as respostas já foram salvadas',
    'ENTER_CODE': 'Código do formulário',
    'GET_SURVEY': 'Baixar formulário',
    'CANCEL': 'Cancelar',
    'PLURAL': '{GENDER, select, male{He} female{She} other{They}} liked this.',

     // User page
    'MY_PROFILE': 'Meu perfil',
    'ADD_BIO': 'Adicionar biografia / descripção',
    'CAMPAIGNS': '{NUM, plural, one{ação} other{ações}}',
    'SURVEYS': '{NUM, plural, one{formulário completado} other{formulários completados}}',
    'DELETE_SURVEYS': 'Eliminar todos os formulários',

    //Survey
    'START_DATE': 'Data de lançamento',
    'END_DATE': 'Data final',
    'START_SURVEY': 'Preencher formulário',
    'NEXT': 'Próximo',
    'BACK': 'Voltar',
    'TAKE_PICTURE': 'Tirar uma foto',
    'GET_LOCATION': 'Obter localização',
    'CHOOSE_ONE': 'Selecionar uma',
    'CHOOSE_MANY': 'Selecionar todas que se aplicam',
    'SURVEY_PROGRESS': 'Andamento',
    'SURVEY_COMPLETE': 'Você completou o formulário!',
    'SUBMIT_NOW': 'Mandar agora',
    'SUBMIT_LATER': 'Mandar depois',
    'CANCEL_AND_DELETE': 'Cancelar e eliminar esta resposta'
  });

  $translateProvider.addInterpolation('$translateMessageFormatInterpolation');
  $translateProvider.preferredLanguage('pt-BR');
}]);