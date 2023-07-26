
import styles from './tabTwo.module.scss'

const TabTwo = (props) => {

    return (
        <>
            <div className={styles.TabTwo}>
                {props.children}
            </div>
        </>
    )
}

export default TabTwo;