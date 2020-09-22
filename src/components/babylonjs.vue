<template>
  <div>
    <div id="container" style="width:100%;hight:100%;">
      <div id="head" style="width:100%;hight:200px;background-color:lightblue">
        {{msg}}<span>-minite:{{time}}</span>
      </div>
      <div id="left" style="background-color:blue;height:100%;width:20%;float:left;min-height:500px;">
        <input type="button" v-on:click="openFlie" value="openFlie(this)">
        <input type="file" id="files"  @change.prevent.stop="openFlie" />
        <input type="button" @click="readFile" value="read" />
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
        inputValue:"",
        fileName :"",
        scene:null,
        engine:null
    }
  },
  methods: {
    updateTime:function(){
      this.time+=1;
      clearInterval(this.timer);
      this.timer = setInterval(this.updateTime,60000);
    },
    init(){
      // get the canvas DOM element
      var canvas = document.getElementById('renderCanvas');

      // load the 3D engine
      var engine = new BABYLON.Engine(canvas, true);
      this.engine = engine;
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
      this.scene = scene;
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
      console.log("end");
    },
    loadObj(scene){//路径问题
      // BABYLON.SceneLoader.Append("/static/obj/", "a.obj", scene, function (scene) {
      //   console.log("success",scene)
      //   scene.activeCamera.alpha += Math.PI;
      //     // 模型添加成功后，执行场景对象的一些方法
      // });
      var path = "/static/obj/";
      var file = "male02.obj"
      BABYLON.SceneLoader.ImportMesh("",path, file,this.scene,function(newMeshes, particleSystems, skeletons){//weixing
        console.log("newMeshes",newMeshes)
        var one= new Array();
        var two= new Array();
        var three= new Array();

        var alpha = 0;
        // for (var j = 0; j < newMeshes.length; j++) {
        //   one[j] = newMeshes[j].position.x;
        //   two[j] = newMeshes[j].position.y;
        //   three[j] = newMeshes[j].position.z;
        // }
        // console.log("newMeshes",newMeshes)
        // scene.registerBeforeRender(function () {
        //   for (var i = 0; i < newMeshes.length-2; i++) {
        //     newMeshes[i].position.x = one[i] + 10 * Math.sin(alpha);
        //     newMeshes[i].position.y  = two[i] + 0;
        //     newMeshes[i].position.z = three[i] + 10 * Math.cos(alpha);
        //   }
        //   alpha += 0.01;
        // });
        one[1] = newMeshes[1].position.x;
        two[1] = newMeshes[1].position.y;
        three[1] = newMeshes[1].position.z;
        scene.registerBeforeRender(function () {
          newMeshes[1].position.x = one[1] + 10 * Math.sin(alpha);
          newMeshes[1].position.y  = two[1] + 0;
          newMeshes[1].position.z = three[1] + 10 * Math.cos(alpha);
          alpha += 0.01;
        });
      });
    },
    openFlie(event){//打开本地文件，返回路径
      console.log(event.target.files[0]);
      let files = event.target.files[0];

      this.fileName = this.getObjectUrl(files);
      BABYLON.SceneLoader.Load("", "a.obj",this.engine,function(newMeshes, particleSystems, skeletons){
        console.log("test123");
        // this.scene.add(newMeshes);
      });
    },
    getObjectUrl(file) {
      let url = null;
      if (window.createObjectURL != undefined) {
        url = window.createObjectURL(file);
      } else if (window.webkitURL != undefined) {
        // webkit or chrome
        url = window.webkitURL.createObjectURL(file);
      } else if (window.URL != undefined) {
        // mozilla(firefox)
        url = window.URL.createObjectURL(file);
      }
      return url;
    },
    readFile(){
      let fileselect = document.querySelector('input[type=file]').files[0];//找到文件上传的元素        
      let reader = new FileReader()
      if (typeof FileReader === 'undefined') {
          alert('您的浏览器不支持FileReader接口')
          return
      }
      reader.readAsText(fileselect, 'gb2312')//注意读取中文的是用这个编码，不是utf-8
      reader.onload = function () {
          console.log(reader.result);                
      }
    }

  },
  mounted() {
    this.msg=this.$route.params.msg||"babylon";
    this.updateTime();
    this.init();
  },
  watch:{
    inputValue(val){
      console.log("val",val);
    }
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
