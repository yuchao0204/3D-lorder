<template>
  <div class="hello">
    <div id="container" style="width:100%;hight:100%;">
        <div id="head" style="width:100%;hight:200px;background-color:lightblue">
            {{msg}}<span>-minite:{{time}}</span>
        </div>
        <div id="left" style="background-color:#d5e6ad;height:100%;width:20%;float:left;min-height:500px;">
            <input type="button" @click="loadObj" value="loadObj">
            <input type="button" v-on:click="loadStl" value="loadStl">
        </div>
        <div id="right" style="background-color:#FFFF00;float:right;height:100%;width:80%;min-height:500px;">
            
        </div>
    </div>
  </div>
</template>

<script>

import * as Three from 'Three'
import OrbitControls from 'three-orbitcontrols'
import {OBJLoader,MTLLoader} from 'three-obj-mtl-loader'
// import Stats from 'stats-js'
// import { OBJLoader } from './../jsm/loaders/OBJLoader.js';

export default {
  name: 'LoadObj',
  data () {
    return {
        timer:null,
        time:-1,
        msg:"",
        camera: null,
        scene: null,
        renderer: null,
        mesh: null,
        controls:null
    }
  },
  methods: {
    init: function() {
        let container = document.getElementById('right')
        this.camera = new Three.PerspectiveCamera( 30, container.clientWidth / container.clientHeight, 0.1, 1000 )
        // this.camera.position.z = 1;
        this.camera.position.set(0, 0, 0.8)
        this.renderer = new Three.WebGLRenderer({antialias: true})
        this.scene = new Three.Scene()
        this.scene.add(this.camera)
        let geometry = new Three.IcosahedronGeometry(0.2, 0)
        let material = new Three.MeshNormalMaterial()
        this.mesh = new Three.Mesh(geometry, material)
        this.scene.add(this.mesh)

        // var controls = new Three.TrackballControls( this.camera,this.renderer.domElement);
        this.renderer.setSize(container.clientWidth, container.clientHeight)
        console.log("scene",this.scene)
        container.appendChild(this.renderer.domElement)
    },
    animate : function() {
        // this.renderer.render(this.scene, this.camera)
        // stats.update()
        // controls.update()
        requestAnimationFrame(this.animate)//再次调用animate方法实现刷新
        this.mesh.rotation.x += 0.01
        this.mesh.rotation.y += 0.02
        this.renderer.render(this.scene, this.camera)
    },
    updateTime:function(){
        this.time += 1
        clearInterval(this.timer)
        this.timer = setInterval(this.updateTime , 60000)
    },
    loadObj:function(){
      var that = this;
        let container = document.getElementById('right')
        if(container.hasChildNodes()){
          let node = container.childNodes;
          console.log("node",node);
          for(let i=0;i<node.length;i++){
            container.removeChild(node[i]);
          }
        }
				// document.body.appendChild( container );
        this.camera = new Three.PerspectiveCamera( 45, container.innerWidth / container.innerHeight, 1, 2000 );
        this.camera.position.z = 250;
        this.scene = new Three.Scene()
        this.renderer = new Three.WebGLRenderer({antialias: true})
        
        var object;

        // var ambientLight = new Three.AmbientLight( 0xcccccc, 0.4 );
        // this.scene.add( ambientLight );
        // var pointLight = new Three.PointLight( 0xffffff, 0.8 );
				// this.camera.add( pointLight );
				this.scene.add( this.camera );

        var _loader = new OBJLoader();
        // new Three.OBJLoader();
        var file = "/static/obj/male02.obj"
        _loader.load(file , obj => {
            console.log("obj success",obj);
            that.scene.add(obj)

            // that.animate()
        });
        that.renderer = new Three.WebGLRenderer({antialias: true})
        that.renderer.setSize(container.clientWidth, container.clientHeight)
        container.appendChild(this.renderer.domElement)

        console.log("scene",that.scene)

        // container.appendChild(this.renderer.domElement)
    },
    loadStl:function(){
      console.log("loadStl")
      let container = document.getElementById('right')
      if(container.hasChildNodes()){
        let node = container.childNodes;
        console.log("node",node);
        for(let i=0;i<node.length;i++){
          container.removeChild(node[i]);
        }
      }
      this.scene = new Three.Scene();
      this.scene.add(new Three.AmbientLight(0x999999));//环境光
      this.light = new Three.DirectionalLight(0xdfebff, 0.45);//从正上方（不是位置）照射过来的平行光，0.45的强度
      this.light.position.set(50, 200, 100);
      this.light.position.multiplyScalar(0.3);
      this.scene.add(this.light);
      //初始化相机
      this.camera = new Three.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
      this.camera.position.set(10, 90, 65);
      this.camera.lookAt(this.scene.position);
      //初始化控制器
      // this.controls = new OrbitControls(this.camera);
      // this.controls.target.set(0, 0, 0);
      // this.controls.minDistance = 80;
      // this.controls.maxDistance = 400;
      // this.controls.maxPolarAngle = Math.PI / 3;
      // this.controls.update();
      //渲染
      this.renderer = new Three.WebGLRenderer({
        alpha: true,
      });
      this.renderer.setClearColor(0x000000);
      this.renderer.setPixelRatio(container.devicePixelRatio);//为了兼容高清屏幕
      this.renderer.setSize(container.innerWidth, container.innerHeight);
      container.appendChild(this.renderer.domElement);
      this.loadModel();
      this.animate();
    },
    // animate() {
    //   requestAnimationFrame(this.animate);
    //   this.render();
    // },
    render() {
      this.renderer.render(this.scene, this.camera);
    },
      //外部模型加载函数
    loadModel() {
      //包含材质
      new MTLLoader().setPath('/static/obj/').load('b.mtl', materials => {
        console.log("materials", materials);
        materials.preload();
        new OBJLoader().setMaterials(materials).setPath('/static/obj/').load('a.obj', obj => {
        console.log("111111111111111111obj", obj);
          obj.scale.set(30, 30, 30);
          obj.position.set(0, 0, 0);
          this.scene.add(obj);
        });
      });
    }
  },
  mounted( ) {
    this.updateTime()
    this.msg = this.$route.params.msg||"test"
    this.init()
    // this.loadObj()
    this.animate()
  }
}
</script>

<style scoped>
</style>
