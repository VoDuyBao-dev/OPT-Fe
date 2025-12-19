import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './Button.module.scss';

/**
 * Button component với khả năng tái sử dụng cao
 * 
 * @param {string} variant - Loại button: 'primary', 'secondary', 'outline', 'ghost', 'danger'
 * @param {string} size - Kích thước: 'small', 'medium', 'large'
 * @param {boolean} disabled - Vô hiệu hóa button
 * @param {boolean} loading - Hiển thị loading state
 * @param {boolean} fullWidth - Button chiếm full width
 * @param {object} leftIcon - Icon bên trái (FontAwesome icon)
 * @param {object} rightIcon - Icon bên phải (FontAwesome icon)
 * @param {string} type - HTML button type: 'button', 'submit', 'reset'
 * @param {function} onClick - Click handler
 * @param {string} className - Custom CSS class
 * @param {node} children - Nội dung button
 */
const Button = forwardRef(({
    variant = 'primary',
    size = 'medium',
    disabled = false,
    loading = false,
    fullWidth = false,
    leftIcon,
    rightIcon,
    type = 'button',
    onClick,
    className,
    children,
    ...rest
}, ref) => {
    const buttonClass = clsx(
        styles.btn,
        styles[`btn--${variant}`],
        styles[`btn--${size}`],
        {
            [styles['btn--disabled']]: disabled || loading,
            [styles['btn--loading']]: loading,
            [styles['btn--fullWidth']]: fullWidth,
        },
        className
    );

    const handleClick = (e) => {
        if (disabled || loading) {
            e.preventDefault();
            return;
        }
        onClick?.(e);
    };

    return (
        <button
            ref={ref}
            type={type}
            className={buttonClass}
            onClick={handleClick}
            disabled={disabled || loading}
            aria-disabled={disabled || loading}
            aria-busy={loading}
            {...rest}
        >
            {loading && (
                <span className={styles.spinner} aria-label="Loading">
                    <span className={styles.spinnerIcon}></span>
                </span>
            )}
            
            {!loading && leftIcon && (
                <span className={styles.iconLeft}>
                    <FontAwesomeIcon icon={leftIcon} />
                </span>
            )}
            
            {children && <span className={styles.content}>{children}</span>}
            
            {!loading && rightIcon && (
                <span className={styles.iconRight}>
                    <FontAwesomeIcon icon={rightIcon} />
                </span>
            )}
        </button>
    );
});

Button.displayName = 'Button';

Button.propTypes = {
    variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'ghost', 'danger']),
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    disabled: PropTypes.bool,
    loading: PropTypes.bool,
    fullWidth: PropTypes.bool,
    leftIcon: PropTypes.object,
    rightIcon: PropTypes.object,
    type: PropTypes.oneOf(['button', 'submit', 'reset']),
    onClick: PropTypes.func,
    className: PropTypes.string,
    children: PropTypes.node,
};

export default Button;