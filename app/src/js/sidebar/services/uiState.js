/*******************************************************************************************************
Ui State Service  */

appServices.factory('UiState',
  [
    'Profile',
    'Iframe',

    function (
      Profile,
      Iframe
    ){

  var previousState = null;
  var currentState = null;
  var showSidebar = true;
  var showDetailsPanel = false;
  var showShortProfile = false;

  function resetSelectIndicator(){
    $('#select-indicator').removeClass().addClass('apply-indicator');
  }

  function selectTransition(){
      $('#detailsContent').css('opacity', 0);
  }

  function selectProfile(user, from){
    // uiStateService.selectTransition();
    // uiStateService.showShortProfile = false;
    console.log('selected profile from...');
    console.log(from);
   if( $('#select-indicator').hasClass('init-indicator') && showDetailsPanel){
    if(from == 'list'){
     resetSelectIndicator();
    }
   }
    return Profile.selectProfile(user,from);
  }

  function openDetailsPanel(){
    console.log('opendetailspanel called');
    showDetailsPanel = true;

    // send message to open profileDetails iframe
  }

  function closeDetailsPanel(){
    console.log('closedetailspanel called');
    console.log('select indicator...');

    showDetailsPanel = false;
    var select = $('#select-indicator');
    
    console.log(select);
    
    if(select.hasClass('apply-indicator')){
      select.removeClass('apply-indicator').addClass('remove-indicator');
    }
    else{
      // send message to close profileDetails iframe
    }
  }

  function openSidebar(){
    console.log('show sidebar');
    showSidebar = true;
    // setup callback from iframe message here
  }

  function closeSidebar(){
    console.log('close sidebar');
    showSidebar = false;
    // setup callback from iframe message here
  }

  return {
    previousState: previousState,
    currentState: currentState,
    selectProfile: selectProfile,
    openSidebar: openSidebar,
    closeSidebar: closeSidebar,
    openDetailsPanel: openDetailsPanel,
    closeDetailPanel: closeDetailsPanel,
  };

}]);
