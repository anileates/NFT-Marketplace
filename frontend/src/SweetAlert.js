import 'sweetalert2/dist/sweetalert2.min.css';
import Swal from 'sweetalert2'

const mixinOptions = {
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
}

export const Toast = Swal.mixin(mixinOptions)