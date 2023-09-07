import { Dialog, DialogTitle, DialogContent, Divider } from '@mui/material';

import AddEntryForm from "./AddEntryForm";
import { Diagnosis, InputEntry } from '../../types';

type Diagnoses = { [code: string]: Diagnosis };


interface Props {
  modalEntryOpen: boolean;
  onClose: () => void;
  onSubmit: (values: InputEntry) => void;
  error?: string;
  diagnoses: Diagnoses;
}

const AddEntryModal = ({ modalEntryOpen, onClose, onSubmit, diagnoses }: Props) => (
  <Dialog fullWidth={true} open={modalEntryOpen} onClose={() => onClose()}>
    <DialogTitle>Add a new patient</DialogTitle>
    <Divider />
    <DialogContent>
      <AddEntryForm onSubmit={onSubmit} onCancel={onClose} diagnoses={diagnoses}/>
    </DialogContent>
  </Dialog>
);

export default AddEntryModal;