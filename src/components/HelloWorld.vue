<template>
  <div class="hello">
    <p>{{ msg }}</p>
    <!-- <input type="button" v-on: -->
    <router-link :to="{name:'babylonjs',params:{msg:msg}}">babylonjs</router-link>
    <router-link :to="{name:'threejs',params:{msg:msg}}">threejs</router-link>
    <div id="container">
    </div>
    <div id="test" style="margin-top: 5px;">
    </div>

  </div>
</template>

<script>

import * as Three from 'Three'

export default {
  name: 'HelloWorld',
  data () {
    return {
      msg:"abc",
      camera: null,
      scene: null,
      renderer: null,
      mesh: null,
      camera0: null,
      scene0: null,
      mesh0: null,
      renderer0: null,

    }
  },
  methods: {
    init: function() {
        let container = document.getElementById('container')
        this.camera0 = new Three.PerspectiveCamera(70, container.clientWidth/container.clientHeight, 0.01, 10)
        this.camera0.position.z = 1
 
        this.scene0 = new Three.Scene()
 
        // let geometry = new Three.BoxGeometry(0.2, 0.2, 0.2);
        let geometry = new Three.IcosahedronGeometry(0.2,0)
        let material = new Three.MeshNormalMaterial()
 
        this.mesh0 = new Three.Mesh(geometry, material)
        this.scene0.add(this.mesh0)

        this.renderer0 = new Three.WebGLRenderer({antialias: true})
        this.renderer0.setSize(container.clientWidth, container.clientHeight)
        container.appendChild(this.renderer0.domElement)
    },
    animate: function() {
        requestAnimationFrame(this.animate)
        this.mesh.rotation.x += 0.02
        this.mesh.rotation.y += 0.01
        this.renderer.render(this.scene, this.camera)

        this.mesh0.rotation.x += 0.01
        this.mesh0.rotation.y += 0.02
        this.renderer0.render(this.scene0, this.camera0)
    },
    // onProgress : function(xhr){
    //     console.log('console.log')
    //     if(xhr.lengthComputable)
    //     {
    //         var percentComplete = xhr.loaded / xhr.total * 100
    //         console.log(Math.round(percentComplete,2) + '% downloaded')
    //     }
    // },

    // onError : function(xhr)
    // {},
    // LoadObjModel : function(){
    //     //加载模型
    //     var _loader = new Three.ObjectLoader()
    //     console.log("_loader",_loader)
    //     _loader.load('/static/obj/a.obj',function(obj)
    //     {
    //         _scene.add(obj)
    //     },this.onProgress,this.onError)
    // },
    testFun:function(){
      let container = document.getElementById('test')
      var WIDTH,HEIGHT
      // var renderer;
      WIDTH = document.documentElement.clientWidth
      HEIGHT = document.documentElement.clientHeight/2
      /* 渲染器 */
      this.renderer = new Three.WebGLRenderer()
      this.renderer.setSize(WIDTH , HEIGHT)
      this.renderer.setClearColor(new Three.Color(0x66666))
      this.renderer.gammaInput = true
      this.renderer.gammaOutput = true
      container.appendChild(this.renderer.domElement)

      var VIEW_ANGLE = 3,
      ASPECT = WIDTH / HEIGHT,
      NEAR = 0.1,
      FAR = 100
      this.scene = new Three.Scene()
      this.camera = new Three.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR)
      this.camera.position.set(10, 0, 0)
      //设置视野的中心坐标
      this.camera.lookAt(this.scene.position)

      // let light = new Three.DirectionalLight(0xFFFFFF)
      // light.position.set(0, 99, 0).normalize()
      // this.scene.add(light)
      // //环境光
      // let light2 = new Three.AmbientLight(0x999999)
      // this.scene.add(light2)
      // //点光源
      // let light3 = new Three.PointLight(0x00FF00)
      // light3.position.set(300, 0, 0)
      // this.scene.add(light3)
      let geometry = new Three.IcosahedronGeometry(0.1,0)
      let material = new Three.MeshNormalMaterial()
      this.mesh = new Three.Mesh(geometry, material)
      this.scene.add(this.mesh)
    }
  },
  mounted() {
      this.testFun();
      this.init()
      this.animate()
      // this.LoadObjModel();
  }
}
</script>

<style scoped>
  #container {
    height: 400px;
  }
</style>
