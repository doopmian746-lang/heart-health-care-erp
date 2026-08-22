export function transformConsultation(c: any) {
  return {
    ...c,
    vitals: {
      bpSystolic: c.bpSystolic ?? 120,
      bpDiastolic: c.bpDiastolic ?? 80,
      pulse: c.pulse ?? 72,
      weight: c.weight ?? 70,
      height: c.height ?? 170,
      bmi: c.bmi ?? 24.2,
      spo2: c.spo2 ?? 98,
    },
    bpSystolic: undefined,
    bpDiastolic: undefined,
    pulse: c.pulse,
    weight: c.weight,
    height: c.height,
    bmi: c.bmi,
    spo2: c.spo2,
  };
}
