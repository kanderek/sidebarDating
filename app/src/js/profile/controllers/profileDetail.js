/*******************************************************************************************************
Profile Detail Controller  */

appControllers.controller('ProfileDetailCtrl',
  [
    '$rootScope',
    '$scope',
    'Profile',
    'InterestService',
    'SharedInterestService',
    'Iframe',

  function($rootScope, $scope, Profile, InterestService, SharedInterestService, Iframe) {

    $scope.profile = {};
    $scope.treemapData = {};
    $scope.sharedInterestData = {};
    $scope.slideIndex = 0;
    $scope.viewingSelf = false;
    $scope.dancecardFilled = false;
    $scope.mutualMatch = false;
    $scope.userInDanceCard = false;


    Iframe.onMessage('showProfile', handleShowProfile);

    function handleShowProfile(profileData) {

      var userid = profileData.userid1;
      var browsingUserId = profileData.userid2;

      $scope.viewingSelf = profileData.userid1 === profileData.userid2;
      $scope.mutualMatch = profileData.mutualMatch;
      $scope.userInDanceCard = profileData.userInDancecard;
      $scope.dancecardFilled = profileData.dancecardFilled;

      Profile.getProfileById(userid)
        .then(function (profileData) {

          $scope.profile.selectedProfile = profileData;
          $scope.slideIndex = 0;
        
        });

      InterestService.usersTreemap(userid, function(data){
        $scope.treemapData = data;
      });

      SharedInterestService.getSharedInterestUrls(userid, browsingUserId)
        .then(renderSharedInterests);

    }

    $scope.prev = function() {
        $scope.slideIndex--;
    };
    $scope.next = function() {
        $scope.slideIndex++;
    };

    $scope.isSelf = function(){
      return $scope.viewingSelf;
    };

    $scope.showAddButton = function(){
      return !$scope.userInDanceCard && !$scope.dancecardFilled && !$scope.viewingSelf;
    };

    $scope.showRemoveButton = function(){
      return $scope.userInDanceCard && !$scope.isSelf();
    };

    $scope.showMessageButton = function(){
      return $scope.mutualMatch && !$scope.viewingSelf;
    };

    $scope.addToDancecard = function () {
      var userid = $scope.profile.selectedProfile.userid;

      Iframe.addToDancecard(userid);
    };

    $scope.removeFromDancecard = function () {
      var userid = $scope.profile.selectedProfile.userid;

      Iframe.removeFromDancecard(userid);
    };

    $scope.openMessages = function () {
      var userid = $scope.profile.selectedProfile.userid;

      Iframe.openMessages(userid);
    };

    function renderSharedInterests(data) {

      data = data.data[0];

      $scope.sharedInterestData = data;

      if (data) {
        for(var i=0; i<data.length; i++){
          var embedURL = data[i].embed_url,
              embedTag,
              embedAttrs;
          if(embedURL) {
            embedAttrs = {"src": embedURL};
            embedAttrs = $.extend(embedAttrs, angular.fromJson(data[i].embed_attr));
            embedTag = $('<iframe/>', embedAttrs)[0].outerHTML;
          }
          else {
            tagDiv = $('<div/>');
            tagImg = $('<img/>', {
              src: data[i].primary_img_url
            });
            tagA1 = $('<a/>', {
              href: data[i].url,
              target: "_blank"
            });
            tagP = $('<p/>');
            tagA2 = $('<a/>', {
              href: data[i].url,
              target: "_blank",
              text: data[i].page_title}
            );
            tagA1.html(tagImg).appendTo(tagDiv);
            tagP.html(tagA2).appendTo(tagDiv);
            embedTag = tagDiv[0].outerHTML;
          }
          data[i].embed_tag = embedTag;
        }
      }
    }

  }]);