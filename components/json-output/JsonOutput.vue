<template>
  <div class="container">
    <div class="item title">
      <h2>Output Json</h2>
    </div>
    <div class="item input">
      <textarea readonly></textarea>
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
  border: 2px solid rgb(153, 153, 153);
  border-radius: 4px;
  background-color: #d3d3d3;
  font-size: 16px;
  resize: none;
}
</style>
