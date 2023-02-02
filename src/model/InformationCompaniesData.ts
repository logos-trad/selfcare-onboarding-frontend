import { OnboardingFormData } from './OnboardingFormData';

export type CompanyInformationsDto = {
  // Luogo di iscrizione al Registro delle Imprese
  businessRegisterPlace?: string;
  // codice REA
  rea?: string;
  // capitale sociale
  shareCapital?: string;
};

export const companyInformationsDto2pspDataRequest = (billingData: OnboardingFormData): CompanyInformationsDto => ({
  businessRegisterPlace: billingData.businessRegisterPlace,
    rea: billingData.rea,
    shareCapital: billingData.shareCapital
});