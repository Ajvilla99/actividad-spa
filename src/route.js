import { onLogin } from "./api";
import { auth } from "./auth";

export const renderRouter = () => {
  

  const route = (e) => {
    // Evita que la etiqueta <a></a> realice su comportamiento predeterminado
    e.preventDefault();
    // [HISTORY API]  Api del navegador llamando pushState
    window.history.pushState({}, "", e.target.href);
    handleLocation();
  };

  const routes = {
    404: "/src/views/",
    "#/": "/src/views/Home.html",
    "#/courses": "/src/views/CoursesPage.html",
    // "#/": "/src/views/Home.html",
    // "#/": "/src/views/Home.html",
    "#/login": "/src/views/LoginForm.html",
    "#/register": "/src/views/RegisterForm.html",
  };

  const protectedRoutes = ["/"];

  const handleLocation = async () => {
    const isAuth = auth.isAuthenticated();
    let path = window.location.hash || "#/";

    // Redirigir si no está autenticado y trata de acceder a rutas protegidas
    // 🔐 Si NO está autenticado y no está en login/register → redirige a login
    if (!isAuth && path !== "#/login" && path !== "#/register") {
      path = "#/login";
      window.history.replaceState({}, "", path);
    }

    // ✅ Si está autenticado y está en login o register → redirige a home
    if (isAuth && (path === "#/login" || path === "#/register")) {
      path = "#/";
      window.history.replaceState({}, "", path);
    }

    const route = routes[path] || routes[404];

    try {
      const html = await fetch(route).then((data) => data.text());
      document.getElementById("app").innerHTML = html;

      document.body.addEventListener("click", (e) => {
        if (e.target.matches("a")) {
          e.preventDefault();
          window.history.pushState({}, "", e.target.href);
          handleLocation();
        }
      });
    } catch (err) {
      console.error("Ruta inválida o error de carga:", err);
      document.getElementById("app").innerHTML =
        "<h1>Error cargando la vista</h1>";
      return;
    }

    // Lógica especial para login
    if (path === "#/login") {
      const showpass = document.querySelector("#show_pass");
      const inputPass = document.querySelector("#password");
      showpass?.addEventListener("click", () => {
        const att = showpass.firstElementChild.getAttribute("name");
        if (att === "low-vision") {
          showpass.firstElementChild.setAttribute("name", "show-alt");
          inputPass.type = "text";
        } else if (att === "show-alt") {
          showpass.firstElementChild.setAttribute("name", "low-vision");
          inputPass.type = "password";
        }
      });

      const form = document.querySelector("#login_form");
      form?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const dataForm = new FormData(form);
        const username = dataForm.get("username_or_email");
        const password = dataForm.get("password");

        const success = await onLogin(username, password);

        if (success) {
          window.history.pushState({}, "", "#/");
          handleLocation();
        } else {
          alert("Credenciales incorrectas");
        }
      });
    }
  };

  window.document.querySelectorAll("a").forEach((a) => {
    a.onclick = route;
  });

  window.onpopstate = handleLocation;
  window.route = route;

  handleLocation();
};
