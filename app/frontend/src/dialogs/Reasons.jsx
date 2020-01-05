import React, {useCallback} from 'react';
import {useSelector} from 'react-redux';
import styled from 'styled-components';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';


const RTLListItemText = styled(ListItemText)`
  text-align: right;
`;


export const ReasonsDialog = ({onClose, selectedValue, open}) => {
  const reasons = useSelector((state) => state.general.reasons);
  const handleClose = useCallback(() => onClose(selectedValue || reasons[0]), [onClose, selectedValue]);
  const handleListItemClick = useCallback((item) => onClose(item), [onClose]);

  return (
    <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title"
      open={open}>
      <DialogTitle id="simple-dialog-title">Set Missing Reason</DialogTitle>
      <List>
        {reasons.map((reason) => (
          <ListItem button onClick={() => handleListItemClick(reason)}
            key={reason}>
            <RTLListItemText primary={reason}/>
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
};

export default ReasonsDialog;
