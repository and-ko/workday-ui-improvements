// ==UserScript==
// @name         Workday UI improvements
// @namespace    http://tampermonkey.net/
// @version      2024-08-22
// @description  Workday UI improvements
// @author       Andrei K
// @match        https://wd12.myworkday.com/logic/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=myworkday.com
// @grant GM_addStyle
// @grant GM_setValue
// @grant GM_getValue
// ==/UserScript==

(function () {
  ("use strict");

  /* Fix inputs alignment on a time entry popup */
  const CSS = `
    .WP2F>.WG1F>.WK0F>.WM0F.WP-F.WO0F { width: 65px }
    `;
  GM_addStyle(CSS);

  const autofill_form_css = `
    .button-53 {
      background-color: #3DD1E7;
      border: 0 solid #E5E7EB;
      box-sizing: border-box;
      color: #000000;
      display: flex;
      font-family: ui-sans-serif,system-ui,-apple-system,system-ui,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto
      Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";
      font-size: 1.2rem;
      font-weight: 700;
      justify-content: center;
      line-height: 1.75rem;
      padding: .75rem 1.65rem;
      position: relative;
      text-align: center;
      text-decoration: none #000000 solid;
      text-decoration-thickness: auto;
      width: 100%;
      max-width: 460px;
      position: relative;
      cursor: pointer;
      transform: rotate(-1deg);
      user-select: none;
      -webkit-user-select: none;
      touch-action: manipulation;
    }

    .button-53:focus {
      outline: 0;
    }

    .button-53:after {
      content: '';
      position: absolute;
      border: 1px solid #000000;
      bottom: 4px;
      left: 4px;
      width: calc(100% - 1px);
      height: calc(100% - 1px);
    }

    .button-53:hover:after {
      bottom: 2px;
      left: 2px;
    }

    .button-53:active {
      background: yellow;
      transform: rotate(0deg);
    }

    .button-53:active:after {
      bottom:0;
      left:0;
    }

    .autofill-wrap {
      position: absolute;
      z-index:9999;
      top: 10px;
      right: 20px;
      width:200px;
      border: solid 1px #000;
      box-shadow: 0 0 2px 0 rgba(0,0,0,0.75);
    }

    .autofill-form {
      background: #fff;
      padding: 10px;
    }

    .autofill-nav {
      height:15px;
      padding: 5px 0;
      text-align:center;
      background: #eee;
      border-bottom: solid 1px #000;
      cursor: move;
    }

    .autofill-nav a {
      display: inline-block;
      margin: -5px 0 0 0;
      width:25px;
      height:25px;
      float:right;
      cursor: default;
      text-align:center;
      font-size:20px;
    }

    .autofill-nav a:hover {
      background: #ccc;
    }

    .autofill-form .form-row {
      margin-bottom: 20px;
    }

    .autofill-form label {
      display:inline-block;
      margin: 0 10px 0 0 ;
    }

    .autofill-form .autofill-note {
      width: 100%;
      height:5em;
      vertical-align:top;
    }
    `;
  GM_addStyle(autofill_form_css);

  const createForm = () => {
    const template = `
      <div class="autofill-wrap" draggable="true" id="autofill-wrap">
        <nav class="autofill-nav" id="autofill-nav">
          Timesheet autofill
          <a id="minimize" title="Minimize">_</a>
        </nav>
        <form class="autofill-form" id="autofill-form">
          <div class="form-row">
           <p>Actions&nbsp;&rarr;&nbsp;Enter time by&nbsp;type&nbsp;&rarr; Comments 0 of 5</p>
          </div>
          <div class="form-row">
            <label for="autofill-note">Comments:</label>
            <textarea id="autofill-note" class="autofill-note"></textarea>
          </div>
          <button id="autofill-button" class="autofill-button-1 button-53">Autofill Timesheet</button>
        </form>
      </div>
    `;

    const autofill_block = document.createElement("div");
    autofill_block.innerHTML = template;
    return autofill_block;
  };

  const autofill = async () => {
    const note = document.getElementById("autofill-note").value;

    // Click on li element containing the fake textarea to load the actual textareas
    try {
      const li = document.querySelector(".wd-EditGrid-disabled-widget").closest("[data-automation-id='formItem']");
      li.dispatchEvent(new PointerEvent("click", { bubbles: true, cancelable: true }));
    } catch {
      console.log("Autofill: no fake textarea elements available");
    }

    const noteFields = document.querySelectorAll("[class*='gwt-TextArea']:not([disabled])");

    for (let input of noteFields) {
      input.value = note;
    }
    await GM.setValue("autofill_note", note);
  };

  document.body.appendChild(createForm());

  const button = document.querySelector("#autofill-button");
  button.onclick = function () {
    autofill();
    return false;
  };

  // Toggle minimize
  const hidebutton = document.getElementById("minimize");
  hidebutton.addEventListener("click", toggleMinimize, false);

  function toggleMinimize(e) {
    const content = document.getElementById("autofill-form");
    content.style.display = content.style.display === "none" ? "block" : "none";
  }

  // Make the form draggable
  const object = document.getElementById("autofill-wrap");
  const dragarea = document.getElementById("autofill-nav");
  let initX, initY, firstX, firstY;

  dragarea.addEventListener(
    "mousedown",
    function (e) {
      e.preventDefault();
      initX = object.offsetLeft;
      initY = object.offsetTop;
      firstX = e.pageX;
      firstY = e.pageY;

      object.addEventListener("mousemove", dragIt, false);

      window.addEventListener(
        "mouseup",
        function () {
          object.removeEventListener("mousemove", dragIt, false);
        },
        false
      );
    },
    false
  );

  function dragIt(e) {
    this.style.left = initX + e.pageX - firstX + "px";
    this.style.top = initY + e.pageY - firstY + "px";
  }

  // Select the time input on focus when entering bulk time
  // To avoid manual deletion of pre-populated '0'
  document.body.addEventListener("click", function (event) {
    if (event.target.classList.contains("gwt-TextBox")) {
      event.target.select();
    }
  });
})();

(async () => {
  const note = await GM.getValue("autofill_note", "Working on my project");
  document.querySelector("#autofill-note").value = note;

  const hours = 8;
  document.querySelector("#autofill-hours").value = hours;


  })();
