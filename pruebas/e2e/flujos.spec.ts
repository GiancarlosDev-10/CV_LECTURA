import { expect, test } from "@playwright/test";
import { CLAVE_SEED, crearPostulanteTemporal, db, eliminarUsuario, idOferta, ingresar } from "./apoyo";

// CP-024: flujos de M1–M6 en producción. Cada perfil (navegador) usa sus propios datos temporales.

test.describe("M1 autenticación y control de acceso", () => {
  test("sin sesión, una página protegida lleva a ingresar", async ({ page }) => {
    await page.goto("/mis-postulaciones");
    await expect(page).toHaveURL(/\/ingresar/);
  });

  test("un postulante no puede entrar al área del reclutador", async ({ page }) => {
    await ingresar(page, "postulante1@example.com", CLAVE_SEED);
    await expect(page.getByRole("heading", { name: "Ofertas abiertas" })).toBeVisible();
    await page.goto("/reclutador");
    await expect(page).not.toHaveURL(/\/reclutador/);
  });
});

test.describe("M3 postulación y M6 privacidad", () => {
  test("postula con su CV, ve el avance y elimina sus datos", async ({ page }, info) => {
    const postulante = await crearPostulanteTemporal(info.project.name);
    try {
      const ofertaId = await idOferta("Desarrollador Full Stack Junior");
      await ingresar(page, postulante.email, postulante.clave);

      // M3: postular con consentimiento
      await page.goto(`/ofertas/${ofertaId}`);
      await page.waitForLoadState("networkidle");
      await page.setInputFiles('input[type="file"]', "dataset/pdf/cv-01-times-centrado.pdf");
      await expect(page.getByText("cv-01-times-centrado.pdf")).toBeVisible();
      await page.getByRole("checkbox").check();
      await page.getByRole("button", { name: "Enviar postulación" }).click();
      await expect(page).toHaveURL(/\/mis-postulaciones\?enviada=1/, { timeout: 60_000 });
      await expect(page.getByText("Postulación enviada")).toBeVisible();

      const { data: filas } = await db
        .from("postulaciones")
        .select("id, consentimiento_version, consentimiento_en")
        .eq("postulante_id", postulante.id);
      expect(filas).toHaveLength(1);
      expect(filas![0].consentimiento_version).toBeTruthy();
      expect(filas![0].consentimiento_en).toBeTruthy();

      // M6: "Eliminar mis datos" borra la postulación y el PDF
      await page.goto("/mis-postulaciones");
      await page.waitForLoadState("networkidle");
      page.once("dialog", (d) => d.accept());
      await page.getByRole("button", { name: "Eliminar mis datos" }).click();
      // Mientras borra, el botón dice "Eliminando…": se espera el efecto real en la BD
      await expect
        .poll(
          async () => (await db.from("postulaciones").select("id").eq("postulante_id", postulante.id)).data?.length,
          { timeout: 30_000 },
        )
        .toBe(0);
      const { data: archivos } = await db.storage.from("cvs").list(postulante.id);
      expect(archivos ?? []).toHaveLength(0);
    } finally {
      await eliminarUsuario(postulante.id);
    }
  });
});

test.describe("M2 ofertas, M5 ranking y registro de vistas", () => {
  test("el reclutador ve el ranking con la advertencia y abre una postulación", async ({ page }) => {
    await ingresar(page, "reclutador1@example.com", CLAVE_SEED);
    await expect(page.getByRole("heading", { name: "Mis ofertas" })).toBeVisible();

    const ofertaId = await idOferta("Desarrollador Full Stack Junior");
    await page.goto(`/reclutador/ofertas/${ofertaId}`);
    await expect(page.getByRole("heading", { name: "Ranking de postulantes" })).toBeVisible();
    await expect(page.getByText("El puntaje es un apoyo, no una decisión.")).toBeVisible();

    // RQ-SEG-05: abrir el detalle deja una fila en accesos_cv
    const inicio = new Date().toISOString();
    const enlace = page.locator('a[href^="/reclutador/postulaciones/"]').first();
    const href = await enlace.getAttribute("href");
    await page.goto(href!);
    await expect(page.getByText("Datos extraídos del CV")).toBeVisible();
    const postulacionId = href!.split("/").pop()!;
    await expect
      .poll(async () => {
        const { data } = await db
          .from("accesos_cv")
          .select("id")
          .eq("postulacion_id", postulacionId)
          .eq("accion", "ver_detalle")
          .gte("ocurrido_en", inicio);
        return data?.length ?? 0;
      })
      .toBeGreaterThan(0);
  });

  test("el reclutador publica una oferta y la cierra", async ({ page }, info) => {
    await ingresar(page, "reclutador1@example.com", CLAVE_SEED);
    await page.goto("/reclutador/ofertas/nueva");
    await page.waitForLoadState("networkidle");
    const titulo = `E2E ${info.project.name} ${Date.now()}`;
    await page.fill("#titulo", titulo);
    await page.fill("#descripcion", "Oferta creada por la prueba E2E (CP-024).");
    await page.fill("#obligatorias", "SQL, Excel");
    await page.getByRole("button", { name: "Publicar oferta" }).click();
    await expect(page.getByRole("heading", { name: titulo })).toBeVisible({ timeout: 30_000 });

    await page.getByRole("button", { name: "Cerrar oferta" }).click();
    await expect(page.getByRole("button", { name: "Reabrir oferta" })).toBeVisible({ timeout: 30_000 });
    const { data } = await db.from("ofertas").select("estado").eq("titulo", titulo).single();
    expect(data?.estado).toBe("cerrada");
  });
});
