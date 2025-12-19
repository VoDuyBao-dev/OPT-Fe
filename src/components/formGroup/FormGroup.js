import { useId } from 'react';
import clsx from 'clsx';
import styles from './FormGroup.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function FormGroup({
    label,
    name,
    id,
    type = 'text',
    value,
    onChange,
    placeholder,
    required = false,
    error,
    className,
    autoComplete,
    options,
    multiple = false,
    accept, // thêm
    icon, // FontAwesome icon
    rows = 3, // number of rows for textarea
    disabled = false
}) {
    const autoId = useId();
    const inputId = id || `${name || 'input'}-${autoId}`;

    // Xử lý khi chọn option trong multiple select
    const handleMultipleSelect = (selectedValue) => {
        if (disabled) return;
        const currentValues = Array.isArray(value) ? value : [];
        if (!currentValues.includes(selectedValue)) {
            const newValues = [...currentValues, selectedValue];
            onChange({ target: { name, value: newValues } });
        }
    };

    // Xử lý khi xóa một giá trị đã chọn
    const handleRemoveValue = (valueToRemove) => {
        if (disabled) return;
        const currentValues = Array.isArray(value) ? value : [];
        const newValues = currentValues.filter(val => val !== valueToRemove);
        onChange({ target: { name, value: newValues } });
    };

    // Lấy label cho giá trị đã chọn
    const getDisplayLabel = (val) => {
        if (!Array.isArray(options)) return val;
        const option = options.find(opt => 
            typeof opt === 'string' ? opt === val : opt.value === val
        );
        if (typeof option === 'string') return option;
        return option ? option.label : val;
    };

    const renderMultipleSelect = () => {
        const selectedValues = Array.isArray(value) ? value : [];
        const availableOptions = Array.isArray(options) ? options.filter(opt => {
            const optValue = typeof opt === 'string' ? opt : opt.value;
            return !selectedValues.includes(optValue);
        }) : [];

        return (
            <div>
                {/* Hiển thị các giá trị đã chọn */}
                {selectedValues.length > 0 && (
                    <div className={styles.selectedValues}>
                        {selectedValues.map((val) => (
                            <div key={val} className={styles.selectedItem}>
                                <span>{getDisplayLabel(val)}</span>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveValue(val)}
                                    className={styles.removeButton}
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Select để chọn thêm option */}
                {availableOptions.length > 0 && (
                    <select
                        value=""
                        onChange={(e) => handleMultipleSelect(e.target.value)}
                        className={clsx(styles.input, { [styles.invalid]: !!error })}
                        disabled={disabled}
                    >
                        
                        <option value="" disabled>
                            {placeholder || 'Chọn thêm...'}
                        </option>
                        {availableOptions.map((opt) => {
                            if (typeof opt === 'string') {
                                return (
                                    <option key={opt} value={opt}>
                                        {opt}
                                    </option>
                                );
                            }
                            return (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            );
                        })}
                    </select>
                )}
            </div>
        );
    };

    const renderSelect = () => (
        <select
            id={inputId}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            disabled={disabled}
            className={clsx(styles.input, styles.select, { [styles.invalid]: !!error })}
        >
            {placeholder && (
                <option value="" disabled hidden>
                    {placeholder}
                </option>
            )}
            {Array.isArray(options) &&
                options.map((opt) => {
                    if (typeof opt === 'string') {
                        return (
                            <option key={opt} value={opt}>
                                {opt}
                            </option>
                        );
                    }
                    return (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    );
                })}
        </select>
    );

    const renderInput = () => (
        type === 'textarea' ? (
            <textarea
                id={inputId}
                name={name}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                rows={rows}
                className={clsx(styles.input, styles.textarea, { [styles.invalid]: !!error })}
                value={value}
                onChange={onChange}
            />
        ) : (
            <input
                id={inputId}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                autoComplete={autoComplete}
                accept={accept} // truyền xuống input file
                className={clsx(styles.input, { [styles.invalid]: !!error })}
            />
        )
    );

    return (
        <div className={clsx(styles.group, className)}>
            {label && (
                <label htmlFor={inputId} className={styles.label}>
                    {icon && <FontAwesomeIcon icon={icon} className={styles.labelIcon} />}
                    {label} {required && <span className={styles.required}>*</span>}
                </label>
            )}
            {type === 'select' && multiple ? renderMultipleSelect() : 
             type === 'select' ? renderSelect() : renderInput()}
            {error && <div className={styles.error}>{error}</div>}
        </div>
    );
}

export default FormGroup;