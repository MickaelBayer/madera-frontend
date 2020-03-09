			import * as THREE from '../../build/three.module.js';

			import { OrbitControls } from '../jsm/controls/OrbitControls.js';

			import { TransformControls } from '../jsm/controls/TransformControls.js';
			import { TextureLoader } from '../../build/three.module.js';

			var container, stats;
			var camera, scene, renderer, control, orbit,obj;
			var objects = [];
			var arrayOfElements = [];
			var i =0;
			var y = 0;
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
				renderer.setClearColor(0xffffff);
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

				});

				scene.add(control);

				window.addEventListener( 'resize', onWindowResize, false);

				window.addEventListener( 'keydown', function (event) {

				

				} );
				document.getElementById('Wall').addEventListener("click", addWall);

				document.getElementById('mouve').addEventListener("click", mouveForm);

				document.getElementById('rotate').addEventListener("click", rotateForm);

				document.getElementById('scale').addEventListener("click", setHeigth);

				document.getElementById('Door').addEventListener("click", addDoor);

				document.getElementById('Window').addEventListener("click", addWindow);

				document.getElementById('freeMouve').addEventListener("click", freeMouve);

				document.getElementById('supress').addEventListener("click", deleteObject);

				document.getElementById('cible').addEventListener("click", cible);


				var light = new THREE.AmbientLight( 0xFFFFFF ); // soft white light
				scene.add( light );

			
			}
			function freeMouve(){
				
				control.setMode( "translate" );
				control.setTranslationSnap( null );
				control.setRotationSnap( THREE.MathUtils.degToRad( null ));
				control.setScaleSnap( null );
				
			}

			function mouveForm(){

				control.setMode( "translate" );
				control.setTranslationSnap( 100 );
				control.setRotationSnap( THREE.MathUtils.degToRad( 15 ));
				control.setScaleSnap( 0.25 );


			}

			function rotateForm(){

				control.setMode( "rotate" );

			}

			function setHeigth(){

				control.setMode("scale");

			}
			function cible(){

				 var  i;
				 i =scene.children.length-1;
				
				 if(y < i-2)
				 y = y + 1;
				 else
				 y = 1;
				 
				 obj = scene.children [i-y];
				 
				 if(obj.is_ob){
					control.attach(obj);
				 }
			}

			function deleteObject(){
					if(obj.is_ob){

						control.detach();
						
						obj.material=undefined;
						obj.geometry=undefined;

						scene.remove(obj);
					}
				
				render();
			}
		
			
			function addWall() {
			
				
				var wallSize = document.getElementById("wallSize");
				var wallTexture = document.getElementById("wallTexture");
				var WallSizeSelect = wallSize.options[wallSize.selectedIndex].value;
				var WallTextureSelect = wallTexture.options[wallTexture.selectedIndex].value;

				var geometry = new THREE.BoxBufferGeometry( WallSizeSelect, 100, 100 );
				var material = new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load(WallTextureSelect)});
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
				obj= cube;
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

			function addDoor(){

				var doorTexture = document.getElementById("doorTexture");
				var doorTextureSelected =  parseInt(doorTexture.options[doorTexture.selectedIndex].value);
			
				switch(doorTextureSelected){
					case 1: 
					var geometry = new THREE.BoxBufferGeometry( 200, 300, 100 );
					var material = new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load("https://www.jaimemonartisan.com/uploads/images/belm/3-belm-porte-dentree-bois-denia-default.jpg?v1.3.6") });
					var cube = new THREE.Mesh(geometry, material);
	
					cube.position.set(0, 100, 0);
				
					cube.name = 'doorEntrance ' + i++;
					cube.is_ob = true;
					scene.add(cube);
					objects.push(cube); 
				
					control.attach(cube);
					scene.add(control);
	
					control.setTranslationSnap( 100 );
					control.setRotationSnap( THREE.MathUtils.degToRad( 15 ));
					control.setScaleSnap( 0.25 );

					obj= cube;

					render();
					break;
					case 2: 
				
					var geometry = new THREE.BoxBufferGeometry( 400, 300, 100 );
					var material = new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load("https://www.halloin.com/images-portes/LI-NL/7023.png") });
					var cube = new THREE.Mesh(geometry, material);
	
					cube.position.set(0, 100, 0);
				
					cube.name = 'garage ' + i++;
					cube.is_ob = true;
					scene.add(cube);
					objects.push(cube); 
				
					control.attach(cube);
					scene.add(control);
	
					control.setTranslationSnap( 100 );
					control.setRotationSnap( THREE.MathUtils.degToRad( 15 ));
					control.setScaleSnap( 0.25 );

					obj= cube;

					render();
					break;
					case 3: 
				
					var geometry = new THREE.BoxBufferGeometry( 200, 300, 100 );
					var material = new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load("https://lh3.googleusercontent.com/proxy/bhJCf46uJuPnorc0DVDS37PPskkPQyhQdS2fqE0PJlStI0gIlHA98bE1FMILerhsIpd-MrjjOroLzzytAkDoV2H47mQjSzRkN7zMznqoiQWRrCowQpC3RVJR9OKrkMWxZEuF48vPYg5iMJm4OYoX6Q") });
					var cube = new THREE.Mesh(geometry, material);
	
					cube.position.set(0, 100, 0);
				
					cube.name = 'coulissante ' + i++;
					cube.is_ob = true;
					scene.add(cube);
					objects.push(cube); 
				
					control.attach(cube);
					scene.add(control);
	
					control.setTranslationSnap( 100 );
					control.setRotationSnap( THREE.MathUtils.degToRad( 15 ));
					control.setScaleSnap( 0.25 );

					obj= cube;

					render();
					break;
					case 4: 
					var geometry = new THREE.BoxBufferGeometry( 200, 300, 100 );
					var material = new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load("data:image/jpeg;base64,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") });
					var cube = new THREE.Mesh(geometry, material);
	
					cube.position.set(0, 100, 0);
				
					cube.name = 'simpleDoor ' + i++;
					cube.is_ob = true;
					scene.add(cube);
					objects.push(cube); 
				
					control.attach(cube);
					scene.add(control);

					control.setTranslationSnap( 100 );
					control.setRotationSnap(THREE.MathUtils.degToRad( 15 ));
					control.setScaleSnap( 0.25 );

					obj= cube;

					break;
				}
			}


			function addWindow(){
				var geometry = new THREE.BoxBufferGeometry( 200, 200, 25 );
				var material = new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load("https://img2.freepng.fr/20180423/bqe/kisspng-casement-window-door-window-shutter-glazing-shutter-doors-5ade5f0858c365.3041406315245227603636.jpg") });
				var cube = new THREE.Mesh(geometry, material);

				cube.position.set(0, 100, 0);
			
				cube.name = 'window ' + i++;
				cube.is_ob = true;
				scene.add(cube);
				objects.push(cube); 
			
				control.attach(cube);
				scene.add(control);

				control.setTranslationSnap( 100 );
				control.setRotationSnap( THREE.MathUtils.degToRad( 15 ));
				control.setScaleSnap( 0.25 );

				obj= cube;

				render();
			}
			
			function setSpotLight(){
				var spotLight = new THREE.SpotLight( 0xffffff );
				spotLight.position.set( 1000, 1000, 1000 );
				
				spotLight.castShadow = true;
				
				spotLight.shadow.mapSize.width = 1024;
				spotLight.shadow.mapSize.height = 1024;
				
				spotLight.shadow.camera.near = 500;
				spotLight.shadow.camera.far = 4000;
				spotLight.shadow.camera.fov = 30;
				
				scene.add(spotLight);
			}
	
			
			