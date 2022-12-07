<script>
const getUsers = async () => {
  //   const data = await $fetch(`/fake-users?take=${qty}`);
  const data = await $fetch(`/api/fake-users?take=3`)
  users.value = data.users
}
export default {
  data() {
    return {
      parsedJson: {},
      test: ['foo', 'bar'],
    }
  },
  props: {
    jsonObject: {},
  },
  updated() {
    getUsers()
    console.log(this.jsonObject, this.jsonObject.data)
    Object.keys(this.jsonObject.data).forEach((key) => {
      console.log(key, typeof this.jsonObject.data[key])
    })
  },
}
</script>

<template>
  <div class="container">
    <div class="item title">
      <h2>Edit Object</h2>
      <h3>type: {{ this.jsonObject.type }}</h3>
    </div>
    <div v-if="jsonObject == {}" class="item missing">
      <div class="card">
        <div class="card-container">
          <h4><b>No Input found</b></h4>
          <p>add some data in Json format in order to star</p>
        </div>
      </div>
    </div>
    <div v-if="jsonObject.error" class="item error">
      <div class="card">
        <div class="card-container">
          <h4><b>Input could not be parsed</b></h4>
          <p>try to fix the format</p>
        </div>
      </div>
    </div>
    <div v-if="jsonObject != {}" class="item valid">
      <div class="card">
        <div class="card-container">
          <h2>Beispiel:</h2>
          <div class="props">
            <div class="description">
              <div class="key">Modify</div>
              <div class="key">Field</div>
              <div class="value">Value</div>
              <div class="value">Type</div>
              <div class="edit-fake">Generate Fake</div>
              <div class="edit-custom">Replace with Custom</div>
            </div>
            <hr class="solid" />
          </div>
          <div
            v-for="(prop, k) in jsonObject.data"
            v-bind:key="k"
            class="props"
          >
            <div class="description">
              <div class="flex items-center mb-4">
                <input
                  id="default-radio-1"
                  checked
                  type="radio"
                  value="ignore"
                  name="default-radio"
                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  for="default-radio-1"
                  class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >Ingore</label
                >
              </div>
              <div class="flex items-center">
                <input
                  id="default-radio-2"
                  type="radio"
                  value="fake"
                  name="default-radio"
                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  for="default-radio-2"
                  class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >Fake</label
                >
              </div>
              <div class="flex items-center">
                <input
                  id="default-radio-3"
                  type="radio"
                  value="custom"
                  name="default-radio"
                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  for="default-radio-3"
                  class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >Custom</label
                >
              </div>
              <div class="key">{{ k }}:</div>
              <div class="value">
                {{ prop }}
              </div>
              <div class="type">{{ typeof prop }}</div>
              <div class="edit-fake">fakeeditor</div>
              <div class="edit-custom">editcustom</div>
            </div>
            <hr class="solid" />
          </div>
        </div>
      </div>
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
  width: auto;
}

.title {
  margin-bottom: 20px;
}

.input {
  width: 100%;
}

.card {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  width: 94%;
  padding: 12px 20px;
  border-radius: 5px;
  margin-bottom: 20px;
}

.card:hover {
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
}

img {
  border-radius: 5px 5px 0 0;
}

.card-container {
  padding: 2px 16px;
  display: flex;
  flex-direction: column;
}

.description {
  display: flex;
  flex-direction: row;
}

.description > div {
  flex: 1 1 200px;
}
</style>
