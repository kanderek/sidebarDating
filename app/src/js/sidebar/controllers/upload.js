/*******************************************************************************************************
Upload Test Controller  */

appControllers.controller('UploadTestCtrl',
  [
    '$scope',
    '$upload',
    '$rootScope',
    '$state',

    function(
      $scope,
      $upload,
      $rootScope,
      $state
    ) {

        $scope.largeImage = "/userId_1.jpg";
        $scope.mediumImage = "/thumb_okc_profile2.jpg";

        function uploadProgressHandler(event) {
          console.log('percent: ' + parseInt(100.0 * event.loaded / event.total, 10));
        }

        function adjustImageFilePath() {
          // file is uploaded successfully
          $scope.largeImage =  "/" + file.name;
          $scope.mediumImage = "/thumb_"+ file.name;
          // $scope.mediumImage = "http://lorempixel.com/200/200/sports/";
          // console.log(data);
        }

        $scope.onFileSelect = function($files) {
          //$files: an array of files selected, each file has name, size, and type.
          for (var i = 0; i < $files.length; i++) {
            var file = $files[i];
            console.log(file);
            $scope.upload = $upload.upload({
              url: SERVER + '/upload', //upload.php script, node.js route, or servlet url
              // method: POST or PUT,
              // headers: {'header-key': 'header-value'},
              // withCredentials: true,
              data: {myObj: $scope.myModelObj},
              file: file, // or list of files: $files for html5 only
              /* set the file formData name ('Content-Desposition'). Default is 'file' */
              //fileFormDataName: myFile, //or a list of names for multiple files (html5).
              /* customize how data is added to formData. See #40#issuecomment-28612000 for sample code */
              //formDataAppender: function(formData, key, val){}
            })
              .progress(uploadProgressHandler)
              .success(adjustImageFilePath);
            //.error(...)
            //.then(success, error, progress);
            //.xhr(function(xhr){xhr.upload.addEventListener(...)})// access and attach any event listener to XMLHttpRequest.
          }
          /* alternative way of uploading, send the file binary with the file's content-type.
             Could be used to upload files to CouchDB, imgur, etc... html5 FileReader is needed.
             It could also be used to monitor the progress of a normal http post/put request with large data*/
          // $scope.upload = $upload.http({...})  see 88#issuecomment-31366487 for sample code.
        };

  }]);