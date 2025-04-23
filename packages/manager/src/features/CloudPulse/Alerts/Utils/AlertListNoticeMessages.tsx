import { List, ListItem, Notice, Typography } from '@linode/ui';
import React from 'react';

import type { NoticeProps } from '@linode/ui';

interface AlertListNoticeMessagesProps extends NoticeProps {
  /**
   * The error message to display, potentially containing multiple errors
   */
  errorMessage: string;
  /**
   * The separator used to split the error message into individual errors
   */
  separator?: string;
}

export const AlertListNoticeMessages = (
  props: AlertListNoticeMessagesProps
) => {
  const { errorMessage, separator, style, sx, variant } = props;
  const errorList = separator ? errorMessage.split(separator) : [errorMessage];

  if (errorList.length > 1) {
    return (
      <Notice data-alert-notice style={style} sx={sx} variant={variant}>
        <List
          sx={(theme) => ({
            listStyleType: 'disc',
            pl: theme.spacingFunction(8),
          })}
        >
          {errorList.map((error, index) => (
            <ListItem
              data-testid="alert_notice_message_list"
              key={index}
              sx={(theme) => ({
                display: 'list-item',
                pl: theme.spacingFunction(4),
                py: theme.spacingFunction(4),
              })}
            >
              {error}
            </ListItem>
          ))}
        </List>
      </Notice>
    );
  }

  return (
    <Notice data-alert-notice style={style} sx={sx} variant={variant}>
      <Typography
        data-testid="alert_message_notice"
        sx={(theme) => ({
          fontFamily: theme.tokens.font.FontWeight.Extrabold,
        })}
      >
        {errorList[0]}
      </Typography>
    </Notice>
  );
};
