 <template lang="pug">
 
 .img <a href="#"><img v-bind:src="img" alt="" class="logo"></a>

</template>

<script>
const imgLink = require('../img/Madera.png')
export default {
    name: 'onepage',
    data(){
        return{
            img: imgLink,
        }
    }
}
</script>