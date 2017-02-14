<template>
    <svg
        class="touch-control-move"
        v-tapstart="setCenter"
        v-tapmove="moveStick"
        v-tapend="resetCenter"
    >
        
        <g :transform="translateCenter">
            <circle 
                class="touch-control-move-stick-center"
                :r="size*0.17" 
            />
            <circle 
                class="touch-control-move-stick-limits"
                :r="size" 
            />
            <circle 
                class="touch-control-move-stick-handler"
                :r="size*.3" 
                :cx="pos.x * size" 
                :cy="pos.y * size" 
            />
        </g>
    </svg>
</template>

<script>
import circleMixin from '../../mixins/circleMixin.js'
export default {
    mixins: [circleMixin]
}
</script>

<style>
.touch-control-move{
    background-color:rgba(50, 115, 220, 0.1);
    width: 100%;
    height: 100%;
    display: block;
}
.touch-control-move-stick-center{
    fill:#3273dc; 
}
.touch-control-move-stick-limits{
    fill:rgba(50, 115, 220, 0.3);
    stroke:#3273dc;
    stroke-width:3;
}
.touch-control-move-stick-handler{
    fill:rgba(255,255,255,.6);
}
</style>