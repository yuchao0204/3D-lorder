<template>
  <div>
    <div id="container" style="width:100%;hight:100%;">
      <div id="head" style="width:100%;hight:200px;background-color:lightblue">
        {{msg}}<span>-minite:{{time}}</span>
      </div>
      <div id="left" style="background-color:blue;height:100%;width:20%;float:left;min-height:500px;">
      </div>
      <div id="right1" style="background-color:#FFFF00;float:right;height:100%;width:80%;min-height:500px;">
        <canvas id="renderCanvas"></canvas>
      </div>
      <div id="right2" style="background-color:#FFFF00;float:right;height:100%;width:80%;min-height:500px;">
        <canvas id="renderCanvas2"></canvas>
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
      var canvas = document.getElementById('renderCanvas');
      var engine = new BABYLON.Engine(canvas, true);
      // 创建一个新的引擎

      var scene = function(){
        var scene = new BABYLON.Scene(engine)
        var light=new BABYLON.DirectionalLight('light',new BABYLON.Vector3(0,-10,0),scene)
        var camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(0, 20, -50), scene);
        camera.attachControl(canvas, true);
        // Material
        var matPlan = new BABYLON.StandardMaterial("matPlan1", scene);
        matPlan.backFaceCulling = false;
        matPlan.emissiveColor = new BABYLON.Color3(0.2, 1, 0.2);

        var matBB = new BABYLON.StandardMaterial("matBB", scene);
        matBB.emissiveColor = new BABYLON.Color3(1, 1, 1);
        matBB.wireframe = true;
        // 碰撞点
        var pointToIntersect = new BABYLON.Vector3(-30, 0, 0);
        var origin = BABYLON.Mesh.CreateSphere("origin", 4, 0.3, scene);
        origin.position = pointToIntersect;
        origin.material = matPlan;
        // 板子碰撞
        var plan1 = BABYLON.Mesh.CreatePlane("plane1", 20, scene);
        plan1.position = new BABYLON.Vector3(13, 0, 0);
        plan1.rotation.x = -Math.PI / 4;
        plan1.material = matPlan;

        var plan2 = BABYLON.Mesh.CreatePlane("plane2", 20, scene);
        plan2.position = new BABYLON.Vector3(-13, 0, 0);
        plan2.rotation.x = -Math.PI / 4;
        plan2.material = matPlan;
        //OBB碰撞模式
        var planOBB = BABYLON.Mesh.CreateBox("OBB", 20, scene);
        planOBB.scaling = new BABYLON.Vector3(1, 1, 0.05);
        // 关键是这个scaling决定的，他变形成了外面检测碰撞的东西
        planOBB.parent = plan2;
        planOBB.material = matBB;
        //aabb类型
        var planAABB = BABYLON.Mesh.CreateBox("AABB", 20, scene);
        planAABB.material = matBB;
        planAABB.position = new BABYLON.Vector3(13, 0, 0);
        planAABB.scaling = new BABYLON.Vector3(1, Math.cos(Math.PI / 4), Math.cos(Math.PI / 4));
        // 前来碰撞的点
        var balloon1 = BABYLON.Mesh.CreateSphere("balloon1", 10, 2.0, scene)
        balloon1.material = new BABYLON.StandardMaterial("matBallon", scene)
        balloon1.position = new BABYLON.Vector3(6, 5, 0)
        // 前来碰撞的点2
        var balloon2= BABYLON.Mesh.CreateSphere('balloon2',10,2,scene)
        balloon2.material=new BABYLON.StandardMaterial('matBallon',scene)
        balloon2.position=new BABYLON.Vector3(-6,5,0)
        // 前来碰撞的点3
        var balloon3= BABYLON.Mesh.CreateSphere('balloon3',10,2.0,scene)
        balloon3.material=new BABYLON.StandardMaterial('matBallon',scene)
        balloon3.position=new BABYLON.Vector3(-30,5,0)
    
        var ground = BABYLON.Mesh.CreatePlane("ground", 50.0, scene);
        ground.position = new BABYLON.Vector3(5, -10, -15);
        ground.rotation = new BABYLON.Vector3(Math.PI / 2, 0, 0)

        var alpha=Math.PI
        scene.registerBeforeRender(()=>{
          // 检测第一个是否有了碰撞
          if(balloon1.intersectsMesh(plan1,false)){
            // 开启粗糙检测
            balloon1.material.emissiveColor=new BABYLON.Color3(1,0,0)
          }else{
            balloon1.material.emissiveColor=new BABYLON.Color3(1,1,1)
          }

          // 检测第二个球是否有了碰撞
          if(balloon2.intersectsMesh(plan2,true)){
            balloon2.material.emissiveColor=new BABYLON.Color3(1,0,0)
          }else{
            balloon2.material.emissiveColor=new BABYLON.Color3(1,1,1)
          }

          if(balloon3.intersectsPoint(pointToIntersect)){
            balloon3.material.emissiveColor=new BABYLON.Color3(1,0,0)
          }else{
            balloon3.material.emissiveColor=new BABYLON.Color3(1,1,1)
          }
          alpha += 0.01;
          balloon1.position.y += Math.cos(alpha) / 10;
          balloon2.position.y=balloon1.position.y
          balloon3.position.y=balloon1.position.y
        })
        return scene;
      }()
      scene.createDefaultCameraOrLight(true, true, true);
      // 引擎调用渲染函数
      engine.runRenderLoop(function() {
          scene.render();
          // 让场景开始渲染
      });
    },
    init2(){
      var canvas2 = document.getElementById('renderCanvas2');
      var engine2 = new BABYLON.Engine(canvas2, true);
      var scene = function(){
        var scene = new BABYLON.Scene(engine2)
        scene.gravity=new BABYLON.Vector3(0,-9.81,0)
        scene.collisionsEnabled=true
        // 开启碰撞检测
        var light=new BABYLON.DirectionalLight('light',new BABYLON.Vector3(0,-10,0),scene)

        var camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(0, 20, -50), scene);
        camera.attachControl(canvas2, true);
        camera.applyGravity=true
        camera.ellipsoid=new BABYLON.Vector3(0.5,1,0.5)
        camera.checkCollisions=true
        // 摄像机开始检测

        var box = BABYLON.Mesh.CreateBox("crate", 2, scene);
        box.material = new BABYLON.StandardMaterial("Mat", scene);
        box.position = new BABYLON.Vector3(5, -9, -10);
        box.checkCollisions=false
        var speed=10
        var gravity=0.15//竖直移动
        
        box.ellipsoid=new BABYLON.Vector3(0.5,1.0,0.5)
        box.ellipsoidOffset=new BABYLON.Vector3(0,1.0,0)
        var forwards = new BABYLON.Vector3(parseFloat(Math.sin(box.rotation.y)) / speed, 0, parseFloat(Math.cos(box.rotation.y)) / speed);
        var backwards = new BABYLON.Vector3(parseFloat(Math.sin(box.rotation.y)) / speed, 0, -parseFloat(Math.cos(box.rotation.y)) / speed);
        var left = new BABYLON.Vector3(parseFloat(Math.cos(box.rotation.y)) / speed, 0, -parseFloat(Math.sin(box.rotation.y)) / speed);
        var right = new BABYLON.Vector3(-parseFloat(Math.cos(box.rotation.y)) / speed, 0, parseFloat(Math.sin(box.rotation.y)) / speed);
        forwards.negate()
        // 进行物体移动并探测是否有碰撞

        document.onkeydown = (e)=>{
          var keyCode = e.keyCode ? e.keyCode : e.which;
          // 控制相机
          // console.log("keyCode",keyCode)
          if (keyCode == 87) {//w
              box.moveWithCollisions(backwards)
          }
          if(keyCode==83){//s
              box.moveWithCollisions(forwards) 
          }
          if(keyCode==65){//a
            box.moveWithCollisions(left)
          }
          if(keyCode==68){//d
            box.moveWithCollisions(right)
          }
        }
        var ground = BABYLON.Mesh.CreatePlane("ground", 50.0, scene);
        ground.position = new BABYLON.Vector3(5, -10, -15);
        ground.rotation = new BABYLON.Vector3(Math.PI / 2, 0, 0)

        ground.material = new BABYLON.StandardMaterial("groundMat", scene);
        ground.material.diffuseColor = new BABYLON.Color3(1, 1, 1);
        ground.checkCollisions=true
        // 地面添加相机碰撞
        return scene;
      }()
      scene.createDefaultCameraOrLight(true, true, true);
      // 引擎调用渲染函数
      engine2.runRenderLoop(function() {
          scene.render();
          // 让场景开始渲染
      });
    }
  },
  mounted() {
    this.msg=this.$route.params.msg||"collisions";
    this.updateTime();
    this.init();
    this.init2();
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

#renderCanvas2{
  width   : 100%;
  height  : 100%;
  touch-action: none;
}
</style>
