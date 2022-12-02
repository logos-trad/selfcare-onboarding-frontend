import { Grid, Link, Typography, useTheme, Paper } from '@mui/material';
import { Box } from '@mui/system';
import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { useTranslation, Trans } from 'react-i18next';
import { PartyAccountItemButton } from '@pagopa/mui-italia/dist/components/PartyAccountItemButton';
import { roleLabels } from '@pagopa/selfcare-common-frontend/utils/constants';
import { Party, SelfcareParty, StepperStepComponentProps } from '../../../../types';
import { OnboardingStepActions } from '../../../components/OnboardingStepActions';
import { useHistoryState } from '../../../components/useHistoryState';
import PartySelectionSearchInput from './PartySelectionSearchInput';

type Props = {
  parties: Array<SelfcareParty>;
} & StepperStepComponentProps;

const CustomBox = styled(Box)({
  '&::-webkit-scrollbar': {
    width: 4,
  },
  '&::-webkit-scrollbar-track': {
    boxShadow: `inset 10px 10px  #E6E9F2`,
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '#0073E6',
    borderRadius: '16px',
  },
  overflowY: 'auto',
  overflowX: 'hidden',
});
const verifyPartyFilter = (party: Party, filter: string) =>
  party.description.toUpperCase().indexOf(filter.toUpperCase()) >= 0;
export function SubProductStepSelectUserParty({ forward, parties }: Props) {
  const partyExternalIdByQuery = new URLSearchParams(window.location.search).get('partyExternalId');

  const { t } = useTranslation();

  const theme = useTheme();

  const [selected, setSelected, setSelectedHistory] = useHistoryState<SelfcareParty | null>(
    'SubProductStepSelectUserParty',
    null
  );
  const onForwardAction = () => {
    setSelectedHistory(selected);
    forward(selected as Party);
  };
  const bodyTitle = t('onBoardingSubProduct.selectUserPartyStep.title');

  useEffect(() => {
    if (partyExternalIdByQuery) {
      const selectedParty = parties.find((p) => p.externalId === partyExternalIdByQuery);
      if (selectedParty) {
        setSelected(selectedParty);
      } else {
        forward();
      }
    }
  }, []);

  // callback of previous useEffect
  useEffect(() => {
    if (partyExternalIdByQuery && selected) {
      onForwardAction();
    }
  }, [selected]);

  useEffect(() => {
    if (parties.length === 1) {
      setSelected(parties[0]);
    }
  }, []);

  const [input, setInput] = useState('');
  const [filteredParties, setFilteredParties] = useState<Array<SelfcareParty>>(parties);
  const [selectedParty, setSelectedParty] = useState<Party | null>(
    parties.length === 1 ? parties[0] : null
  );
  const onPartySelectionChange = (selectedParty: Party | null) => {
    setSelectedParty(selectedParty);
  };

  const onFilterChange = (value: string) => {
    setInput(value);
    if (!value) {
      setFilteredParties(parties);
    } else {
      setFilteredParties(parties?.filter((e) => verifyPartyFilter(e, value)));
    }
    if (value && selectedParty && !verifyPartyFilter(selectedParty, value)) {
      onPartySelectionChange(null);
    }
  };

  const moreThan3Parties = parties.length > 3;

  return (
    <Grid container direction="column" sx={{ minWidth: '480px' }}>
      <Grid container item justifyContent="center">
        <Grid item xs={12}>
          <Typography variant="h3" component="h2" align="center" color={theme.palette.text.primary}>
            {bodyTitle}
          </Typography>
        </Grid>
      </Grid>

      <Grid container item justifyContent="center" mt={1}>
        <Grid item xs={12}>
          <Typography variant="body1" align="center" color={theme.palette.text.primary}>
            <Trans i18nKey="onBoardingSubProduct.selectUserPartyStep.subTitle">
              Seleziona l&apos;ente per il quale stai richiedendo la sottoscrizione <br />
              all&apos;offerta Premium
            </Trans>
          </Typography>
        </Grid>
      </Grid>

      <Grid container item textAlign="center" justifyContent="center" mt={4} mb={2}>
        <Paper elevation={8} sx={{ borderRadius: theme.spacing(2), p: 2, minWidth: '480px' }}>
          {moreThan3Parties && (
            <PartySelectionSearchInput
              clearField={() => onFilterChange('')}
              input={input}
              onChange={(e) => onFilterChange(e.target.value)}
              iconColor={'#17324D'}
              label={t('onBoardingSubProduct.selectUserPartyStep.searchLabel')}
            />
          )}
          {filteredParties.length >= 1 ? (
            <CustomBox
              maxHeight={'250px'}
              sx={{
                pointerEvents: parties.length !== 1 ? 'auto' : 'none',
              }}
            >
              {filteredParties.map((p) => (
                <Grid
                  key={p.externalId}
                  aria-label={p.description}
                  sx={{
                    width: '480px',
                    fontWeight: 700,
                    fontSize: '18px',
                    height: '80px',
                    display: 'flex',
                    textAlign: 'initial',
                    pointerEvents: parties.length !== 1 ? 'auto' : 'none',
                  }}
                >
                  <PartyAccountItemButton
                    aria-label={p.description}
                    partyName={p.description}
                    partyRole={p.userRole ? t(roleLabels[p?.userRole].longLabelKey) : ''}
                    image={p.urlLogo}
                    action={() => setSelected(p)}
                    selectedItem={parties.length !== 1 ? selected?.id === p.id : false}
                    maxCharactersNumberMultiLine={20}
                  />
                </Grid>
              ))}
            </CustomBox>
          ) : (
            t('onBoardingSubProduct.selectUserPartyStep.notFoundResults')
          )}
        </Paper>
      </Grid>

      <Grid container item justifyContent="center">
        <Grid item xs={6}>
          <Box
            sx={{
              fontSize: '14px',
              lineHeight: '24px',
              textAlign: 'center',
            }}
          >
            <Typography
              aria-label="Non lo trovi? Registra un nuovo ente"
              sx={{
                textAlign: 'center',
              }}
              variant="caption"
              color={theme.palette.text.primary}
            >
              <Trans i18nKey="onBoardingSubProduct.selectUserPartyStep.helperLink">
                Non lo trovi?
                <Link sx={{ cursor: 'pointer' }} onClick={() => forward()}>
                  Registra un nuovo ente
                </Link>
              </Trans>
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Grid item mt={3}>
        <OnboardingStepActions
          forward={{
            action: onForwardAction,
            label: t('onBoardingSubProduct.selectUserPartyStep.confirmButton'),
            disabled: parties.length > 1 && (selected === undefined || selected === null),
          }}
        />
      </Grid>
    </Grid>
  );
}
