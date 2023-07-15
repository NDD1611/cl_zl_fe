import styles from './Avatar.module.scss'
const Avatar = ({ src, width }) => {
    return (
        <>
            <div className={styles.Avatar} style={{ width: width }}>
                <img src={src ? src : '/images/profile.png'} />
            </div >
        </>
    )
}

export default Avatar