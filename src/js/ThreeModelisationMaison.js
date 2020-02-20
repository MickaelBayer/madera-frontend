			import * as THREE from '../../build/three.module.js';

			import { OrbitControls } from '../jsm/controls/OrbitControls.js';

			import { TransformControls } from '../jsm/controls/TransformControls.js';

			var container, stats;
			var camera, scene, renderer, control, orbit;
			var objects = [];
			var arrayOfElements = [];
			var i =0;
            
            window.onload=onload;

            function onload() {
				init();
			
                render();
                }

			function init() {


				container = document.getElementById('container');
                renderer = new THREE.WebGLRenderer();
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				container.appendChild( renderer.domElement );

				camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 3000 );
				camera.position.set( 1000, 500, 1000 );
				camera.lookAt( 0, 200, 0 );

				scene = new THREE.Scene();
				scene.add( new THREE.GridHelper( 1000, 10 ) );


				orbit = new OrbitControls( camera, renderer.domElement );
				orbit.update();
				orbit.addEventListener( 'change', render );

				control = new TransformControls( camera, renderer.domElement );
				control.addEventListener( 'change', render );

				control.addEventListener( 'dragging-changed', function ( event ) {

					orbit.enabled = ! event.value;

				} );


				
				scene.add( control );

				window.addEventListener( 'resize', onWindowResize, false );

				window.addEventListener( 'keydown', function ( event ) {

					switch ( event.keyCode ) {

						case 81: // Q
							control.setSpace( control.space === "local" ? "world" : "local" );
							break;

						case 16: // Shift
							control.setTranslationSnap( 100 );
							control.setRotationSnap( THREE.MathUtils.degToRad( 15 ) );
							control.setScaleSnap( 0.25 );
							break;


						case 87: // W
							control.setMode( "translate" );
							break;

						case 69: // E
							control.setMode( "rotate" );
							break;

						case 82: // R
							control.setMode( "scale" );
							break;

							case 46:
							var i;
							arrayOfElements.forEach(elements =>  i = elements.name);
							var selectedObject = scene.getObjectByName(i);
							
							selectedObject.remove();

							break;
					}
				} );

				window.addEventListener( 'keyup', function ( event ) {

					switch ( event.keyCode ) {

						case 17: // Ctrl
							control.setTranslationSnap( null );
							control.setRotationSnap( null );
							control.setScaleSnap( null );
							break;

					}

				} );
				document.getElementById('Wall').addEventListener("click", addCube);
			
				
			 
			
				
			}



		
			
			function addCube() {
				
				var texture = new THREE.TextureLoader().load( '../ressources/bois.jpg' );

				// immediately use the texture for material creation
				var material = new THREE.MeshBasicMaterial( { map: texture } )
				var geometry = new THREE.BoxBufferGeometry( 100, 300, 500 );
				var material = new THREE.MeshBasicMaterial( { color: 0xfffff,  transparent: false } );
				var mesh = new THREE.Mesh( geometry, material );
				mesh.name = 'wall ' + i++;
				scene.add( mesh );
				

				control.attach( mesh );
				scene.add( control );
		
				arrayOfElements.push(mesh);
				
			 }

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

				render();

			}

			function render() {

				renderer.render( scene, camera );

			}
			
			
	
			
			