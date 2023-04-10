<template>
  <div class="container">
    <div class="header">
      <div class="button_wrapper">
        <button @click="handleSave">Save</button>
        <button @click="handleUndo" :disabled="!selectedList.length">
          Undo
        </button>
        <button @click="handleRedo" :disabled="!tempElementList.length">
          Redo
        </button>
        <button @click="handleExport">Export</button>
        <button
          @click="
            () => {
              uploadInput.click();
            }
          "
        >
          Import
        </button>
        <input
          ref="uploadInput"
          :key="resetUploadInput"
          id="upload-input"
          type="file"
          @change="uploadFile"
          hidden
        />
        <button @click="handleRedirectToConsumerPage">View</button>
      </div>
    </div>
    <div class="body">
      <div class="left-side">
        <div
          v-for="item in leftSideData"
          :key="item.id"
          class="left-side__element"
          :draggable="true"
          @dragstart="() => (droppedElement = item.component)"
          @dragend="() => (droppedElement = '')"
        >
          {{ item.name }}
        </div>
      </div>
      <div class="main-side">
        <div ref="dropSection" class="main-side__above">
          <div class="information">
            <div>
              Mouse: ({{ `${mousePosition.pageX}, ${mousePosition.pageY}` }})
            </div>
            <div>Dragging: {{ droppedElement }}</div>
            <div>Instances: {{ selectedList.length }}</div>
            <div>
              Config:
              {{ Object.keys(selectedElement).length ? selectedElement : "" }}
            </div>
          </div>
          <div class="selected-items">
            <Element
              v-for="ele in selectedList"
              :key="ele.id"
              :element="ele"
              @clickElement="handleClickElement"
            />
          </div>
        </div>
        <div ref="mainBelow" class="main-side__below">
          <InputElements
            v-if="Object.keys(selectedElement).length"
            :key="selectedElement.id"
            :element="selectedElement"
            @updateValue="handleRefreshSelectedElementValue"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, reactive, ref } from "vue";
import InputElements from "../components/InputElements.vue";
import Element from "../components/Element.vue";
import { json2xml, xml2json, downloadXMLFile } from "../ultis/index";
import { db } from "../firebase/firebaseInit";
import { doc, setDoc, getDoc } from "firebase/firestore";
import router from "../router/index";

const leftSideData = [
  {
    id: "0",
    component: "ElementParagraph",
    name: "Paragraph",
  },
  {
    id: "1",
    component: "ElementButton",
    name: "Button",
  },
];
const dropSection = ref(null);
const mainBelow = ref(null);
const selectedList = ref([]);
const droppedElement = ref("");
const mousePosition = reactive({
  pageX: 0,
  pageY: 0,
});
const selectedElement = ref({});
const tempElementList = ref([]);
const resetUploadInput = ref(0);
const uploadInput = ref(null);
initData();
onMounted(async () => {
  dropSection.value.addEventListener("mousemove", (e) => {
    let rect = dropSection.value.getBoundingClientRect();
    mousePosition.pageX = Number(e.x) - Number(rect.x);
    mousePosition.pageY = Number(e.y) - Number(rect.y);
  });
  mainBelow.value.addEventListener("mousemove", (e) => {
    let rect = mainBelow.value.getBoundingClientRect();
    mousePosition.pageX = Math.round(Number(e.x) - Number(rect.x));
    mousePosition.pageY = Math.round(Number(e.y) - Number(rect.y));
  });
  dropSection.value.addEventListener("dragover", (event) => {
    event.preventDefault();
  });
  dropSection.value.addEventListener("drop", (e) => {
    selectedList.value.push({
      id: generateId(),
      component:
        droppedElement.value === "ElementParagraph"
          ? "ElementParagraph"
          : "ElementButton",
      props: {},
    });
    tempElementList.value = [];
  });
});
onUnmounted(() => {
  dropSection.value.removeEventListener("mousemove");
  mainBelow.value.removeEventListener("mousemove");
  dropSection.value.removeEventListener("dragover");
  dropSection.value.removeEventListener("drop");
});
async function initData() {
  let docRef = doc(db, "template", "templateDoc");
  try {
    let res = await getDoc(docRef);
    selectedList.value = res.data().data;
  } catch (error) {
    alert("there are some errors");
  }
}
function generateId() {
  return `id${Math.random().toString(16).slice(2)}`;
}
function handleClickElement(ele) {
  selectedElement.value = ele;
}
function handleRefreshSelectedElementValue(value) {
  value.forEach((field) => {
    if (field.text) {
      selectedElement.value.props[field.name] = field.text;
    } else {
      delete selectedElement.value.props[field.name];
    }
  });
}
function handleExport() {
  const json = `{"root": {"data": ${JSON.stringify(selectedList.value)}}}`;
  var xml = eval("json2xml(" + json + ");");
  downloadXMLFile(xml);
}
function uploadFile(e) {
  let readXml = null;
  let file = e.target.files[0];
  const fileType = file.name.split(".");
  if (fileType[fileType.length - 1] !== "xml") {
    alert("file must be of type xml");
    return;
  }
  var reader = new FileReader();
  reader.onload = function (e) {
    readXml = e.target.result;
    var XmlNode = new DOMParser().parseFromString(readXml, "text/xml");
    let {
      root: { data },
    } = xml2json(XmlNode);
    if (data) {
      selectedList.value = Array.isArray(data) ? data : [data];
      selectedElement.value = {};
    } else {
      alert("data is not in the correct format");
    }
    resetUploadInput.value++;
  };
  reader.readAsText(file);
}
function handleUndo() {
  if (!selectedList.value.length) return;
  const removedElement = selectedList.value.pop();
  tempElementList.value.push(removedElement);
}
function handleRedo() {
  if (!tempElementList.value.length) return;
  const addedElement = tempElementList.value.pop();
  selectedList.value.push(addedElement);
}
async function handleSave() {
  let docRef = doc(db, "template", "templateDoc");
  try {
    await setDoc(docRef, {
      data: selectedList.value,
    });
    tempElementList.value = [];
    selectedElement.value = {};
  } catch (error) {
    alert("save unsuccessfully");
  }
}
function handleRedirectToConsumerPage() {
  const routeData = router.resolve({ name: "Consumer" });
  window.open(routeData.href, "_blank");
}
</script>

<style lang="scss">
.container {
  .header {
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 10px 0;
  }
  .body {
    display: flex;
    height: calc(100vh - 44px);
    border-top: 1px solid #000000;
    .left-side {
      height: 100%;
      flex: 1 1 15%;
      padding: 10px;
      border-right: 1px solid #000000;
      &__element {
        text-align: center;
        cursor: pointer;
        padding: 10px;
        &::before {
          content: "";
          display: block;
          width: 60px;
          height: 60px;
          border: 1px solid #000000;
          margin: 0 auto;
        }
        &:not(:last-child) {
          margin-bottom: 5px;
        }
        &:hover {
          background: #c6c6c6;
        }
      }
    }
    .main-side {
      height: 100%;
      flex: 1 1 85%;
      display: flex;
      flex-direction: column;
      &__above {
        flex: 1 1 80%;
        display: flex;
        padding: 10px;
        div {
          flex: 1 1 50%;
        }
        .selected-items {
          &__ele {
            .paragraph {
              cursor: pointer;
            }
          }
        }
      }
      &__below {
        align-items: flex-end;
        flex: 1 1 20%;
        border-top: 1px solid #000000;
        padding: 10px;
      }
    }
  }
}
</style>
