document.addEventListener("DOMContentLoaded", (() => {
  const CHARS_COUNT = 31;

  const CharacterSets = {
    __numeric: "0123456789",
    __alphaLower: "abcdefghijklmnopqrstuvwxyz",
    numeric() { return this.__numeric; },
    alphaLower() { return this.__alphaLower + "_"; },
    alphaUpper() { return this.__alphaLower.toUpperCase() + "_"; },
    alpha() { return this.__alphaLower + this.alphaUpper(); },
    alphaNumeric() { return this.alpha() + this.__numeric; }
  }

  const CharacterClasses = {
    default: "character",
    inactive: "character character--inactive",
    active: "character character--active",
    success: "character character--success",
    error: "character character--error",
  }

  const $randomTextHolder = document.getElementById("random-text-holder");
  const $randomTextInput = document.getElementById("random-text-input");

  $randomTextHolder.innerHTML =
    new Array(CHARS_COUNT)
      .fill(null)
      .map(
        (_, i) => `<span class="${CharacterClasses.inactive}" data-idx=${i}></span>`
      );

  const $characters = Array.from(document.querySelectorAll(".character"));



  /**
   * @type {{randomTextValue: string}}
   */
  const Global = {
    randomTextValue: ""
  }

  /**
   * 
   * @param {number} length How many digits
   * @param {("alphaNumeric"|"alpha"|"numeric"|"alphaLower"|"alphaUpper")} characterSetName the set of characters to use
   * @returns {string}
   */
  function randomText(length, characterSetName) {
    const charSet = CharacterSets[characterSetName]();
    return new Array(length).fill(null).map(_ => charSet[Math.floor(Math.random() * charSet.length)]).join("");
  }

  function replace(str, sv, rv) {
    return Array.from(str).map(v => v === sv ? rv : v).join("");
  }

  $randomTextInput.addEventListener("input", (e) => {
    const text = replace(e.target.value, ' ', '_');
    if (text === Global.randomTextValue) {
      updateRandomText();
      e.target.value = "";
    } else {
      let i;
      let hasError = false;
      for (i = 0; i < Math.min(text.length, CHARS_COUNT); i++) {
        if (hasError) {
          $characters[i].className = CharacterClasses.error;
        } else {
          if (text[i] != Global.randomTextValue[i]) {
            hasError = true; i--;
          } else if (text[i] == Global.randomTextValue[i]) {
            $characters[i].className = CharacterClasses.success;
          }
        }
      }
      if (!hasError && i < CHARS_COUNT) {
        $characters[i].className = CharacterClasses.active;
        i++;
      }
      for (; i < CHARS_COUNT; i++) {
        $characters[i].className = CharacterClasses.inactive;
      }
    }
  });

  function updateRandomText() {
    Global.randomTextValue = randomText(CHARS_COUNT, "alphaLower");
    for (let i = 0; i < Global.randomTextValue.length; i++) {
      $characters[i].innerText = Global.randomTextValue[i];
      $characters[i].className = CharacterClasses.inactive;
    }
    $characters[0].className = CharacterClasses.active;
  }

  window.updateRandomText = updateRandomText;

  updateRandomText();

  $randomTextInput.focus();
}));