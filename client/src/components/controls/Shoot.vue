<template>
    <svg
        class="touch-control-shot"
        v-tapstart="setCenter"
        v-tapmove="moveStick"
        v-tapend="resetCenter"
    >
        <clipPath id="frontier">
            <circle :r="size*2" />
        </clipPath>

        <g 
            :transform="translateCenter" 
            clip-path="url(#frontier)"
        >
            <circle 
                class="touch-control-shot-stick-limits"
                v-for="n in steps"
                :r="size * n" 
            />
            <line 
                class="touch-control-shot-stick-line"
                v-for="line in lines"
                :x1="line.x1" 
                :y1="line.y1" 
                :x2="line.x2" 
                :y2="line.y2"
            />
            <line 
                class="touch-control-shot-stick-fire"
                v-show="holding"
                :x2="fire.x" 
                :y2="fire.y"
            />

            <circle 
                class="touch-control-shot-stick-handler"
                :r="size*.3" 
                :cx="pos.x * size" 
                :cy="pos.y * size" 
            />
        </svg>
    </svg>
</template>

<script>
import circleMixin from '../../mixins/circleMixin.js'
export default {
    mixins: [circleMixin], 
    data(){
        return {
            steps: [.08,.22,.42,.66,1,1.9],
            fire: {x: 0, y: 0}
        }
    },
    computed:{
        lines(){
            let d = this.size*2
            return [
                {x1:0, y1:-d, x2:0, y2:d},
                {x1:-d, y1:0, x2:d, y2:0},
            ]
        }
    },
    methods:{
        setCenter(e){
            this.holding = true
            this.moveStick(e)
        },
        afterMoveStick(){
            this.fire = {
                x: this.pos.x * 10000,
                y: this.pos.y * 10000
            }
        }
    }
}
</script>

<style>
.touch-control-shot{
    background-color: rgba(207, 33, 33,.1);
    width: 100%;
    height: 100%;
    display: block;
}
.touch-control-shot-stick-center{
    fill:rgb(207, 33, 33);
}
.touch-control-shot-stick-limits{
    fill:none;
    stroke:rgb(207, 33, 33);
    stroke-width:2;
}
.touch-control-shot-stick-line{
    stroke:rgb(207, 33, 33);
    stroke-width:2;
}
.touch-control-shot-stick-fire{
    stroke:rgb(255, 166, 8);
    stroke-width:3;
    stroke-dasharray: 10, 5;
    animation: dash .2s linear infinite;
}
.touch-control-shot-stick-handler{
    fill:rgba(255,255,255,.6);
}
@keyframes dash {
  to {
    stroke-dashoffset: -15;
  }
}
</style>