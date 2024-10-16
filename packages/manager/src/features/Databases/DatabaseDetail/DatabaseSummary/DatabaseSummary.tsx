import Grid from '@mui/material/Unstable_Grid2';
import * as React from 'react';

import { Divider } from 'src/components/Divider';
import { Link } from 'src/components/Link';
import { Paper } from 'src/components/Paper';
import { Typography } from 'src/components/Typography';

import AccessControls from '../AccessControls';
import ClusterConfiguration from './DatabaseSummaryClusterConfiguration';
import ConnectionDetails from './DatabaseSummaryConnectionDetails';

import type { Database } from '@linode/api-v4/lib/databases/types';

interface Props {
  database: Database;
  disabled?: boolean;
}

export const DatabaseSummary: React.FC<Props> = (props) => {
  const { database, disabled } = props;

  const description = (
    <>
      <Typography>
        Add IPv4 addresses or ranges that should be authorized to access this
        cluster. All other public and private connections are denied.{' '}
        <Link to="https://techdocs.akamai.com/cloud-computing/docs/manage-access-controls">
          Learn more
        </Link>
        .
      </Typography>
      <Typography style={{ marginTop: 12 }}>
        You can add or modify access controls after your database cluster is
        active.
      </Typography>
    </>
  );

  return (
    <Paper>
      <Grid container spacing={2}>
        <Grid md={4} sm={12}>
          <ClusterConfiguration database={database} />
        </Grid>
        <Grid md={8} sm={12}>
          <ConnectionDetails database={database} />
        </Grid>
      </Grid>
      <Divider spacingBottom={16} spacingTop={28} />
      <AccessControls
        database={database}
        description={description}
        disabled={disabled}
      />
    </Paper>
  );
};

export default DatabaseSummary;
