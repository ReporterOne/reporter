import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import styled from 'styled-components';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import {DialogContent} from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';


const StyledForm = styled(FormControl)`
  width: 100%;
`;


export const SettingsDialog = ({onClose, selectedMador, open}) => {
  const madors = useSelector((state) => state.madors.all);

  const [_selectedMador, setSelectedMador] = useState(null);

  useEffect(() => {
    setSelectedMador(selectedMador);
  }, [selectedMador]);

  return (
    <Dialog aria-labelledby="simple-dialog-title"
      scroll={'paper'} open={open}>
      <DialogTitle id="simple-dialog-title">Hierarchy Settings</DialogTitle>
      <DialogContent dividers={true}>
        <StyledForm>
          <InputLabel id="select-mador-label">Selected Mador</InputLabel>
          <Select labelId="select-mador-label" value={_selectedMador} onChange={(e) => setSelectedMador(e.target.value)}>
            {
              madors.map((mador, index) => <MenuItem value={mador.name} key={index}>{mador.name}</MenuItem>)
            }
          </Select>
        </StyledForm>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => {
          onClose({
            selectedMador: _selectedMador,
          });
        }} color="primary">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SettingsDialog;
