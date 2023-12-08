<template>
    <Column class="score-box" :gap="8">
        <Row center-vertical>
            <span style="color: dodgerblue" class="score-name">PERFECT</span>
            <span class="score-value">{{ Judge.perfect }}</span>
        </Row>
        <Row center-vertical>
            <span style="color: greenyellow" class="score-name">GOOD</span>
            <span class="score-value">{{ Judge.good }}</span>
        </Row>
        <Row center-vertical>
            <span style="color: yellow;" class="score-name">BAD</span>
            <span class="score-value">{{ Judge.bad }}</span>
        </Row>
        <Row center-vertical>
            <span style="color: red" class="score-name">MISS</span>
            <span class="score-value">{{ Judge.miss }}</span>
        </Row>
    </Column>
</template>
<script setup lang="ts">
import Column from "./common/Column.vue";
import Row from "./common/Row.vue";
import {Judge} from "../ts/Judge";

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