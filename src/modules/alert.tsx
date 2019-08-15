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

export const createSuccessAlert = (channelId: string, config: AlertConfig) => {
  Swal.fire({
    title: 'Thank You!',
    type: 'info',
    confirmButtonText: 'Okay',
    position: 'top',
    allowOutsideClick: false,
    onClose() {
      window.open(`${process.env.REACT_APP_CONSOLE_URL}${channelId}`, "_blank");
    },
    ...config
  });
}