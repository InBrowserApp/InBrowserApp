<template>
  <div class="container">
    <span
      ><a target="_blank" rel="noopener"
        ><br />
        <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
        <h3 class="LC20lb MBeuO DKV0Md">Google Search Result</h3>
        <div class="notranslate TbwUpd NJjxre iUh30 ojE3Fb">
          <span class="H9lube"
            ><div class="eqA2re NjwKYd Vwoesf" aria-hidden="true">
              <div class="XNo5Ab" :src="imageURL" style="height: 18px; width: 18px">
                <DesktopBrowserImage :image="image" :options="options" />
              </div></div
          ></span>
          <div>
            <span class="VuuXrf">{{ generalInfoOptions.name }}</span>
            <div class="byrV5b">
              <cite class="tjvcx GvPZzd cHaqb" role="text">https://example.com</cite>
            </div>
          </div>
        </div></a
      ></span
    >
    <div class="B6fmyf byrV5b Mg1HEd">
      <div class="TbwUpd iUh30 ojE3Fb">
        <span class="H9lube"
          ><div class="eqA2re NjwKYd" style="height: 18px; width: 18px"></div
        ></span>
        <div>
          <span class="VuuXrf">{{ generalInfoOptions.name }}</span>
          <div class="byrV5b">
            <cite class="tjvcx GvPZzd cHaqb" role="text">https://example.com</cite>
          </div>
        </div>
      </div>
      <div class="csDOgf BCF2pd ezY6nb L48a4c">
        <div>
          <div role="button" tabindex="0" class="iTPLzd rNSxBe lUn2nc" style="position: absolute">
            <span class="D6lY4c mBswFe"
              ><span class="xTFaxe z1asCe" style="height: 18px; line-height: 18px; width: 18px"
                ><svg focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
                  ></path></svg></span
            ></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useObjectUrl } from '@vueuse/core'
import type { DesktopBrowserOptions } from '../../utils/favicon-generator/desktop-browser'
import { computed } from 'vue'
import type { GeneralInfoOptions } from '../../utils/favicon-generator/general-info'
import DesktopBrowserImage from './DesktopBrowserImage.vue'

const props = defineProps<{
  image: Blob | undefined
  options: DesktopBrowserOptions
  generalInfoOptions: GeneralInfoOptions
}>()

const image = computed<Blob | undefined>(() => {
  if (props.options.image) {
    return props.options.image
  } else {
    return props.image
  }
})

const imageURL = useObjectUrl(image)
</script>

<style scoped>
.container {
  position: relative;
}
</style>

<style lang="css" scoped src="./GoogleSearchResult.css"></style>
<style lang="css" scoped src="./GoogleSearchResult-dark.css"></style>
