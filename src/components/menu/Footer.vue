<template>
  <div class="footer">
    <p class="customText">
      {{t('Created by')}}
      <a target="_blank" href="https://github.com/Adrian-glz01">Adrián González Expósito</a>
      - {{t('As a application for the final degree project')}}.
    </p>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const {t} = useI18n();
</script>

<style scoped>

.footer {
  border-top: 1px solid #52606610;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.3);
}

p {
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  letter-spacing: 0.5px;
  margin: 20px 0 30px;
}

a {
  color: #3c97bf;
  font-size: 14px;
  text-decoration: none;
  margin: 15px 0;
  font-weight: bold;
}

.customText {
  position: absolute;
  right: 0;
  margin-right: 20px;
}

@media screen and (max-width: 840px) {
  p {
    margin-top: 0px;
    font-size: 8px;
  }
  a {
    font-size: 8px;
  }
}
</style>