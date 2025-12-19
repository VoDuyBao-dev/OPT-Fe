import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import styles from './Search.module.scss'

function Search(){
    const [value, setValue] = useState('');
    const handleValue = (e)=>{
        setValue(e.target.value)
    }
    return( 
        <div className={styles.search}>
            <form className={styles.searchForm} id="searchForm">
                <div className={styles.searchInput}>
                    <input
                        type="text"
                        id="Search"
                        aria-label="Search"
                        placeholder="Tìm kiếm..."
                        className={styles.searchInputItem}
                        value={value}
                        onChange={handleValue}
                        ></input>
                </div>
                <div className={styles.searchIcon}>
                    <span>
                        <FontAwesomeIcon icon={faSearch}/>
                    </span>
                </div>
            </form>
        </div>
    )
}
export default Search;