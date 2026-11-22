import { describe, expect, it } from "vitest";
import { aniosDeExperiencia, type Trabajo } from "./ExtractorCvOpenAi";

const HOY = new Date(2026, 10, 22); // noviembre de 2026

const trabajo = (parcial: Partial<Trabajo>): Trabajo => ({
  inicioAnio: null,
  inicioMes: null,
  actual: false,
  finAnio: null,
  finMes: null,
  ...parcial,
});

describe("aniosDeExperiencia", () => {
  it("suma los meses de todos los trabajos (fin − inicio)", () => {
    // cv-06: 6 + 12 + 72 meses = 7,5 años
    const trabajos = [
      trabajo({ inicioAnio: 2026, inicioMes: 3, finAnio: 2026, finMes: 9 }),
      trabajo({ inicioAnio: 2025, inicioMes: 3, finAnio: 2026, finMes: 3 }),
      trabajo({ inicioAnio: 2018, inicioMes: 9, finAnio: 2024, finMes: 9 }),
    ];
    expect(aniosDeExperiencia(trabajos, HOY)).toBe(7.5);
  });

  it("cuenta un trabajo actual hasta el mes de hoy", () => {
    // cv-15: 05/2025 – actualidad = 18 meses
    expect(aniosDeExperiencia([trabajo({ inicioAnio: 2025, inicioMes: 5, actual: true })], HOY)).toBe(1.5);
  });

  it("sin mes toma enero", () => {
    expect(aniosDeExperiencia([trabajo({ inicioAnio: 2019, finAnio: 2021 })], HOY)).toBe(2);
  });

  it("redondea a un decimal", () => {
    expect(aniosDeExperiencia([trabajo({ inicioAnio: 2025, inicioMes: 1, finAnio: 2025, finMes: 5 })], HOY)).toBe(0.3);
  });

  it("ignora trabajos sin fechas y no resta si el fin es anterior al inicio", () => {
    const trabajos = [
      trabajo({}),
      trabajo({ inicioAnio: 2024, inicioMes: 6, finAnio: 2023, finMes: 1 }),
      trabajo({ inicioAnio: 2024, inicioMes: 1, finAnio: 2025, finMes: 1 }),
    ];
    expect(aniosDeExperiencia(trabajos, HOY)).toBe(1);
  });

  it("devuelve null si no hay trabajos con fechas", () => {
    expect(aniosDeExperiencia([], HOY)).toBeNull();
    expect(aniosDeExperiencia([trabajo({ inicioAnio: 2024 })], HOY)).toBeNull();
  });
});
