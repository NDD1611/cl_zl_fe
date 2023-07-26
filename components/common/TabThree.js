import styles from './TabThree.module.scss'

const TabThree = (props) => {
    return (
        <>
            <div className={styles.tabThree}>
                {props.children}
            </div>
        </>
    )
}

export default TabThree;