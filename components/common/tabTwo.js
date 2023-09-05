
import styles from './tabTwo.module.scss'
import { useSelector } from 'react-redux'

const TabTwo = (props) => {
    const showTabThree = useSelector(state => state.tabs.showTabTwo)
    return (
        <>
            {
                showTabThree &&
                <div className={styles.TabTwo}>
                    {props.children}
                </div>
            }
        </>
    )
}

export default TabTwo;