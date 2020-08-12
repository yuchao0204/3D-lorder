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

import * as Three from 'three'
// import OrbitControls from 'three-orbitcontrols'
// import {OBJLoader} from 'three-obj-mtl-loader'
// import Stats from 'stats-js'

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
        console.log("loadObj")
        var _loader = new Three.ObjectLoader()
        _loader.load('/static/obj/a.obj' , obj => {
            console.log("obj success",obj);
            this.scene.add(obj)
        });
    },
    loadStl:function(){
        console.log("loadStl")
        var _loader = new Three.STLLoader()
        _loader.load('/static/obj/3.STL' , obj => {
            console.log("stl success",obj);
            this.scene.add(obj)
        });
    }
  },
  mounted( ) {
    this.updateTime()
    this.msg = this.$route.params.msg||"test"
    this.init()
    this.animate()
  }
}
</script>

<style scoped>
</style>
