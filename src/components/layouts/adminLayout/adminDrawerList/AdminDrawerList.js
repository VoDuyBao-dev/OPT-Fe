import { Link } from "react-router-dom";
import { Box, List, Divider, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import styles from "./AdminDrawerList.module.scss";

function AdminDrawerList({ onClick }) {
    const listMenuItems = [
        {
            text: 'Dashboard',
            icon: <HomeIcon className={styles.icon} />, // Add appropriate icon here
            link: '/admin/dashboard',
        },
        {
            text: 'QL người học',
            icon: <PersonIcon className={styles.icon} />, // Add appropriate icon here
            link: '/admin/learner-management',
        },
        {
            text: 'QL gia sư',
            icon: <SchoolIcon className={styles.icon} />, // Add appropriate icon here
            link: '/admin/tutor-management',

        },
        {
            text: 'EBooks',
            icon: <MenuBookIcon className={styles.icon} />, // Add appropriate icon here
            link: '/admin/e-books',

        },
    ];
    return (
        <Box
            sx={{ width: 250 }}
            padding={'40px 0'}
            role="presentation"
            onClick={onClick}
        >
            <List>
                {listMenuItems.map((item, index) => (
                    <ListItem key={index} disablePadding className={styles.listItem}>
                        <ListItemButton component={Link} to={item.link} className={styles.listItemButton}>
                            <ListItemIcon className={styles.listItemIcon}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text} className={styles.listItemText} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
}

export default AdminDrawerList;