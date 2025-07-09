// styles
import "./style.css";
// router
import { renderRouter } from "./route";
import { getClans } from "./api";
window.addEventListener("DOMContentLoaded", () => {
  renderRouter();
});
window.addEventListener('hashchange', renderRouter())