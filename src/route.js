import { onLogin, getClans } from "./api";
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
    "#/clans": "/src/views/ClansPage.html",
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

    // Logica especial para Home
    if (path === "#/") {
      const boxClans = document.querySelector("#box_grid_clans");
      const clans = await getClans();

      boxClans.innerHTML = "";

      clans.forEach((clan) => {
        const card = document.createElement("div");
        const name = clan.name.toLowerCase();
        const text = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        card.className = `w-full rounded overflow-hidden bg-${clan.color}-100 hover:bg-${clan.color}`;
        card.innerHTML = `
            <div
            class="w-full p-3 bg-${clan.color}-500 flex items-center justify-center text-${clan.color}-100"
          >
            [IMAGEN CURSO]
          </div>
          <div class="p-3 flex flex-col gap-2.5 justify-between">
            <h3 class="font-bold text-${clan.color}-800">${clan.name}</h3>
            <p class="text-sm text-justify line-clamp-2">
              ${clan.description}
            </p>
            <a
              href="#/${text}"
              class="w-fit p-3 bg-${clan.color}-600 text-${clan.color}-100 rounded-sm cursor-pointer hover:bg-${clan.color}-700 transition-all"
            >
              ver clan
            </a>
          </div>
        `;
        boxClans.appendChild(card);
      });
    }

    if (path === "#/clans") {
      const tbody = document.querySelector("#tbody");
      const clans = await getClans();
      tbody.innerHTML = "";

      clans.forEach((clan, i) => {
        const name = clan.name.toLowerCase();
        const text = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const tr = document.createElement("tr");
        tr.className = ``;
        tr.innerHTML = `
            <td class="p-2.5">${i}</td>
            <td class="p-2.5">${clan.name}</td>
            <td class="p-2.5 text-wrap">${clan.schedule}</td>
            <td class="p-2.5">${clan.coders.length}/50</td>
            <td class="p-2.5 hidden md:block">
              <div class="w-14 h-8 box-border bg-${clan.color}-500"></div>
            </td>
            <td class="p-2.5">${clan.instructor}</td>
            <td class="p-2.5 hidden md:flex items-center">
              <button 
                id=""
                onclick=""
                title="Editar"
                class="cursor-pointer p-2 md:p-1.5 text-sm flex items-center gap-1 rounded-l bg-amber-200 hover:bg-amber-300 text-amber-900">
                  <i class='bx bxs-pencil' ></i>
                  <span class="hidden md:block">
                    Editar
                  </span>
              </button>
              <button 
                id="" 
                onclick=""
                title="Eliminar"
                class="cursor-pointer p-2 md:p-1.5 text-sm flex items-center gap-1 bg-red-200 hover:bg-red-300 text-red-900">
                  <i class='bx bxs-trash' ></i>
                  <span class="hidden md:block">
                    Eliminar
                  </span>
              </button>
              <a 
                href="#/${text}" 
                id="" 
                onclick=""
                title="Ver clan"
                class="cursor-pointer p-2 md:p-1.5 text-sm flex items-center gap-1 rounded-r bg-blue-200 hover:bg-blue-300 text-bg-blue-800">
                  <i class='bx bx-show' ></i>
                  <span class="hidden md:block">
                    Ver
                  </span>
              </a>
            </td>
        `;
        tbody.appendChild(tr);
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
