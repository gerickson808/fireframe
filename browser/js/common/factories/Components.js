app.factory('Component', function($compile, CSS) {
	var styles = ['width', 'height', 'z-index', 'opacity', 'border-width', 'border-style', 'border-color', 'background-color', 'z-index'];
	var datatypes = ['textContents'];

	var factory = {
		create: function(type, $scope, style, id, dataset) {
			var newElement;
			switch(type) {
				case 'base-layer':
					newElement = $compile('<base-layer id="' + id + '" ng-click="makeActive($event)" class="resize-drag"></base-layer>')($scope);
					break;
				case 'circle':
					newElement = $compile('<circle id="' + id + '" ng-click="makeActive($event)" class="resize-drag"></circle>')($scope);
					break;
				case 'box':
					newElement = $compile('<box id="' + id + '" ng-click="makeActive($event)" class="resize-drag"></box>')($scope);
					break;
				case 'text-box':
					newElement = $compile('<text-box id="' + id + '" ng-click="makeActive($event)" class="resize-drag"></text-box>')($scope);
					break;
				case 'image-box':
					newElement = $compile('<image-box id="' + id + '" ng-click="makeActive($event)" class="resize-drag"></image-box>')($scope);
					break;
				case 'list':
					newElement = $compile('<list id="' + id + '" ng-click="makeActive($event)" class="resize-drag"></list>')($scope);
					break;
				case 'table-component':
					newElement = $compile('<table-component id="' + id + '" ng-click="makeActive($event)" class="resize-drag"></table-component>')($scope);
					break;
				case 'button-component':
					newElement = $compile('<button-component id="' + id + '" ng-click="makeActive($event)" class="resize-drag"></button-component>')($scope);
					break;
			}

			CSS.addStyles(newElement, style);
			newElement[0].setAttribute('data-textContents',dataset.textContents);
  		$scope.board.append(newElement);
		},

		update: function(id, style, dataset) {
			var element = $('#'+id);
			CSS.addStyles(element, style);
			CSS.removeTransform(element, style);

			for(var key in dataset){
				element[0].setAttribute('data-'+key, dataset[key]);
			}
			console.log("finalleee ",element);

		},

		deleteComponent: function(id) {
			$('#'+id).remove();
		},

		saveComponents: function() {
			var components = [];
			$('#wireframe-board').children().each(function() {
				var element = $(this);
				components.push(factory.saveComponent(element))
			});
			
			//need send this array of components back to server (through wireframe factory?)
			return components;
		},

		saveComponent: function(element) {
			var component = {};
			component.type = element.prop('tagName').toLowerCase();
			component.style = {};
			component.dataset = {};
			component.id = element.attr('id');
			//component.style = CSS.extractStyles(element);

			//STILL NEED TO SCALE WIDTH AND POSITION BASED ON CURRENT ZOOM

			styles.forEach(function(style) {
				if (element.css(style)) {
					component.style[style] = element.css(style);
				}
			});

			datatypes.forEach(function(datatype) {
				if(element[0].getAttribute('data-'+datatype)){
					component.dataset[datatype] = element[0].getAttribute('data-'+datatype);
				}
			});

			component.style.left = element.position().left;
			component.style.top = element.position().top;

			return component;
		},

		load: function(components, $scope) {
			if (components) {
				components.forEach(function(component) {
					factory.create(component.type, $scope, component.style);
				});
			}
		}
	}

	return factory;
});