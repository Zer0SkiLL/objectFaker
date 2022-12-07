<script>
import JsonEditor from '../json-editor/JsonEditor.vue'
import JsonInput from '../json-input/JsonInput.vue'
import JsonOutput from '../json-output/JsonOutput.vue'

export default {
  data() {
    return {
      jsonObject: {},
    }
  },
  components: {
    JsonInput,
    JsonEditor,
    JsonOutput,
  },
  methods: {
    getJsonObject(jsonObject) {
      // var string = jsonObject.replace("new", "");
      // this.jsonObject = JSON.stringify(string);
      // console.log(this.jsonObject);

      this.jsonObject = this.tryMapStringInput(jsonObject)
    },
    tryMapStringInput(input) {
      // try to map the input string into different types
      const result = {
        error: false,
        errorInfo: '',
        type: '',
        data: {},
      }
      // first try json
      try {
        result.data = JSON.parse(input)
        result.type = 'JSON'

        return result
      } catch (e) {
        result.data = {}
        result.error = true
        result.errorInfo = 'not a JSON string'

        console.log('not a JSON string', e)
      }
      // try a list of c# objects

      return result
    },
  },
}
</script>

<template>
  <div class="json-handler">
    <div class="container">
      <div class="item input">
        <JsonInput :getJsonObject="getJsonObject" />
      </div>
      <div class="item edit">
        <JsonEditor :jsonObject="this.jsonObject" />
      </div>
    </div>
    <div class="container">
      <div class="item output">
        <JsonOutput />
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  height: auto;
  width: auto;
}

.item {
  flex-grow: 1;
  height: auto;
}

.item {
  margin-left: 2%;
  min-width: 48%;
}

.input {
}

.edit {
}

.card {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  width: 40%;
  border-radius: 5px;
}

.card:hover {
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
}

img {
  border-radius: 5px 5px 0 0;
}

.card-container {
  padding: 2px 16px;
}
</style>
