import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from '@mui/material'
import { FC, PropsWithChildren } from 'react'

interface Props {
  isOpen: boolean
  titulo: string
  texto: string
  disableScrollLock?: boolean
}

export const AlertDialog: FC<PropsWithChildren<Props>> = ({
  isOpen,
  titulo,
  texto,
  children,
  disableScrollLock,
}) => {
  return (
    <Dialog
      open={isOpen}
      disableScrollLock={disableScrollLock}
    >
      <DialogTitle sx={{ m: 1, p: 2 }}>{titulo}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Typography component={'span'}>{texto}</Typography>
        </DialogContentText>
      </DialogContent>
      <DialogActions>{children}</DialogActions>
    </Dialog>
  )
}
