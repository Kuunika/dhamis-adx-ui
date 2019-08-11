import Swal from 'sweetalert2'

export type AlertConfig = {
  text?: string,
  html?: string
}

export const createErrorAlert = (config: AlertConfig) => {
  Swal.fire({
    title: 'Error!',
    type: 'error',
    confirmButtonText: 'Done',
    allowOutsideClick: false,
    position: 'top',
    ...config
  });
}

export const createSuccessAlert = (config: AlertConfig) => {
  Swal.fire({
    title: 'Success!',
    type: 'success',
    confirmButtonText: 'Done',
    position: 'top',
    allowOutsideClick: false,
    ...config
  });
}