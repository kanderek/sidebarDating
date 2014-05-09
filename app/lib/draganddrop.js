/**
 * Created with IntelliJ IDEA.
 * User: Ganaraj.Pr
 * Date: 11/10/13
 * Time: 11:27
 * To change this template use File | Settings | File Templates.
 */
angular.module("ngDragDrop",[])
    .directive("uiDraggable", [
        '$parse',
        '$rootScope',
        function ($parse, $rootScope) {
            return function (scope, element, attrs) {
                if (window.jQuery && !window.jQuery.event.props.dataTransfer) {
                    window.jQuery.event.props.push('dataTransfer');
                }
                element.attr("draggable", false);
                attrs.$observe("uiDraggable", function (newValue) {
                    // console.log('uiDraggable expression??');
                    // console.log(newValue);
                    element.attr("draggable", newValue);
                });
                var dragData = "";
                scope.$watch(attrs.drag, function (newValue) {
                    dragData = newValue;
                });
                element.bind("dragstart", function (e) {
                    var sendData = angular.toJson(dragData);
                    var sendChannel = attrs.dragChannel || "defaultchannel";
                    var dragImage = attrs.dragImage || null;
                    // console.log('in drag and drop...');
                    // console.log(dragImage);
                    // console.log(attrs);
                    if (dragImage) {
                        var dragImageFn = $parse(attrs.dragImage);
                        // console.log(dragImageFn);
                        scope.$apply(function() {
                            var dragImageParameters = dragImageFn(scope, {$event: e});
                            // console.log(dragImageParameters);
                            if (dragImageParameters && dragImageParameters.image) {
                                var dragIcon = document.createElement('img');//.style.zIndex="2147483647";
                                // dragIcon.src = "http://jhsdigital.weebly.com/uploads/1/2/7/2/12727281/8706388_orig.jpg";//
                                // dragIcon.src = "http://www.microcake.org/sidebardating/add.png";//
                                dragIcon.sr = dragImageParameters.image;
                                dragIcon.width = 100;
                                dragIcon.height = 100;
                                dragIcon.backgroundColor = "white";
                                //style.borderRadius = '50%';
                                // dragIcon.height = 300;
                                // dragIcon.style.zIndex = "2147483647";
                                // dragIcon.setAttribute('id', 'customDragImage');
                                // document.body.appendChild(dragIcon);

                                // console.log(dragIcon);
                                var xOffset = dragImageParameters.xOffset || 0,
                                    yOffset = dragImageParameters.yOffset || 0;
                                e.dataTransfer.setDragImage(dragIcon/*dragImageParameters.image*/, xOffset, yOffset);
                            }
                        });
                    }

                    e.dataTransfer.setData("Text", sendData);
                    // var dragIcon = document.createElement('img');
                    // dragIcon.src = 'logo.png';
                    // dragIcon.width = 100;
                    // e.dataTransfer.setDragImage(dragIcon, -10, -10);
                    $rootScope.$broadcast("ANGULAR_DRAG_START", sendChannel);

                });

                element.bind("dragend", function (e) {
                    var sendChannel = attrs.dragChannel || "defaultchannel";
                    $rootScope.$broadcast("ANGULAR_DRAG_END", sendChannel);
                    if (e.dataTransfer && e.dataTransfer.dropEffect !== "none") {
                        if (attrs.onDropSuccess) {
                            var fn = $parse(attrs.onDropSuccess);
                            scope.$apply(function () {
                                fn(scope, {$event: e});
                            });
                        }
                    }
                });


            };
        }
    ])
    .directive("uiOnDrop", [
        '$parse',
        '$rootScope',
        function ($parse, $rootScope) {
            return function (scope, element, attr) {
                var dragging = 0; //Ref. http://stackoverflow.com/a/10906204
                var dropChannel = "defaultchannel";
                var dragChannel = "";
                var dragEnterClass = attr.dragEnterClass || "on-drag-enter";
                var dragHoverClass = attr.dragHoverClass || "on-drag-hover";

                function onDragOver(e) {

                    if (e.preventDefault) {
                        e.preventDefault(); // Necessary. Allows us to drop.
                    }

                    if (e.stopPropagation) {
                        e.stopPropagation();
                    }
                    e.dataTransfer.dropEffect = 'move';
                    return false;
                }

                function onDragLeave(e) {
                  dragging--;
                  if (dragging == 0) {
                    element.removeClass(dragHoverClass);
                  }
                }

                function onDragEnter(e) {
                     if (e.preventDefault) {
                        e.preventDefault(); // Necessary. Allows us to drop.
                    }

                    // if (e.stopPropagation) {
                        e.stopPropagation();
                    // }
                    dragging++;
                    $rootScope.$broadcast("ANGULAR_HOVER", dropChannel);
                    element.addClass(dragHoverClass);
                }

                function onDrop(e) {
                    if (e.preventDefault) {
                        e.preventDefault(); // Necessary. Allows us to drop.
                    }
                    if (e.stopPropagation) {
                        e.stopPropagation(); // Necessary. Allows us to drop.
                    }
                    var data = e.dataTransfer.getData("Text");
                    data = angular.fromJson(data);
                    var fn = $parse(attr.uiOnDrop);
                    scope.$apply(function () {
                        fn(scope, {$data: data, $event: e});
                    });
                    element.removeClass(dragEnterClass);
                }


                $rootScope.$on("ANGULAR_DRAG_START", function (event, channel) {
                    dragChannel = channel;
                    if (dropChannel === channel) {

                        element.bind("dragover", onDragOver);
                        element.bind("dragenter", onDragEnter);
                        element.bind("dragleave", onDragLeave);

                        element.bind("drop", onDrop);
                        element.addClass(dragEnterClass);
                    }

                });



                $rootScope.$on("ANGULAR_DRAG_END", function (e, channel) {
                    dragChannel = "";
                    if (dropChannel === channel) {

                        element.unbind("dragover", onDragOver);
                        element.unbind("dragenter", onDragEnter);
                        element.unbind("dragleave", onDragLeave);

                        element.unbind("drop", onDrop);
                        element.removeClass(dragHoverClass);
                        element.removeClass(dragEnterClass);
                    }
                });


                $rootScope.$on("ANGULAR_HOVER", function (e, channel) {
                    if (dropChannel === channel) {
                      element.removeClass(dragHoverClass);
                    }
                });


                attr.$observe('dropChannel', function (value) {
                    if (value) {
                        dropChannel = value;
                    }
                });


            };
        }
    ]);
