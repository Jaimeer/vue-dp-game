<template>
    <button class="touch-controller-fullscren" @click="toggle">
        fullscreen
    </button>
</template>

<script>
export default {
    methods:{
        toggle(){
            toggleFullscreen()
        }
    }
}
//Crossbrowser fullscreen toggle
function toggleFullscreen(elem) {
    elem = elem || document.documentElement
    if (!document.fullscreenElement && !document.mozFullScreenElement &&
    !document.webkitFullscreenElement && !document.msFullscreenElement) {
        if (elem.requestFullscreen) {
            elem.requestFullscreen()
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen()
        } else if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen()
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT)
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen()
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen()
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen()
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen()
        }
    }
}
</script>

<style>
.touch-controller-fullscren{
    position: absolute;
    top: 0;
    left:50%;
    margin-left: -50px;
    width: 100px;
    text-align: center;    
}
</style>
