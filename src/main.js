// styles
import "./style.css";
// router
import { renderRouter } from "./route";
window.addEventListener("DOMContentLoaded", () => {
  renderRouter();
});
window.addEventListener('hashchange', renderRouter())