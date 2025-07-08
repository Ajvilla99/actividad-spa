import { onLogin } from "./api";

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
    "/": "/src/views/Home.html",
    "/login": "/src/views/LoginForm.html",
    "/register": "/src/views/RegisterForm.html",
  };

  // const protectedRoutes = ["/"];

  const handleLocation = async () => {
    const path = window.location.pathname;
    // Para ir a la ruta deseada o en su defecto la 404 si no existe
    const route = routes[path] || routes[404];
    // Llamada de busqueda
    const html = await fetch(route).then((data) => data.text());
    document.getElementById("app").innerHTML = html;

    // ✅ Aquí sí sirve porque ya cargó la vista
    document.querySelectorAll("a").forEach((a) => {
      a.onclick = route;
    });

    if (path === "/login") {
      const a = document.querySelector("#toRegister");

      const form = document.querySelector("#login_form");
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const dataForm = new FormData(form);
        const username = dataForm.get("username_or_email");
        const password = dataForm.get("password");
        onLogin(username, password);
      });
    }
  };

  // window.document.querySelectorAll("a").forEach((a) => {
  //   a.onclick = route;
  // });

  window.onpopstate = handleLocation;
  window.route = route;

  handleLocation();
};
