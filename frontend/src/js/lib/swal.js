import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export const toast = MySwal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
});

export const alertSuccess = (title, text) => {
    return MySwal.fire({
        icon: 'success',
        title,
        text,
        confirmButtonColor: '#4f46e5', // indigo-600
    });
};

export const alertError = (title, text) => {
    return MySwal.fire({
        icon: 'error',
        title,
        text,
        confirmButtonColor: '#4f46e5',
    });
};

export const confirmAction = (title, text, confirmButtonText = 'Yes, proceed') => {
    return MySwal.fire({
        title,
        text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#4f46e5',
        cancelButtonColor: '#ef4444', // rose-500
        confirmButtonText
    });
};

export default MySwal;
