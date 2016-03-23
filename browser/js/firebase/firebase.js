app.factory('Firebase', function(Component) {

  var firebase;

  var factory = {
    connect: function(wireframeId, $scope) {
      firebase = new Firebase("https://shining-torch-5682.firebaseio.com/projects/" + wireframeId);
      
      //Event listener, create element any time a user adds one
      firebase.on('child_added', function(snapshot) {
        var key = snapshot.key();
        var element = snapshot.val();
        Component.create(element.type, $scope, element.style, key);
      });

      firebase.on('child_changed', function(snapshot) {
        var key = snapshot.key();
        var element = snapshot.val();
        Component.update(key, element.style);
      });

      //Event listener, update element any time a user changes it
      var selectedElement;
      $('#wireframe-board').on('mousedown', '.resize-drag', function(event) {
        selectedElement = $(this);
        $(window).on('mouseup', function() {
          var component = Component.saveComponent(selectedElement);
          var key = component.id;
          firebase.child(key).update({
            style: component.style
          });
        })
      });
    },

    createRoom: function(wireframe, $scope) {
      factory.connect(wireframe._id, $scope);
      
      //load current components to fb
      wireframe.components.forEach(function(component) {
        factory.createElement(component.style, component.type);
      });
    },

    joinRoom: function(wireframe, $scope) {
      factory.connect(wireframe._id, $scope);
      
      //load in existing firebase objects
      firebase.once('value', function(data) {
        data.components.forEach(function(component) {
          Component.create(component.type, $scope, component.style, component.id);
        })
      });
    },

    createElement: function(style, type) {
      firebase.push({
        style: style,
        type: type
      });
    },

    deleteElement: function() {

    },

    updateElement: function() {

    }


  }
  return factory;

});
