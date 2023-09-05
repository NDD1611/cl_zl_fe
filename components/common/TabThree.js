import styles from './TabThree.module.scss'
import { useSelector } from 'react-redux';

const TabThree = (props) => {
    const showTabThree = useSelector(state => state.tabs.showTabThree)
    return (
        <>
            {
                showTabThree &&
                <div className={styles.tabThree}>
                    {props.children}
                </div>
            }
        </>
    )
}

export default TabThree;