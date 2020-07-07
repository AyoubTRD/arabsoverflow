const quill = new Quill("#editor", {
  modules: {
    toolbar: "#toolbar-container",
  },
  theme: "snow",
});

const bodyInput = document.querySelector("#body");
const editor = document.querySelector("#editor");

bodyInput.value = editor.innerHTML;

quill.on("text-change", () => {
  bodyInput.value = quill.root.innerHTML;
  console.log(bodyInput.value);
});

const tagsInput = document.querySelector("#tags");
const tagsContainer = document.querySelector("#tags-container");
const tagInput = document.querySelector("#tag");

let tags = tagsInput.value ? tagsInput.value.split(",") : [];

function renderTags() {
  tagInput.value = "";
  tagsInput.value = tags.join(",");
  const tagsHtml = tags.reduce(
    (acc, tag, index) =>
      acc +
      `
        <div class="tag py-1 pl-3 pr-6 rounded bg-primary bg-opacity-25 text-primary mx-1">
          ${tag}
          <ion-icon class="tag-delete" name="close-outline" data-id="${index}"></ion-icon>
        </div>
      `,
    ""
  );

  tagsContainer.innerHTML = tagsHtml;
}

tagInput.addEventListener("keyup", (e) => {
  if (e.keyCode === 13 && tagInput.value) {
    for (const tag of tagInput.value.split(",")) {
      tags.push(tag.trim());
      renderTags();
    }
  }
});

tagsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("tag-delete")) {
    const tagIndex = parseInt(e.target.getAttribute("data-id"));
    tags = [...tags.slice(0, tagIndex), ...tags.slice(tagIndex + 1)];
    renderTags();
  }
});

document.querySelector(".question-form").addEventListener("keydown", (e) => {
  if (e.keyCode === 13) {
    e.preventDefault();
  }
});
