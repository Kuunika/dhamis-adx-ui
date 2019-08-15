import Swal from 'sweetalert2'

export type AlertConfig = {
  text?: string,
  html?: string
}

export const createErrorAlert = (config: AlertConfig) => {
  Swal.fire({
    title: 'Error!',
    type: 'error',
    confirmButtonText: 'Okay',
    allowOutsideClick: false,
    position: 'top',
    ...config
  });
}

export const createSuccessAlert = (config: AlertConfig) => {
  Swal.fire({
    title: 'Thank You!',
    type: 'info',
    confirmButtonText: 'Okay',
    position: 'top',
    allowOutsideClick: false,
    ...config
  });
}