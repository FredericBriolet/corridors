// @see http://paulirish.com/2011/requestanimationframe-for-smart-animating/
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          window.oRequestAnimationFrame      ||
          window.msRequestAnimationFrame     ||
          function(/* function */ callback, /* DOMElement */ element){
            window.setTimeout(callback, 1000 / 60);
          };
})();

/**
 * Three.js Tutorial Samples
 *
 * @author Paul Lewis
 */
var THREETUT = THREETUT || {};
THREETUT.Shaders = {
	Pink: {
		'vertex': ["void main() {",
				    "gl_Position = projectionMatrix *",
				                  "modelViewMatrix *",
				                  "vec4(position,1.0);",
				   "}"].join("\n"),

		'fragment': ["void main() {",
		             "gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);",
				   "}"].join("\n")
	},
	Lit: {
		'vertex': ["varying vec3 vNormal;",
		            "void main() {",
		            "vNormal = normal;",
				    "gl_Position = projectionMatrix *",
				                  "modelViewMatrix *",
				                  "vec4(position,1.0);",
				   "}"].join("\n"),

		'fragment': ["varying vec3 vNormal;",
		             "void main() {",
		             "vec3 light = vec3(0.5,0.2,1.0);",
		             "light = normalize(light);",
		             "float dProd = max(0.0, dot(vNormal, light));",
		             "gl_FragColor = vec4(dProd, dProd, dProd, 1.0);",
				   "}"].join("\n")
	},
	LitAttribute: {
		'vertex': ["attribute float displacement;",
		           "varying vec3 vNormal;",
		            "void main() {",
		            "vNormal = normal;",
		            "vec3 newPosition = position + normal * vec3(displacement);",
				    "gl_Position = projectionMatrix *",
				                  "modelViewMatrix *",
				                  "vec4(newPosition,1.0);",
				   "}"].join("\n"),

		'fragment': ["varying vec3 vNormal;",
		             "void main() {",
		             "vec3 light = vec3(0.5,0.2,1.0);",
		             "light = normalize(light);",
		             "float dProd = max(0.0, dot(vNormal, light));",
		             "gl_FragColor = vec4(dProd, dProd, dProd, 0.0);",
				   "}"].join("\n")
	},
	LitAttributeAnimated: {
		'vertex': ["uniform float amplitude;",
		           "attribute float displacement;",
		           "varying vec3 vNormal;",
		            "void main() {",
		            "vNormal = normal;",
		            "vec3 newPosition = position + normal * vec3(displacement * amplitude);",
				    "gl_Position = projectionMatrix *",
				                  "modelViewMatrix *",
				                  "vec4(newPosition,1.0);",
				   "}"].join("\n"),

		'fragment': ["varying vec3 vNormal;",
		             "void main() {",
		             "vec3 light = vec3(0.5,0.2,100.0);",
		             "light = normalize(light);",
		             "float dProd = max(0.0, dot(vNormal, light));",
		             "gl_FragColor = vec4(dProd, dProd, dProd, 0.2);",
				   "}"].join("\n")
	}
};
THREETUT.Samples = new function()
{
	// set the scene size for
	// all of the samples
	var WIDTH = window.innerWidth,
	    HEIGHT = window.innerHeight;

	// set some camera attributes
	// for all samples
	var VIEW_ANGLE = 45,
	    ASPECT = WIDTH / HEIGHT,
	    NEAR = 0.1,
	    FAR = 10000;

	this.createSample = function(elID, shaderMaterialRef, attributes, uniforms) {

		var setup 		= setupScene(),
		$container 		= $(elID);

		// attach the render-supplied DOM element
		$container.append(setup.renderer.domElement);

		var shaderMaterial = new THREE.MeshShaderMaterial({
			attributes: 	attributes,
			uniforms:		uniforms,
			vertexShader:   shaderMaterialRef.vertex,
		    fragmentShader: shaderMaterialRef.fragment
		});

		// now create a sphere
		sphere = new THREE.Mesh(new THREE.Sphere(3,120,20), shaderMaterial);

    setup.scene.addChild(sphere);

    sphere2 = new THREE.Mesh(new THREE.Sphere(10,400,100), shaderMaterial);

		setup.scene.addChild(sphere2);
		setup.renderer.render(setup.scene, setup.camera);

		return setup;
	};

	function setupScene() {

		// set up the rendere and camera
		var renderer = new THREE.WebGLRenderer();
		var camera = new THREE.Camera(  VIEW_ANGLE,
		                                ASPECT,
		                                NEAR,
		                                FAR  );

		var scene = new THREE.Scene();

		// the camera starts at 0,0,0 so pull it back
		camera.position.z = 300;

		// start the renderer - set the clear colour
		// to a random
    var a = Math.random(255);
		//renderer.setClearColor( new THREE.Color("rgb("+Math.random(255)+","+Math.random(255)+","+Math.random(255)+")") );
    renderer.setClearColor( new THREE.Color(0) );
		renderer.setSize(WIDTH, HEIGHT);

		return {
			camera: camera,
			scene: scene,
			renderer: renderer
		};
	}
};

// Samples
$(document).ready(function(){

	// our spheres have 242 verts
	var vertCount = 242;

	if($("#sample-1").length) {
		THREETUT.Samples.createSample("#sample-1", THREETUT.Shaders.Pink, {}, {});
	}

	if($("#sample-2").length) {
		THREETUT.Samples.createSample("#sample-2", THREETUT.Shaders.Lit, {}, {});
	}

	if($("#sample-3").length) {
		THREETUT.Samples.createSample("#sample-3", THREETUT.Shaders.LitAttribute, {}, {});
	}

	if($("#sample-4").length) {

		// Sample 4
		var attributesS4 = {
		    displacement: {
		        type: 'f', // a float
		        value: [] // an empty array
		    }
		};

		// now populate the array of attributes
		var valuesS4 = attributesS4.displacement.value;
		for(var v = 0; v < vertCount; v++) {
		    valuesS4.push(Math.random() * 30);
		}

		THREETUT.Samples.createSample("#sample-4", THREETUT.Shaders.LitAttribute, attributesS4, {});
	}

	if($("#sample-5").length) {
		// Sample 5
		var attributesS5 = {
		    displacement: {
		        type: 'f', // a float
		        value: [] // an empty array
		    }
		};

		// now populate the array of attributes
		var valuesS5 = attributesS5.displacement.value;
		for(var v = 0; v < vertCount; v++) {
			valuesS5.push(Math.random() * 30);
		}

		THREETUT.Samples.createSample("#sample-5", THREETUT.Shaders.LitAttributeAnimated, attributesS5, {});
	}

	if($("#sample-6").length) {

		var attributesS6 = {
			    displacement: {
			        type: 'f', // a float
			        value: [] // an empty array
			    }
			};

		// now populate the array of attributes
		var valuesS6 = attributesS6.displacement.value;
		for(var v = 0; v < vertCount; v++) {
			valuesS6.push(Math.random() * -100);
		}

		var uniformsS6 = {
			amplitude: {
				type: 'f', // a float
				value: 0
			}
		};

		// get the returned setup
		var setup = THREETUT.Samples.createSample("#sample-6", THREETUT.Shaders.LitAttributeAnimated, attributesS6, uniformsS6);

		// create an anim loop for it
		var frame = 0.25;
		function update() {

		    // update the amplitude based on
		    // the frame value
		    uniformsS6.amplitude.value = -frame;
		    frame += 0.001;
        //sphere.scale.z += 0.0001;
        sphere.scale.y += 0.0001;
        sphere.position.z -= 0.1;
        //sphere.scale.x += 0.0001;

        sphere.material

		    setup.renderer.render(setup.scene, setup.camera);

		    // set up the next call
		    requestAnimFrame(update);
		}
		requestAnimFrame(update);
	}
});
