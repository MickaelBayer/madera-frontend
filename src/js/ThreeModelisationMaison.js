			import * as THREE from '../../build/three.module.js';

			import { OrbitControls } from '../jsm/controls/OrbitControls.js';

			import { TransformControls } from '../jsm/controls/TransformControls.js';
import { TextureLoader } from '../../build/three.module.js';

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


				orbit = new OrbitControls(camera, renderer.domElement);
				orbit.update();
				orbit.addEventListener('change', render);

				control = new TransformControls(camera, renderer.domElement);
				control.addEventListener( 'change', render);

				control.addEventListener( 'dragging-changed', function (event) {

					orbit.enabled = ! event.value;

				} );

				scene.add(control);

				window.addEventListener( 'resize', onWindowResize, false);

				window.addEventListener( 'keydown', function (event) {

					switch (event.keyCode) {

						case 81: // Q
							control.setSpace( control.space === "local" ? "world" : "local" );
							break;

						case 16: // Shift
							control.setTranslationSnap( 100 );
							control.setRotationSnap( THREE.MathUtils.degToRad(15) );
							control.setScaleSnap( 0.25 );
							break;


						case 87: // W
							control.setMode("translate");
							break;

						case 69: // E
							control.setMode("rotate");
							break;

						case 82: // R
							control.setMode("scale");
							break;

							case 46:
							var i;
							arrayOfElements.forEach(elements =>  i = elements.name);
							alert(selectedObject.name);
							var selectedObject = scene.getObjectByName(i);
							scene.dispose(selectedObject);
							deleteObject(selectedObject);
						
							
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

				document.getElementById('mouve').addEventListener("click", mouveForm);

				document.getElementById('rotate').addEventListener("click", rotateForm);

				document.getElementById('scale').addEventListener("click", setHeigth);

			}
			function mouveForm(){

				control.setMode( "translate" );

			}

			function rotateForm(){

				control.setMode( "rotate" );

			}

			function setHeigth(){

				control.setMode("scale");

			}

			function deleteObject(objname){
				var obj, i;
				for(i = scene.children.length - 1; i >= 0 ; i--){
					obj = scene.children [i];
					if(obj.is_ob){
						scene.remove(obj);
					}
				}
				render();
			}
		
			
			function addCube() {
			
				var spotLight = new THREE.SpotLight( 0xffffff );
				spotLight.position.set( 1000, 1000, 1000 );
				
				spotLight.castShadow = true;
				
				spotLight.shadow.mapSize.width = 1024;
				spotLight.shadow.mapSize.height = 1024;
				
				spotLight.shadow.camera.near = 500;
				spotLight.shadow.camera.far = 4000;
				spotLight.shadow.camera.fov = 30;
				
				scene.add( spotLight );

				var geometry = new THREE.BoxBufferGeometry( 100, 100, 100 );
				var material = new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load("https://cdn.shoplightspeed.com/shops/606169/files/14835684/le-marche-du-bois-k-le-planche-murale-autocollante.jpg") });
				var cube = new THREE.Mesh(geometry, material);

				cube.position.set(0, 100, 0);
			
				cube.name = 'wall ' + i++;
				cube.is_ob = true;
				scene.add(cube);
				objects.push(cube); 
			
				control.attach(cube);
				scene.add(control);

				control.setTranslationSnap( 100 );
				control.setRotationSnap( THREE.MathUtils.degToRad( 15 ));
				control.setScaleSnap( 0.25 );

				render();
				
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
			
			
	
			
			