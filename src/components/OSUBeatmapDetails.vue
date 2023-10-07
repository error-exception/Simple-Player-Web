<template>
    <Column class="details-box">
        <Row class="details-base-info fill-size" center>
            <img class="details-base-image" src="../../public/background/menu-background-1.jpg">
            <Column class="details-base-text-box">
                <span class="details-base-title">Lumina</span>
                <span class="details-base-artist">Wisp X</span>
            </Column>
        </Row>
        <Column style="width: fit-content">
            <Row class="details-mode-box">
                <div class="details-mode details-mode-selected ma">{{ Icon.RadioButtonUnchecked }}</div>
                <div class="details-mode ma">{{ Icon.RadioButtonUnchecked }}</div>
                <div class="details-mode ma">{{ Icon.RadioButtonUnchecked }}</div>
                <div class="details-mode ma">{{ Icon.RadioButtonUnchecked }}</div>
            </Row>
            <div style="height: 4px; background-color: white;"></div>
        </Column>
        <Column class="details-difficult-list">
            <Column class="details-difficult-list-item">
                <span class="details-difficult-name">Hard</span>
                <Row class="details-difficult-rate-box">
                    <div class="details-difficult-rate-item ma">{{ Icon.Star }}</div>
                </Row>
            </Column>
        </Column>
    </Column>
</template>
<script setup lang="ts">
import {Icon} from "../ts/icon/Icon";
import Row from "./common/Row.vue";
import Column from "./common/Column.vue";

</script>
<style scoped>
.details-box {
    background-color: #2e3835;
    width: 600px;
    border-radius: 8px;
    pointer-events: auto;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    padding: 16px;
    row-gap: 16px;
}
.details-base-info {
    width: 100%;
    position: relative;
    overflow: hidden;
    border-radius: 8px;
    aspect-ratio: 16/4.5;
    object-fit: cover;
}
.details-base-image {
    position: absolute;
    width: 100%;
}
.details-base-text-box {
    background-image: linear-gradient(0, #00000080, transparent, transparent);
    flex-direction: column;
    position: absolute;
    color: white;
    row-gap: 16px;
}
.details-base-title {
    font-size: 24px;
}
.details-base-artist {
    font-size: 18px;
}
.details-mode-box {
    color: white;
}
.details-mode {
    border: 4px solid transparent;
}
.details-mode-selected {
    background-color: #ffffff40;
}
.details-difficult-list-item {
    padding: 8px;
    background-color: #556963;
    border-radius: 4px;
    color: white;
}
</style>