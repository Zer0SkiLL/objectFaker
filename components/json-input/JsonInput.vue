<script>
export default {
  data() {
    return {
      jsonObject: {},
    };
  },
  props: {
    getJsonObject: Function,
  },
};
</script>

<template>
  <div class="container">
    <div class="item title">
      <h2>Input Data</h2>
      <button
        v-on:click="getJsonObject(this.$el.querySelector('.inputBox').value)"
      >
        Refresh
      </button>
    </div>
    <div class="item input">
      <textarea
        class="inputBox"
        v-on:change="getJsonObject($event.target.value)"
      ></textarea>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px;
  justify-content: space-between;
  align-items: flex-start;
}

.item {
}

.title {
  margin-bottom: 20px;
}

.input {
  flex-grow: 3;
  width: 100%;
}

textarea {
  width: 100%;
  height: 850px;
  padding: 12px 20px;
  box-sizing: border-box;
  border: 2px solid #ccc;
  border-radius: 4px;
  background-color: #f8f8f8;
  font-size: 16px;
}
</style>
