import clsx from 'clsx';
import styles from './Modal.module.scss'
function Modal({type='default'}) {
    return ( 
        <div className={clsx(styles.modal, styles[type])}> </div>
     );
}

export default Modal;