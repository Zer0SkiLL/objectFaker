<script setup>
// const users = ref([]);
// const take = ref(3);
const selecte = ref([]);
const fakeSelect = ref([]);
const options = ref([
    { text: 'Ignore', value: '0' },
    { text: 'Fake', value: '1' },
    { text: 'Custom', value: '2' },
]);
const custom = ref([]);
const customFake = ref([]);
const jsonObj = ref({});
let inputString = ref('');
let editRule = ref([]);
const output = ref('');
let metaInfo = ref([]);
let metaInfoJson = ref('');

const fakeOptions = ref([
    { text: 'Strasse', value: 'streetName' },
    { text: 'Stadt', value: 'city' },
    { text: 'PLZ', value: 'zipCode' },
    { text: 'Portfolio', value: 'financeAccount' },
    { text: 'BIC', value: 'bic' },
    { text: 'IBAN', value: 'iban' },
    { text: 'Vorname', value: 'firstname' },
    { text: 'Nachname', value: 'lastname' },
]);

const getJsonObject = (jsonObject) => {
    // var string = jsonObject.replace("new", "");
    // this.jsonObject = JSON.stringify(string);
    // console.log(this.jsonObject);
    const test = tryMapStringInput(jsonObject);
    jsonObj.value = test;
    console.log(jsonObj);
};
const tryMapStringInput = (input) => {
    // try to map the input string into different types
    let result = {
        error: false,
        errorInfo: '',
        type: '',
        data: {},
    };

    inputString = input;

    // first try json
    try {
        let parse = JSON.parse(input);
        console.log(parse);
        result.data = parse;
        result.type = 'JSON';
        result.error = false;
        result.errorInfo = '';

        return result;
    } catch (e) {
        result.data = {};
        result.error = true;
        result.errorInfo = 'not a JSON string';
        result.type = '';

        console.log('not a JSON string', e);
    }

    // try silly c# generated data
    try {
        let prep = input.replaceAll(' =', ':');
        prep = prep.replaceAll(' {', ': {');
        console.log(prep);

        //1 match on only JSON within string
        let obj = prep.match(/{[^}]+}/).toString();

        console.log(obj);

        let tmp = obj.split('\n');

        let objCustom = '';
        tmp.forEach(function (elem, i) {
            if (!elem.includes('new ')) {
                objCustom += elem + '\n';
            }
        });

        tmp = objCustom.split('\n');
        let objParse = '';
        tmp.forEach(function (elem, i) {
            if (i == tmp.length - 3) {
                console.log(elem, elem.replace(',', ''));
                objParse += elem.replace(',', '') + '\n';
                return;
            }

            objParse += elem + '\n';
        });

        //2 enclose property names to prevent errors with JSON.parse()
        objParse = objParse.replaceAll(/([a-zA-Z]+):/g, '"$1":');

        console.log(objParse);

        //3 obtain object
        let dat = JSON.parse(objParse);

        result.data = dat;
        result.type = 'c#';
        result.error = false;
        result.errorInfo = '';

        Object.keys(dat).forEach(function (key, i) {
            selecte[key] = '0';
        });

        let objDisplay = '';
        let tmpInput = input.split('\n');
        tmpInput.forEach(function (elem, i) {
            if (!elem.includes('new ')) {
                objDisplay += elem + '\n';
            }
        });

        console.log(selecte);

        return result;
    } catch (e) {
        result.data = {};
        result.error = true;
        result.errorInfo = 'not a JSON stringify';
        result.type = '';

        console.log('not a JSON stringify', e);
    }

    return result;
};

const generate = async () => {
    console.log(selecte, custom, fakeSelect);
    // write rules
    editRule = [];
    metaInfo.value = [];
    console.log(selecte.value);
    Object.keys(jsonObj.value.data).forEach((key, i) => {
        console.log(selecte.value[key], key);
        if (selecte.value[key] != '0' && selecte.value[key] != undefined) {
            // not ignore - set a rule
            editRule.push({
                key: key,
                type: selecte.value[key],
                option: fakeSelect.value[key],
                config: customFake.value[key],
            });
        }
    });

    console.log(editRule);

    let out = '';

    let inputSplit2 = inputString.split(/({[^}]+})/g);

    console.log(inputSplit2);
    let metaInfoEntry = {};

    for (const element of inputSplit2) {
        const inputSplit3 = element.split('\n');

        console.log(inputSplit3);
        for await (const element2 of inputSplit3) {
            console.log(element2);
            if (element2 == '') {
                continue;
            }
            let line = '';

            line = element2;
            const indx = editRule.findIndex((f) => element2.includes(f.key));
            console.log(indx);
            if (indx >= 0) {
                const rule = editRule[indx];
                if (rule.type == '1') {
                    // generate fake data

                    const conf = rule.config == undefined ? null : rule.config;
                    const dat = await getFake(rule.option, conf);
                    console.log(dat);
                    line = element2.replace(/"([\s\S]+)"/g, '"' + dat + '"');

                    const oldVal = element2.match(/"([\s\S]+)"/g).pop();

                    console.log(oldVal);

                    metaInfoEntry = {
                        key: rule.key,
                        oldValue: oldVal.replaceAll('"', ''),
                        newVal: dat.replace('"', ''),
                    };

                    metaInfo.value.push(metaInfoEntry);
                }

                if (rule.type == '2') {
                    // replace with custom data
                    line = element2.replace(
                        /"([\s\S]+)"/g,
                        '"' + custom.value[rule.key] + '"'
                    );

                    const oldVal = element2.match(/"([\s\S]+)"/g).pop();

                    console.log(oldVal);

                    metaInfoEntry = {
                        key: rule.key,
                        oldValue: oldVal.replaceAll('"', ''),
                        newVal: custom.value[rule.key].replace('"', ''),
                    };

                    metaInfo.value.push(metaInfoEntry);
                }
            }
            console.log(line);
            out += line;
            if (element2 == '}') {
                continue;
            }

            out += '\n';
        }
    }
    console.log(out);
    output.value = out;
    metaInfoJson.value = JSON.stringify(metaInfo.value, undefined, 2);
    console.log(metaInfoJson.value);
};

const getFake = async (type, config) => {
    const data = await $fetch(`/api/fake-data?type=${type}&config=${config}`);
    return new Promise((resolve, reject) => {
        resolve(data.data);
    });
};
</script>

<template>
    <div>
        <header>
            <div class="header">
                <h2>Object Editor</h2>
            </div>
        </header>

        <div class="json-handler">
            <div class="flex-container">
                <div class="flex-item input">
                    <div class="title"><h2>Input</h2></div>
                    <div class="tools">
                        <button
                            v-on:click="
                                getJsonObject(
                                    this.$el.querySelector('.inputBox').value
                                )
                            "
                        >
                            Refresh
                        </button>
                    </div>
                    <div class="content">
                        <textarea
                            class="inputBox"
                            v-model="input"
                            v-on:change="getJsonObject($event.target.value)"
                        ></textarea>
                    </div>
                </div>
                <div class="flex-item edit">
                    <div class="title"><h2>Edit</h2></div>
                    <div class="tools">Type:</div>
                    <div class="content">
                        <div
                            v-if="Object.keys(jsonObj).length == 0"
                            class="item missing"
                        >
                            <div class="card">
                                <div class="card-container">
                                    <h4><b>No Input found</b></h4>
                                    <p>
                                        add some data in Json format in order to
                                        start
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div v-if="Object.keys(jsonObj).length > 0">
                            <div v-if="jsonObj.error" class="item error">
                                <div class="card">
                                    <div class="card-container">
                                        <h4>
                                            <b
                                                >There was an error parsing the
                                                data</b
                                            >
                                        </h4>
                                        <p>
                                            {{ jsonObj.errorInfo }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div v-if="!jsonObj.error" class="item valid">
                                <div class="card">
                                    <div class="card-container">
                                        <h4><b>Example:</b></h4>
                                        <div class="props">
                                            <div class="description">
                                                <div class="key">Modify</div>
                                                <div class="key">Field</div>
                                                <div class="value">Value</div>
                                                <div class="value">Type</div>
                                                <div class="edit-fake">
                                                    Output
                                                </div>
                                                <div class="edit-fake-option">
                                                    Config
                                                </div>
                                            </div>
                                            <hr class="solid" />
                                        </div>
                                        <div
                                            v-for="(prop, k, i) in jsonObj.data"
                                            v-bind:key="k"
                                            class="props"
                                        >
                                            <div class="description">
                                                <!--radio-->
                                                <div
                                                    class="flex items-center mb-4"
                                                >
                                                    <select
                                                        v-model="selecte[k]"
                                                    >
                                                        <option
                                                            v-for="option in options"
                                                            :value="
                                                                option.value
                                                            "
                                                        >
                                                            {{ option.text }}
                                                        </option>
                                                    </select>
                                                </div>
                                                <div class="key">{{ k }}:</div>
                                                <div class="value">
                                                    {{ prop }}
                                                </div>
                                                <div class="type">
                                                    {{ typeof prop }}
                                                </div>
                                                <div class="edit-fake">
                                                    <div v-if="selecte[k] == 0">
                                                        same
                                                    </div>
                                                    <select
                                                        v-if="selecte[k] == 1"
                                                        v-model="fakeSelect[k]"
                                                    >
                                                        <option
                                                            v-for="option in fakeOptions"
                                                            :value="
                                                                option.value
                                                            "
                                                        >
                                                            {{ option.text }}
                                                        </option>
                                                    </select>
                                                    <input
                                                        v-if="selecte[k] == 2"
                                                        v-model="custom[k]"
                                                        placeholder="custom data"
                                                    />
                                                </div>
                                                <div class="edit-customFake">
                                                    <input
                                                        v-if="selecte[k] == 1"
                                                        v-model="customFake[k]"
                                                        placeholder="fake option"
                                                    />
                                                </div>
                                            </div>
                                            <hr class="solid" />
                                        </div>
                                    </div>
                                </div>
                                <button v-on:click="generate">Generate</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex-container">
                <div class="flex-item output">
                    <div class="title"><h2>Output</h2></div>
                    <div class="tools"></div>
                    <div class="content">
                        <textarea
                            :value="output"
                            class="inputBox"
                            readonly
                        ></textarea>
                    </div>
                </div>
                <div class="flex-item meta">
                    <div class="title"><h2>Meta Info</h2></div>
                    <div class="tools"></div>
                    <div class="content">
                        <textarea
                            :value="metaInfoJson"
                            class="inputBox"
                            readonly
                        ></textarea>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.header {
    display: flex;
    flex-grow: 1;
    padding: 15px;
    text-align: center;
    background: #1abc9c;
    color: white;
    font-size: 26px;
}

.json-handler {
    margin: 0 20px;
}

.flex-container {
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    align-items: stretch;
    height: auto;
}

.flex-item {
    background-color: white;
    margin: 10px 0 10px;
    text-align: left;
    padding: 25px;
    min-width: 42vw;
}

.flex-item .title {
}

.flex-item .tools {
    height: 40px;
}

.flex-item .content {
    margin-top: 10px;
}

.flex-item.output {
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

.item.valid .description {
    display: flex;
    flex-direction: row;
}

.item.valid .description > div {
    flex: 1 1 200px;
}

.edit-customFake input {
    width: 93%;
}

.edit-fake input {
    width: 193%;
}
</style>
