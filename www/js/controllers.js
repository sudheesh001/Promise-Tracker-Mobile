angular.module('ptApp.controllers', [])

.controller('HomeCtrl', function($scope, $ionicModal, $http, $state, Survey) {
  $scope.surveys = Survey.surveys;
  $scope.errorMessage = '';

  $ionicModal.fromTemplateUrl(
    'enter-code.html', 
    function(modal){ $scope.enterCodeModal = modal; }, 
    {
      scope: $scope,
      animation: 'slide-in-up',
      focusFirstInput: true
    }
  );

  $scope.openCodeModal = function(){
    $scope.enterCodeModal.show();
  };

  $scope.closeCodeModal = function(){
    $scope.enterCodeModal.hide();
    $scope.errorMessage = '';
  };

  $scope.fetchSurvey = function(survey){

    var success = function(response){
      if(response.id){
        $scope.enterCodeModal.hide();
        $scope.errorMessage = '';
        $state.go($state.current, {}, {reload: true});
      } else {
        $scope.errorMessage = 'Survey not found. Please check code and try again.';
      }
    };

    if(survey){
      Survey.downloadSurvey(survey.code, success);
    } else {
      $scope.errorMessage = 'Please enter a survey code.';
    }
  };

  $scope.getUnsynced = function(){
    return Survey.unsynced.length;
  }

  $scope.syncSurveys = function(){
    Survey.syncAll();
  }
})

.controller('EndCtrl', function($scope, $stateParams, $state, Survey, $location, $http) {
  $scope.survey = Survey.surveys[$stateParams.surveyId];

  // Simulate submit & save - to be implemented
  $scope.submitResponse = function(){
    Survey.currentResponse.timestamp = Date.now();
    Survey.syncResponse(Survey.currentResponse);
    $state.go('home');
  };

  $scope.saveResponse = function(){
    Survey.currentResponse.timestamp = Date.now();
    Survey.unsynced.push(Survey.currentResponse);
    $state.go('home');
  };

  $scope.backToSurvey = function(){
    $state.go('input', {
      surveyId: $stateParams.surveyId, 
      inputId: Survey.currentResponse.inputs.length - 1
    });
  }
})

.controller('UsersCtrl', function($scope, $stateParams, $state, Survey, $location) {
})

.controller('SurveysCtrl', function($scope, $stateParams, $state, Survey, $location) {
  $scope.survey = Survey.getSurvey($stateParams.surveyId);

  $scope.startSurvey = function(){
    Survey.currentResponse = {};
    Survey.currentResponse.inputs = Survey.getInputs($stateParams.surveyId);
    Survey.currentResponse.survey_id = $stateParams.surveyId;
    Survey.currentInputIndex = 0;

    $state.transitionTo('input', {
      surveyId: $stateParams.surveyId, 
      inputId: Survey.currentResponse.inputs[Survey.currentInputIndex].id
    })
  };
})

.controller('InputsCtrl', function($scope, $stateParams, $state, Survey){
  $scope.survey = Survey.getSurvey($stateParams.surveyId);
  $scope.index = Survey.currentInputIndex;
  $scope.input = Survey.currentResponse.inputs[Survey.currentInputIndex];
  $scope.input.input_type == 'select' ? $scope.input.answer = $scope.input.answer || [] : false;

  $scope.getImage = function(){

    var onSuccess = function(imageURI){
      $scope.input.answer = imageURI;
      $state.go($state.current, {}, {reload: true});
    };

    var onError = function(){};

    navigator.camera.getPicture(onSuccess, onError, {
      limit: 1,
      quality: 50,
      destinationType: Camera.DestinationType.FILE_URI
    });
  }

  $scope.getLocation = function(){
    $scope.input.answer = $scope.input.answer || {};
    $scope.input.msg = 'Getting Location...';
    navigator.geolocation.getCurrentPosition(function(position){
      $scope.input.answer.lng = position.coords.longitude;
      $scope.input.answer.lat = position.coords.latitude;
      $scope.input.msg = '';
      $state.go($state.current, {}, {reload: true});
    });
  };

  $scope.nextPrompt = function(){
    if(Survey.currentInputIndex < (Survey.currentResponse.inputs.length - 1)){
      Survey.currentInputIndex += 1;
      $state.transitionTo('input', {
        surveyId: $stateParams.surveyId, 
        inputId: Survey.currentResponse.inputs[Survey.currentInputIndex].id
      });
    } else {
      $state.go('survey-end', {surveyId:  $scope.survey.id});
    }
  };

  $scope.previousPrompt = function(){
    if(Survey.currentInputIndex > 0){
      Survey.currentInputIndex -= 1;
      $state.go('input', {
        surveyId: $stateParams.surveyId, 
        inputId: Survey.currentResponse.inputs[Survey.currentInputIndex.id]
      });
    }
  };
})