import {
  Box,
  FormControl,
  FormControlLabel,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  Typography,
  alpha,
} from '@mui/material';
import { theme } from '@pagopa/mui-italia';
import { useContext, useEffect, useState } from 'react';
import { AxiosResponse } from 'axios';
import { useTranslation } from 'react-i18next';
import { RolesInformations } from '../../../components/RolesInformations';
import { fetchWithLogs } from '../../../lib/api-utils';
import { UserContext } from '../../../lib/context';
import { getFetchOutcome } from '../../../lib/error-utils';
import { ProductResource } from '../../../model/ProductResource';
import { OnboardingStepActions } from '../../../components/OnboardingStepActions';
import { StepperStepComponentProps } from '../../../../types';

export function StepSelectProduct({ back, forward }: StepperStepComponentProps) {
  const { setRequiredLogin } = useContext(UserContext);
  const { t } = useTranslation();
  const [products, setProducts] = useState<Array<ProductResource>>();
  const [selectedProduct, setSelectedProduct] = useState<ProductResource>();

  const getProducts = async () => {
    const getProductsRequest = await fetchWithLogs(
      {
        endpoint: 'ONBOARDING_GET_PRODUCTS',
      },
      {
        method: 'GET',
      },
      () => setRequiredLogin(true)
    );
    const outcome = getFetchOutcome(getProductsRequest);

    if (outcome === 'success') {
      const products = (getProductsRequest as AxiosResponse).data as Array<ProductResource>;
      const enabledAddUserProducts = products.filter(
        (p) =>
          p.id === 'prod-io' ||
          p.id === 'prod-pagopa' ||
          p.id === 'prod-interop' ||
          p.id === 'prod-pn'
      );
      console.log(enabledAddUserProducts);
      setProducts(enabledAddUserProducts);
    }
  };

  useEffect(() => {
    void getProducts();
  }, []);

  return (
    <Grid container item>
      <Grid container sx={{ display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
        <Grid item mb={1}>
          <Typography variant="h3" fontWeight="fontWeightBold">
            Aggiungi un nuovo <br /> Amministratore
          </Typography>
        </Grid>
        <Grid item mb={1}>
          <Typography variant="body1" fontWeight="fontWeightRegular">
            Indica per quale prodotto vuoi aggiungere un nuovo
            <br />
            Amministratore
          </Typography>
        </Grid>
        <Grid item mb={4}>
          <RolesInformations />
        </Grid>
      </Grid>
      <Grid container item sx={{ justifyContent: 'center' }}>
        <Paper
          elevation={8}
          sx={{ borderRadius: theme.spacing(2), p: 1, width: '480px', height: 'auto' }}
        >
          <Grid item px={3} pt={3}>
            <Typography sx={{ fontSize: '14px', fontWeight: 'fontWeightBold' }}>
              SELEZIONA IL PRODOTTO
            </Typography>
          </Grid>
          <Grid item py={1}>
            {products?.map((p, index) => (
              <Grid item key={index}>
                <FormControl sx={{ paddingLeft: 2 }}>
                  <RadioGroup
                    name="choose-product"
                    value={selectedProduct?.id}
                    onChange={(e) => {
                      const productSelected = products.find((p) => p.id === e.target.value);
                      setSelectedProduct(productSelected);
                    }}
                  >
                    <FormControlLabel
                      sx={{ pl: 1, py: 1.5, pr: 2 }}
                      value={p.id}
                      control={<Radio id={p.id} checked={selectedProduct?.id === p.id} />}
                      label={
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingLeft: 1,
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              position: 'relative',
                              width: '48px',
                              height: '48px',
                              backgroundColor: p.logoBgColor
                                ? p.logoBgColor
                                : theme.palette.background.paper,
                              boxSizing: 'border-box',
                              padding: theme.spacing(1),
                              borderRadius: theme.spacing(1),
                              '&:after': {
                                content: "''",
                                position: 'absolute',
                                left: 0,
                                right: 0,
                                top: 0,
                                bottom: 0,
                                boxShadow: p.logoBgColor
                                  ? `inset 0 0 0 1px ${alpha(theme.palette.common.black, 0.1)}`
                                  : `inset 0 0 0 1px ${theme.palette.divider}`,
                                borderRadius: 'inherit',
                              },
                            }}
                          >
                            <img
                              src={p.logo}
                              alt={`${p.title} logo`}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                                objectPosition: 'center',
                              }}
                            />
                          </Box>
                          <Box pl={1.5}>
                            <Typography
                              sx={{
                                fontWeight: 'fontWeightMedium',
                                fontSize: '18px',
                                color: theme.palette.text.primary,
                              }}
                            >
                              {p.title}
                            </Typography>
                          </Box>
                        </Box>
                      }
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
            ))}
          </Grid>
        </Paper>
        <Grid item xs={12} mt={2} mb={5}>
          <OnboardingStepActions
            back={{
              action: back,
              label: t('onboardingStep1.onboarding.onboardingStepActions.backAction'),
              disabled: false,
            }}
            forward={{
              action: forward,
              label: t('stepInstitutionType.confirmLabel'),
              disabled: !selectedProduct,
            }}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}