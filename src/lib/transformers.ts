export function transformConsultation(c: any) {
  return {
    id: c.id,
    patientId: c.patientId,
    visitDate: c.visitDate,
    chiefComplaint: c.chiefComplaint ?? "",
    symptoms: c.symptoms ?? "",
    examinationFindings: c.examinationFindings ?? "",
    diagnosis: c.diagnosis ?? "",
    doctorNotes: c.doctorNotes ?? "",
    investigations: c.investigations ?? "",
    procedures: c.procedures ?? "",
    referrals: c.referrals ?? "",
    foundationReferral: c.foundationReferral ?? false,
    requirements: c.requirements ?? "",
    followUpDate: c.followUpDate ?? "",
    followUpInstructions: c.followUpInstructions ?? "",
    doctorName: c.doctorName ?? "",
    vitals: {
      bpSystolic: c.bpSystolic ?? 120,
      bpDiastolic: c.bpDiastolic ?? 80,
      pulse: c.pulse ?? 72,
      weight: c.weight ?? 70,
      height: c.height ?? 170,
      bmi: c.bmi ?? 24.2,
      spo2: c.spo2 ?? 98,
    },
  };
}

export function transformPatient(p: any) {
  return {
    ...p,
    socioEconomic: {
      housingStatus: p.housingStatus ?? "Owned",
      houseType: p.houseType ?? "House",
      numberOfRooms: p.numberOfRooms ?? 0,
      monthlyRent: p.monthlyRent ?? 0,
      ownsLand: p.ownsLand ?? false,
      landAcres: p.landAcres ?? 0,
      monthlyElectricityBill: p.monthlyElectricityBill ?? 0,
      waterSource: p.waterSource ?? "Tap",
      toiletType: p.toiletType ?? "Flush",
      cookingFuel: p.cookingFuel ?? "Gas",
      monthlyHouseholdIncome: p.monthlyHouseholdIncome ?? 0,
      numberOfDependents: p.numberOfDependents ?? 0,
      numberOfEarningMembers: p.numberOfEarningMembers ?? 0,
      educationLevel: p.educationLevel ?? "None",
      employmentStatus: p.employmentStatus ?? "Unemployed",
      hasRefrigerator: p.hasRefrigerator ?? false,
      hasTelevision: p.hasTelevision ?? false,
      hasPersonalVehicle: p.hasPersonalVehicle ?? false,
      hasComputer: p.hasComputer ?? false,
      hasInternet: p.hasInternet ?? false,
      notes: p.socioNotes ?? "",
    },
  };
}
