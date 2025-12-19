//ý tưởng listchildren là 
import { useState } from "react";
import MenuIcon from '@mui/icons-material/Menu';
import { Button, Drawer } from "@mui/material";
import styles from "./DrawerLayout.module.scss";

function DrawerLayout({ DrawerList }) {
    const [isOpen, setIsOpen] = useState(false);
    const toggleDrawer = (newOpen) => () => {
        setIsOpen(newOpen);
    };
    return (
        <div className={styles.drawer}>
            <Button onClick={toggleDrawer(true)} className={styles.button} ><MenuIcon className={styles.menuIcon} /></Button>
            <Drawer 
                open={isOpen} 
                onClose={toggleDrawer(false)}
                className={styles.drawerContent}
            >
                <DrawerList onClick={toggleDrawer(false)} />
            </Drawer>
        </div>
    );
}

export default DrawerLayout;