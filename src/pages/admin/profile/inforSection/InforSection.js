import FormGroup from "~/components/formGroup/FormGroup";

import styles from './InforSection.module.scss';
function InforSection({ adminData, isEditing, editData, onChange }) {
    return (
        <div className={styles.infoSection}>
            <h3 className={styles.sectionTitle}>Thông tin chi tiết</h3>

            <div className={styles.formGrid}>
                <FormGroup
                    className={styles.inputField}
                    label="Họ và tên"
                    type="text"
                    id="fullName"
                    name="fullName"
                    placeholder="Nhập họ và tên"
                    value={isEditing ? editData.fullName : adminData.fullName}
                    onChange={onChange}
                    disabled={!isEditing}
                    required
                />
                <FormGroup
                    className={styles.inputField}
                    label="Email"
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Nhập email"
                    value={isEditing ? editData.email : adminData.email}
                    onChange={onChange}
                    disabled={true}
                    // required
                />
                <FormGroup
                    className={styles.inputField}
                    label="Số điện thoại"
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="Nhập số điện thoại"
                    value={isEditing ? editData.phone : adminData.phone}
                    onChange={onChange}
                    disabled={!isEditing}
                    required
                />
                <FormGroup
                    className={styles.inputField}
                    label="Vai trò"
                    type="text"
                    id="role"
                    name="role"
                    value={adminData.role}
                    disabled
                />
                <FormGroup
                    className={styles.inputField}
                    label="Ngày tạo tài khoản"
                    type="text"
                    id="createdAt"
                    name="createdAt"
                    value={adminData.createdAt}
                    disabled
                />
            </div>
        </div>
    );
}

export default InforSection;