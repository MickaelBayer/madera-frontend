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

				

				} );
				document.getElementById('Wall').addEventListener("click", addWall);

				document.getElementById('mouve').addEventListener("click", mouveForm);

				document.getElementById('rotate').addEventListener("click", rotateForm);

				document.getElementById('scale').addEventListener("click", setHeigth);

				document.getElementById('Door').addEventListener("click", addDoor);

				document.getElementById('Window').addEventListener("click", addWindow);

				document.getElementById('freeMouve').addEventListener("click", freeMouve);

				var light = new THREE.AmbientLight( 0xFFFFFF ); // soft white light
				scene.add( light );

			
			}
			function freeMouve(){
				control.setTranslationSnap( null );
				control.setRotationSnap( THREE.MathUtils.degToRad( null ));
				control.setScaleSnap( null );
				
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
		
			
			function addWall() {
			
				
				var wallSize = document.getElementById("wallSize");
				var wallTexture = document.getElementById("wallTexture");
				var WallSizeSelect = wallSize.options[wallSize.selectedIndex].value;
				var WallTextureSelect = wallTexture.options[wallTexture.selectedIndex].value;

				alert(WallSizeSelect);
				alert(WallTextureSelect);
				var geometry = new THREE.BoxBufferGeometry( WallSizeSelect, 100, 100 );
				var material = new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load(WallTextureSelect) });
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

			function addDoor(){

				var doorTexture = document.getElementById("doorTexture");
				var doorTextureSelected =  parseInt(doorTexture.options[doorTexture.selectedIndex].value);
				alert("door?");
				alert(doorTextureSelected);
				switch(doorTextureSelected){
					case 1: 
					alert("Porte Entrée");
					var geometry = new THREE.BoxBufferGeometry( 200, 300, 25 );
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
	
					render();

					break;
					case 2: 
					alert("Porte Garage");
				
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
	
					render();


					break;
					case 3: 
					alert("Porte coulissante");
				
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
	
					render();
					break;
					case 4: 
					alert("Porte intérieur simple");
					
					setSpotLight();
					var geometry = new THREE.BoxBufferGeometry( 200, 300, 100 );
					var material = new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load("https://lh3.googleusercontent.com/proxy/-WCn0AJTYZnVi8JXB2dXMm3-u0TV2OkyEBT3SL46OyzNsw7phPYVLbr-GTzJNDpN4axY6j5AFcU2WTlBF5paBKB_cOm5psgXcm9f5ee19dwXiVXxUl3rEerHsfbyikmorCliYz1yCXCl0mFmlmv0phGB") });
					var cube = new THREE.Mesh(geometry, material);
	
					cube.position.set(0, 100, 0);
				
					cube.name = 'simpleDoor ' + i++;
					cube.is_ob = true;
					scene.add(cube);
					objects.push(cube); 
				
					control.attach(cube);
					scene.add(control);

					control.setTranslationSnap( 100 );
					control.setRotationSnap( THREE.MathUtils.degToRad( 15 ));
					control.setScaleSnap( 0.25 );
	
					break;

				}
			}


			function addWindow(){
				alert("Window");
				var geometry = new THREE.BoxBufferGeometry( 200, 200, 25 );
				var material = new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load("https://lh3.googleusercontent.com/proxy/iv0J9yGH-2JxgjLs94WEAWLAz2EpfWgVJDNiXr4r3JhMcx8RqexScvu-yuCYly_eHckRh-CUIy917ojV70d3rWNwzTOdmbpSj7CshRJtfSpsnN4zb99nEdMYakqqWrrNb5PqGcHs1BAdc7AaTvOtBCQPomnpANwW-g") });
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
				
				scene.add( spotLight );

			}
	
			
			