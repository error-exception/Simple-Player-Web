<template>
    <Column class="score-box" :gap="8">
        <Row center-vertical>
            <span style="color: dodgerblue" class="score-name">PERFECT</span>
            <span class="score-value">{{ Score.perfect }}</span>
        </Row>
        <Row center-vertical>
            <span style="color: greenyellow" class="score-name">GOOD</span>
            <span class="score-value">{{ Score.good }}</span>
        </Row>
        <Row center-vertical>
            <span style="color: yellow;" class="score-name">BAD</span>
            <span class="score-value">{{ Score.bad }}</span>
        </Row>
        <Row center-vertical>
            <span style="color: red" class="score-name">MISS</span>
            <span class="score-value">{{ Score.miss }}</span>
        </Row>
    </Column>
</template>
<script setup lang="ts">
import Column from "./Column.vue";
import Row from "./Row.vue";
import {Score} from "../ts/Score";

</script>

<style scoped>
.score-box {
    padding: 16px 32px;
    background-color: #4f5e5a;
    border-radius: 16px;
}
.score-name {
    color: white;
    font-weight: bold;
    width: 120px;
    font-size: 24px;
}
.score-value {
    color: white;
    font-size: 24px;
}
</style>