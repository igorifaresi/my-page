function setup() {
  // === Setup window logic ===
  {
    function setDraggableWindow(w) {
      let mousePos = {
        x: 0,
        y: 0,
      };

      const rect = w.getBoundingClientRect();

      let pos = {
        x: rect.left,
        y: rect.top,
      };

      w.querySelector(`[role="window-bar"]`).onmousedown = dragMouseDown;

      function dragMouseDown(e) {
        e.preventDefault();

        mousePos.x = e.clientX;
        mousePos.y = e.clientY;
        document.onmouseup = closeDragElement;

        document.onmousemove = elementDrag;
      }

      function elementDrag(e) {
        e.preventDefault();

        const increment = {
          x: e.clientX - mousePos.x,
          y: e.clientY - mousePos.y,
        };
        mousePos.x = e.clientX;
        mousePos.y = e.clientY;
        pos.x += increment.x;
        pos.y += increment.y;

        w.style.top = pos.y + "px";
        w.style.left = pos.x + "px";
        w.style.bottom = "unset";
      }

      function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
      }
    }

    document.querySelectorAll(`[role="window"]`).forEach((w) => {
      setDraggableWindow(w);
    });
  }

  // === Setup tab logic ===
  {
    const tabs = document.querySelectorAll("menu[role=tablist]");

    for (let i = 0; i < tabs.length; i++) {
      const tab = tabs[i];

      const tabButtons = tab.querySelectorAll("menu[role=tablist] > button");

      tabButtons.forEach((btn) =>
        btn.addEventListener("click", (e) => {
          e.preventDefault();

          tabButtons.forEach((button) => {
            if (
              button.getAttribute("aria-controls") ===
              e.target.getAttribute("aria-controls")
            ) {
              button.setAttribute("aria-selected", true);
              openTab(e, tab);
            } else {
              button.setAttribute("aria-selected", false);
            }
          });
        })
      );
    }

    function openTab(event, tab) {
      const articles = tab.parentNode.querySelectorAll('[role="tabpanel"]');
      articles.forEach((p) => {
        p.setAttribute("hidden", true);
      });
      const article = tab.parentNode.querySelector(
        `[role="tabpanel"]#${event.target.getAttribute("aria-controls")}`
      );
      article.removeAttribute("hidden");
    }
  }
}

document.addEventListener("DOMContentLoaded", setup);
