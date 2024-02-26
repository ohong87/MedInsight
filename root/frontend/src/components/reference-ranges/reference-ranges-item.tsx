import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

export interface BloodValueDetailsProps {
  title: string;
  lowReference: string;
  highReference: string;
  graphBars: Array<{
    bgcolor: string;
    height: string;
    zIndex?: number;
    marginBottom?: string;
  }>;
}

const Container = styled(Paper)(({ theme }) => ({
  borderRadius: 8,
  backgroundColor: '#fff',
  display: 'flex',
  flexGrow: 1,
  justifyContent: 'space-between',
  gap: 20,
  width: '100%',
  padding: theme.spacing(2, 3),
  marginTop: theme.spacing(5),
  [theme.breakpoints.down('md')]: {
    marginTop: theme.spacing(5),
    padding: theme.spacing(2),
  },
}));

const ContentSection = styled(Box)(({ theme }) => ({
  alignSelf: 'start',
  display: 'flex',
  flexDirection: 'column',
  fontSize: '14px',
  color: '#2a2e33',
  fontWeight: 500,
  lineHeight: '114%',
  [theme.breakpoints.down('md')]: {
    whiteSpace: 'initial',
  },
}));

const ReferenceValue = styled(Box)(({ theme }) => ({
  fontFamily: 'DM Sans, sans-serif',
  borderRadius: 4,
  border: '1px solid #e1e7ec',
  marginTop: theme.spacing(3.5),
  display: 'flex',
  justifyContent: 'center',
  padding: theme.spacing(1.25),
}));

const GraphSection = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
});

const GraphBackground = styled(Box)({
  backgroundColor: '#e0e0e0',
  display: 'flex',
  paddingBottom: '20px',
  flexDirection: 'column',
});

const Bar = styled(Box)<{ bgcolor: string; zIndex?: number; height: string; marginBottom?: string }>(({ bgcolor, zIndex = 1, height, marginBottom = '0' }) => ({
  backgroundColor: bgcolor,
  zIndex,
  height,
  marginBottom,
}));

export const ReferenceRangesItem: React.FC<BloodValueDetailsProps> = ({
  title,
  lowReference,
  highReference,
  graphBars,
}) => {
  return (
    <Container elevation={3}>
      <ContentSection>
        <Typography variant="h6" component="h3" color="#74828f" fontWeight={700} lineHeight="157%">
          {title}
        </Typography>
        <ReferenceValue>{lowReference}</ReferenceValue>
        <ReferenceValue>{highReference}</ReferenceValue>
      </ContentSection>
      <GraphSection>
        <GraphBackground>
          {graphBars.map((bar, index) => (
            <Bar
              key={index}
              bgcolor={bar.bgcolor}
              height={bar.height}
              zIndex={bar.zIndex}
              marginBottom={bar.marginBottom}
            />
          ))}
        </GraphBackground>
      </GraphSection>
    </Container>
  );
};