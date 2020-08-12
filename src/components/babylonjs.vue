<template>
  <div>
    <div id="container" style="width:100%;hight:100%;">
      <div id="head" style="width:100%;hight:200px;background-color:lightblue">
        {{msg}}<span>-minite:{{time}}</span>
      </div>
      <div id="left" style="background-color:blue;height:100%;width:20%;float:left;min-height:500px;">
        <input type="button" v-on:click="openFlie" value="openFlie">
      </div>
      <div id="right" style="background-color:#FFFF00;float:right;height:100%;width:80%;min-height:500px;">
        <canvas id="renderCanvas"></canvas>
      </div>
    </div>
  </div>
</template>
<script>

import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders';

export default {
  name: 'babylonjs',
  data () {
    return {
        timer:null,
        time:-1,
        msg:"",
    }
  },
  methods: {
    updateTime:function(){
      this.time+=1;
      clearInterval(this.timer);
      this.timer = setInterval(this.updateTime,60000);
    },
    init(){
      // window.addEventListener('DOMContentLoaded', function(){
        console.log("DOMContentLoaded");
				// get the canvas DOM element
				var canvas = document.getElementById('renderCanvas');

				// load the 3D engine
				var engine = new BABYLON.Engine(canvas, true);

				// createScene function that creates and return the scene
				var createScene = function(){
					// create a basic BJS Scene object
					var scene = new BABYLON.Scene(engine);

					// create a FreeCamera, and set its position to (x:0, y:5, z:-10)
					var camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5,-10), scene);

					// target the camera to scene origin
					camera.setTarget(BABYLON.Vector3.Zero());

					// attach the camera to the canvas
					camera.attachControl(canvas, false);

					// create a basic light, aiming 0,1,0 - meaning, to the sky
					var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0,1,0), scene);

					// create a built-in "sphere" shape; its constructor takes 6 params: name, segment, diameter, scene, updatable, sideOrientation 
					// var sphere = BABYLON.Mesh.CreateSphere('sphere1', 16, 2, scene);

					// // move the sphere upward 1/2 of its height
					// sphere.position.y = 1;

					// // create a built-in "ground" shape;
					// var ground = BABYLON.Mesh.CreateGround('ground1', 6, 6, 2, scene);

					// return the created scene
					return scene;
				}

				// call the createScene function
				var scene = createScene();
        scene.createDefaultCameraOrLight(true, true, true);
        //"/static/obj/"
        // BABYLON.SceneLoader.Append("/static/obj/", "a.obj", scene, function (scene) {
        //   console.log("success",scene)
        //   // scene.createDefaultCameraOrLight(true, true, true);
        //   scene.activeCamera.alpha += Math.PI*2;
        //     // 模型添加成功后，执行场景对象的一些方法
        // });

        this.loadObj(scene);
				// run the render loop
				engine.runRenderLoop(function(){
					scene.render();
				});
				// the canvas/window resize event handler
				window.addEventListener('resize', function(){
          console.log("resize");
					engine.resize();
				});
      // });
      console.log("end");
    },
    loadObj(scene){//路径问题
      BABYLON.SceneLoader.Append("/static/obj/", "a.obj", scene, function (scene) {
        console.log("success",scene)
        // scene.createDefaultCameraOrLight(true, true, true);
        scene.activeCamera.alpha += Math.PI;
          // 模型添加成功后，执行场景对象的一些方法
      });
    },
    openFlie(){//打开本地文件，返回路径
      console.log("1234")
    }
  },
  mounted() {
    this.msg=this.$route.params.msg;
    this.updateTime();
    this.init();
  }
}
</script>
<style scoped>
  html, body {
    overflow: hidden;
    width   : 100%;
    height  : 100%;
    margin  : 0;
    padding : 0;
  }

  #renderCanvas {
    width   : 100%;
    height  : 100%;
    touch-action: none;
  }
</style>
